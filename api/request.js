const crypto = require("crypto");
const TELEGRAM_API_BASE = "https://api.telegram.org";
const MAX_BODY_BYTES = 16 * 1024;
const MIN_FORM_ELAPSED_MS = 1200;
const MAX_FORM_ELAPSED_MS = 2 * 60 * 60 * 1000;
const RATE_LIMIT_WINDOW_MS = 60 * 1000;
const RATE_LIMIT_MAX_REQUESTS = 5;
const rateLimitBuckets = new Map();

module.exports = async function handler(req, res) {
  res.setHeader("Content-Type", "application/json; charset=utf-8");

  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return res.status(405).json({ ok: false, error: "method_not_allowed" });
  }

  const originError = validateRequestOrigin(req);
  if (originError) {
    return res.status(403).json({ ok: false, error: originError });
  }

  const rateLimit = consumeRateLimit(req);
  if (!rateLimit.allowed) {
    res.setHeader("Retry-After", String(rateLimit.retryAfterSeconds));
    return res.status(429).json({ ok: false, error: "rate_limited" });
  }

  try {
    const body = await readRequestBody(req);
    const lead = normalizeLead(body);
    const validationError = validateLead(lead);

    if (validationError) {
      return res.status(400).json({ ok: false, error: validationError });
    }

    const botToken = process.env.TELEGRAM_BOT_TOKEN;
    const chatId = process.env.TELEGRAM_CHAT_ID;

    if (!botToken || !chatId) {
      console.error("Telegram lead delivery is not configured");
      return res.status(500).json({ ok: false, error: "telegram_not_configured" });
    }

    const telegramResponse = await fetch(`${TELEGRAM_API_BASE}/bot${botToken}/sendMessage`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        chat_id: chatId,
        text: buildTelegramMessage(lead),
        disable_web_page_preview: true
      })
    });

    if (!telegramResponse.ok) {
      const telegramError = await safeReadTelegramError(telegramResponse);
      console.error("Telegram lead delivery failed", telegramError);
      return res.status(502).json({ ok: false, error: "telegram_send_failed" });
    }

    if (process.env.LEADS_STATS_ENABLED === "true") {
      console.info("lead_submit_success", {
        source: lead.source,
        pageUrl: lead.pageUrl || "unknown"
      });
    }

    return res.status(200).json({ ok: true });
  } catch (error) {
    if (error?.code === "request_too_large") {
      return res.status(413).json({ ok: false, error: "request_too_large" });
    }

    console.error("Lead request failed", error);
    return res.status(500).json({ ok: false, error: "request_failed" });
  }
};

function validateRequestOrigin(req) {
  const origin = cleanString(req.headers?.origin);
  if (origin === "https://avtomalyarmrpl.ru") return "";
  if (!origin) return process.env.VERCEL_ENV === "production" ? "invalid_origin" : "";

  const isLocalPreview = process.env.VERCEL_ENV !== "production"
    && /^http:\/\/(127\.0\.0\.1|localhost)(:\d+)?$/.test(origin);
  return isLocalPreview ? "" : "invalid_origin";
}

function consumeRateLimit(req) {
  const forwardedFor = cleanString(req.headers?.["x-forwarded-for"]);
  const clientAddress = forwardedFor.split(",", 1)[0].trim() || cleanString(req.socket?.remoteAddress) || "unknown";
  const clientKey = crypto.createHash("sha256").update(clientAddress).digest("hex");
  const now = Date.now();
  if (rateLimitBuckets.size > 1000) {
    for (const [key, bucket] of rateLimitBuckets) {
      if (now - bucket.startedAt >= RATE_LIMIT_WINDOW_MS) rateLimitBuckets.delete(key);
    }
  }

  const bucket = rateLimitBuckets.get(clientKey);
  if (!bucket || now - bucket.startedAt >= RATE_LIMIT_WINDOW_MS) {
    rateLimitBuckets.set(clientKey, { count: 1, startedAt: now });
    return { allowed: true, retryAfterSeconds: 0 };
  }

  if (bucket.count >= RATE_LIMIT_MAX_REQUESTS) {
    const remainingMs = RATE_LIMIT_WINDOW_MS - (now - bucket.startedAt);
    return { allowed: false, retryAfterSeconds: Math.max(1, Math.ceil(remainingMs / 1000)) };
  }

  bucket.count += 1;
  return { allowed: true, retryAfterSeconds: 0 };
}

function requestTooLargeError() {
  const error = new Error("request_too_large");
  error.code = "request_too_large";
  return error;
}

async function readRequestBody(req) {
  const contentLength = Number(req.headers?.["content-length"] || 0);
  if (Number.isFinite(contentLength) && contentLength > MAX_BODY_BYTES) throw requestTooLargeError();

  if (req.body && typeof req.body === "object") {
    if (Buffer.byteLength(JSON.stringify(req.body), "utf8") > MAX_BODY_BYTES) throw requestTooLargeError();
    return req.body;
  }

  if (typeof req.body === "string") {
    if (Buffer.byteLength(req.body, "utf8") > MAX_BODY_BYTES) throw requestTooLargeError();
    return parseBodyString(req.body, req.headers?.["content-type"]);
  }

  const chunks = [];
  let totalBytes = 0;

  for await (const chunk of req) {
    const buffer = Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk);
    totalBytes += buffer.length;
    if (totalBytes > MAX_BODY_BYTES) throw requestTooLargeError();
    chunks.push(buffer);
  }

  const rawBody = Buffer.concat(chunks).toString("utf8");
  return parseBodyString(rawBody, req.headers?.["content-type"]);
}
function parseBodyString(rawBody, contentType = "") {
  if (!rawBody) return {};

  if (contentType.includes("application/x-www-form-urlencoded")) {
    return Object.fromEntries(new URLSearchParams(rawBody));
  }

  try {
    return JSON.parse(rawBody);
  } catch {
    return {};
  }
}

function normalizeLead(body) {
  return {
    name: truncate(cleanString(body.name), 120),
    phone: truncate(cleanString(body.phone), 80),
    task: truncate(cleanString(body.task), 1200),
    personalDataAgreement: toBoolean(body.personalDataAgreement),
    offerAgreement: toBoolean(body.offerAgreement),
    pageUrl: normalizePagePath(body.pageUrl),
    source: truncate(cleanString(body.source), 80),
    website: truncate(cleanString(body.website), 200),
    formElapsedMs: normalizeFiniteNumber(body.formElapsedMs)
  };
}

function normalizePagePath(value) {
  const path = truncate(cleanString(value), 500).split(/[?#]/, 1)[0];
  return path.startsWith("/") ? path : "";
}

function validateLead(lead) {
  if (lead.website) return "spam_detected";
  if (lead.source !== "request_form") return "invalid_source";
  if (lead.formElapsedMs < MIN_FORM_ELAPSED_MS) return "submission_too_fast";
  if (lead.formElapsedMs > MAX_FORM_ELAPSED_MS) return "invalid_form_timing";
  if (lead.name.length < 2) return "invalid_name";
  if (lead.phone.replace(/\D/g, "").length < 10) return "invalid_phone";
  if (lead.task.length < 8) return "invalid_task";
  if (!lead.personalDataAgreement) return "personal_data_agreement_required";
  if (!lead.offerAgreement) return "offer_agreement_required";
  return "";
}

function buildTelegramMessage(lead) {
  return [
    "Новая заявка АвтоМаляр",
    "",
    `Имя: ${lead.name}`,
    `Телефон: ${lead.phone}`,
    `Автомобиль и задача: ${lead.task}`,
    `Страница: ${lead.pageUrl || "не указано"}`,
    `Дата/время сервера: ${formatMoscowDate(new Date())} МСК`
  ].join("\n");
}

function normalizeFiniteNumber(value) {
  const number = Number(value);
  return Number.isFinite(number) && number >= 0 ? number : 0;
}

function cleanString(value) {
  return typeof value === "string" ? value.replace(/\s+/g, " ").trim() : "";
}

function truncate(value, maxLength) {
  return value.length > maxLength ? `${value.slice(0, maxLength - 1)}…` : value;
}

function toBoolean(value) {
  return value === true || value === "true" || value === "on" || value === "1";
}

function formatMoscowDate(date) {
  return new Intl.DateTimeFormat("ru-RU", {
    timeZone: "Europe/Moscow",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: false
  }).format(date);
}

async function safeReadTelegramError(response) {
  try {
    const data = await response.json();
    return {
      status: response.status,
      error_code: data.error_code,
      description: data.description
    };
  } catch {
    return { status: response.status };
  }
}
