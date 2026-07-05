const TELEGRAM_API_BASE = "https://api.telegram.org";

module.exports = async function handler(req, res) {
  res.setHeader("Content-Type", "application/json; charset=utf-8");

  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return res.status(405).json({ ok: false, error: "method_not_allowed" });
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
    console.error("Lead request failed", error);
    return res.status(500).json({ ok: false, error: "request_failed" });
  }
};

async function readRequestBody(req) {
  if (req.body && typeof req.body === "object") return req.body;

  if (typeof req.body === "string") {
    return parseBodyString(req.body, req.headers["content-type"]);
  }

  const chunks = [];

  for await (const chunk of req) {
    chunks.push(Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk));
  }

  const rawBody = Buffer.concat(chunks).toString("utf8");
  return parseBodyString(rawBody, req.headers["content-type"]);
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
    pageUrl: truncate(cleanString(body.pageUrl), 500),
    source: truncate(cleanString(body.source) || "request_form", 80)
  };
}

function validateLead(lead) {
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
