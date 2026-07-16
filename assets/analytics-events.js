(() => {
  "use strict";

  const EVENT_PARAMETERS = Object.freeze({
    lead_form_success: ["form_name", "placement", "page_type"],
    lead_form_error: ["form_name", "error_type", "page_type"],
    phone_click: ["phone_label", "placement", "page_type"],
    messenger_click: ["channel", "placement", "page_type"],
    map_click: ["placement", "page_type"],
    case_source_click: ["channel", "case_slug", "page_type"],
    service_cta_click: ["service_slug", "placement", "page_type"]
  });

  const METRIKA_COUNTER_ID = 110708831;
  const METRIKA_GOAL_EVENTS = new Set([
    "lead_form_success",
    "phone_click",
    "messenger_click",
    "map_click",
    "case_source_click",
    "service_cta_click"
  ]);

  const cleanValue = (value) => {
    if (typeof value !== "string") return "";
    return value.replace(/[\u0000-\u001f\u007f]/g, "").trim().slice(0, 80);
  };

  const getPageType = () => {
    const declaredType = cleanValue(document.body?.dataset.pageType || "");
    if (declaredType) return declaredType;
    if (window.location.pathname.startsWith("/cases/")) return "case";
    if (window.location.pathname === "/" || window.location.pathname.endsWith("/index.html")) return "home";
    if (/privacy-policy|personal-data-consent|offer/.test(window.location.pathname)) return "legal";
    return "other";
  };

  const getPlacement = (element) => {
    const explicit = element.closest("[data-analytics-placement]")?.dataset.analyticsPlacement;
    if (explicit) return cleanValue(explicit);
    const region = element.closest("section[id], dialog[id], header, footer");
    return cleanValue(region?.id || region?.tagName?.toLowerCase() || "body");
  };

  const getChannel = (url) => {
    try {
      const hostname = new URL(url, window.location.origin).hostname.toLowerCase();
      if (hostname === "t.me" || hostname.endsWith(".t.me")) return "telegram";
      if (hostname === "max.ru" || hostname.endsWith(".max.ru")) return "max";
      if (hostname === "vk.ru" || hostname.endsWith(".vk.ru")) return "vk";
    } catch {}
    return "";
  };

  const dataLayer = Array.isArray(window.dataLayer) ? window.dataLayer : [];
  window.dataLayer = dataLayer;

  const track = (eventName, parameters = {}) => {
    const allowedParameters = EVENT_PARAMETERS[eventName];
    if (!allowedParameters) return false;

    const event = { event: eventName };
    allowedParameters.forEach((key) => {
      const value = cleanValue(parameters[key]);
      if (value) event[key] = value;
    });
    if (!event.page_type) event.page_type = getPageType();
    dataLayer.push(event);
    if (METRIKA_GOAL_EVENTS.has(eventName) && typeof window.ym === "function") {
      window.ym(METRIKA_COUNTER_ID, "reachGoal", eventName, event);
    }
    return true;
  };

  Object.defineProperty(window, "avtomalyarTrack", {
    value: track,
    writable: false,
    configurable: true
  });

  document.addEventListener("click", (event) => {
    if (!(event.target instanceof Element)) return;
    const target = event.target.closest("a, button");
    if (!target) return;

    const placement = getPlacement(target);
    const serviceSlug = cleanValue(target.dataset.serviceSlug || "");
    if (serviceSlug) {
      track("service_cta_click", { service_slug: serviceSlug, placement });
      return;
    }

    const href = target instanceof HTMLAnchorElement ? target.href : "";
    if (!href) return;

    if (href.startsWith("tel:")) {
      track("phone_click", {
        phone_label: cleanValue(target.dataset.phoneLabel || "unknown"),
        placement
      });
      return;
    }

    const channel = getChannel(href);
    const sourceSlug = cleanValue(target.closest("[data-source-slug]")?.dataset.sourceSlug || "");
    if (channel && sourceSlug) {
      track("case_source_click", { channel, case_slug: sourceSlug });
      return;
    }

    if (channel) {
      track("messenger_click", { channel, placement });
      return;
    }

    try {
      if (new URL(href).hostname.toLowerCase() === "clck.ru") {
        track("map_click", { placement });
      }
    } catch {}
  });
})();