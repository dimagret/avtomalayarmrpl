const navLinks = document.querySelectorAll("[data-nav-link]");
const mobileMenu = document.querySelector("[data-mobile-menu]");
const mobileMenuToggle = document.querySelector("[data-mobile-menu-toggle]");
const mobileMenuPanel = document.getElementById("mobile-menu-panel");
const mobileSocialToggle = document.querySelector("[data-mobile-social-toggle]");
const mobileSocials = document.querySelector("[data-mobile-socials]");
const sections = ["hero", "about", "services", "works", "faq", "news", "contact"]
  .map((id) => document.getElementById(id))
  .filter(Boolean);
let activeNavId = "";
let ticking = false;
const setMobileSocialsOpen = (isOpen) => {
  if (!mobileSocialToggle || !mobileSocials) return;

  mobileSocialToggle.setAttribute("aria-expanded", String(isOpen));
  mobileSocials.hidden = !isOpen;
};

const setMobileMenuOpen = (isOpen) => {
  if (!mobileMenu || !mobileMenuToggle || !mobileMenuPanel) return;

  mobileMenu.classList.toggle("is-open", isOpen);
  mobileMenuToggle.setAttribute("aria-expanded", String(isOpen));
  mobileMenuPanel.hidden = !isOpen;

  if (!isOpen) {
    setMobileSocialsOpen(false);
  }
};

const isMobileMenuOpen = () => mobileMenuToggle?.getAttribute("aria-expanded") === "true";

mobileMenuToggle?.addEventListener("click", () => {
  setMobileMenuOpen(!isMobileMenuOpen());
});

mobileSocialToggle?.addEventListener("click", () => {
  setMobileSocialsOpen(mobileSocialToggle.getAttribute("aria-expanded") !== "true");
});

mobileMenuPanel?.querySelectorAll("a").forEach((link) => {
  link.addEventListener("click", () => setMobileMenuOpen(false));
});

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape" && isMobileMenuOpen()) {
    setMobileMenuOpen(false);
    mobileMenuToggle?.focus({ preventScroll: true });
  }
});

window.addEventListener("resize", () => {
  if (window.matchMedia("(min-width: 900px)").matches) {
    setMobileMenuOpen(false);
  }
});

const setActiveNav = (id) => {
  activeNavId = id;

  navLinks.forEach((link) => {
    const active = link.dataset.navLink === id;
    link.classList.toggle("is-active", active);

    if (active) {
      link.setAttribute("aria-current", "location");
    } else {
      link.removeAttribute("aria-current");
    }
  });
};

setActiveNav("hero");

const updateActiveNav = () => {
  const marker = window.scrollY + window.innerHeight * 0.38;
  const bottomReached = window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 4;
  let activeId = sections[0]?.id;

  if (bottomReached) {
    activeId = sections[sections.length - 1]?.id;
  } else {
    sections.forEach((section) => {
      if (section.offsetTop <= marker) {
        activeId = section.id;
      }
    });
  }

  if (activeId) {
    setActiveNav(activeId);
  }
};

const requestActiveNavUpdate = () => {
  if (ticking) return;

  ticking = true;
  window.requestAnimationFrame(() => {
    updateActiveNav();
    ticking = false;
  });
};

navLinks.forEach((link) => {
  link.addEventListener("click", () => setActiveNav(link.dataset.navLink));
});

window.addEventListener("scroll", requestActiveNavUpdate, { passive: true });
window.addEventListener("resize", requestActiveNavUpdate);
window.addEventListener("load", updateActiveNav);
updateActiveNav();

const setupHeroServiceDisclosures = () => {
  const showLabel = "\u041f\u043e\u043a\u0430\u0437\u0430\u0442\u044c \u0441\u043f\u0438\u0441\u043e\u043a \u0440\u0430\u0431\u043e\u0442";
  const hideLabel = "\u0421\u043a\u0440\u044b\u0442\u044c \u0441\u043f\u0438\u0441\u043e\u043a \u0440\u0430\u0431\u043e\u0442";

  document.querySelectorAll(".hero-service-card").forEach((card, index) => {
    const heading = card.querySelector("h3");
    const list = card.querySelector(".hero-service-card__items");
    if (!heading || !list || card.querySelector("[data-hero-service-toggle]")) return;

    heading.id ||= `hero-service-title-${index + 1}`;
    list.id ||= `hero-service-list-${index + 1}`;
    card.setAttribute("aria-labelledby", heading.id);

    const toggle = document.createElement("button");
    toggle.type = "button";
    toggle.className = "hero-service-card__toggle";
    toggle.dataset.heroServiceToggle = "";
    toggle.setAttribute("aria-controls", list.id);
    toggle.innerHTML = '<svg aria-hidden="true" focusable="false" viewBox="0 0 24 24"><path d="m9 6 6 6-6 6"/></svg>';
    card.insertBefore(toggle, list);

    const setExpanded = (expanded) => {
      toggle.setAttribute("aria-expanded", String(expanded));
      toggle.setAttribute(
        "aria-label",
        `${expanded ? hideLabel : showLabel}: ${heading.textContent.trim()}`
      );
      list.hidden = !expanded;
    };

    toggle.addEventListener("click", () => {
      setExpanded(toggle.getAttribute("aria-expanded") !== "true");
    });

    setExpanded(false);
  });
};

setupHeroServiceDisclosures();
const setupRevealMotion = () => {
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const revealItems = new Set();
  const addReveal = (element, type = "") => {
    if (!element) return;
    element.classList.add("reveal-motion");
    if (type) {
      element.classList.add(type);
    }
    revealItems.add(element);
  };

  document.querySelectorAll(".page-section").forEach((element) => addReveal(element, "reveal-section"));
  document.querySelectorAll(".about-heading h2, .services-heading h2, .section-heading h2, .faq-layout__heading h2, .contact-copy h2")
    .forEach((element) => addReveal(element, "reveal-title"));

  const staggerGroups = [
    ".journey",
    ".hero-service-list",
    ".about-stat-grid",
    ".about-card-grid",
    ".about-why-list",
    ".service-navigator",
    ".works-accordion",
    ".trust-grid",
    ".faq-categories",
    ".news-grid",
    ".contact-links"
  ];

  staggerGroups.forEach((selector) => {
    document.querySelectorAll(selector).forEach((group) => {
      Array.from(group.children).forEach((child, index) => {
        child.style.setProperty("--motion-delay", `${Math.min(index * 70, 420)}ms`);
        addReveal(child, "reveal-card");
      });
    });
  });

  if (reduceMotion || !("IntersectionObserver" in window)) {
    revealItems.forEach((element) => element.classList.add("is-visible"));
    return;
  }

  const revealObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;

      entry.target.classList.add("is-visible");
      observer.unobserve(entry.target);
    });
  }, {
    rootMargin: "0px 0px -12% 0px",
    threshold: 0.12
  });

  revealItems.forEach((element) => revealObserver.observe(element));
};

setupRevealMotion();

document.querySelectorAll("[data-scroll-target]").forEach((trigger) => {
  trigger.addEventListener("click", () => {
    const target = document.getElementById(trigger.dataset.scrollTarget);
    if (!target) return;

    window.setTimeout(() => {
      const firstField = target.querySelector("input, textarea, button");
      firstField?.focus({ preventScroll: true });
    }, 420);
  });
});

const workTriggers = document.querySelectorAll("[data-work-trigger]");
const caseModal = document.getElementById("case-modal");
const caseModalContent = document.getElementById("case-modal-content");
const caseModalClose = document.querySelector("[data-case-modal-close]");

const resetWorkTriggers = () => {
  workTriggers.forEach((trigger) => {
    trigger.classList.remove("is-active");
    trigger.setAttribute("aria-expanded", "false");
  });
};

const closeCaseModal = () => {
  if (caseModal?.open) {
    caseModal.close();
  } else {
    resetWorkTriggers();
    caseModalContent?.replaceChildren();
  }
};

const openWorkCaseModal = (trigger) => {
  const panelId = trigger.dataset.sourcePanel;
  const panel = panelId ? document.getElementById(panelId) : null;
  const detail = panel?.querySelector(".case-detail");

  if (!caseModal || !caseModalContent || !detail) return;

  resetWorkTriggers();
  trigger.classList.add("is-active");
  trigger.setAttribute("aria-expanded", "true");
  caseModalContent.replaceChildren(detail.cloneNode(true));

  if (typeof caseModal.showModal === "function") {
    caseModal.showModal();
  } else {
    caseModal.setAttribute("open", "");
  }

  caseModalClose?.focus({ preventScroll: true });
};

workTriggers.forEach((trigger) => {
  trigger.addEventListener("click", () => {
    openWorkCaseModal(trigger);
  });
});

const requestModal = document.getElementById("request-modal");
const requestModalClose = document.querySelector("[data-request-modal-close]");
const callModal = document.getElementById("call-modal");
const callModalClose = document.querySelector("[data-call-modal-close]");
const requestForm = document.getElementById("request-form");
const requestThanks = document.getElementById("request-thanks");
const formStatus = document.getElementById("form-status");
const nameField = document.getElementById("client-name");
const phoneField = document.getElementById("client-phone");
const taskField = document.getElementById("client-task");
const websiteField = document.getElementById("client-website");
const personalDataAgreement = document.getElementById("personal-data-agreement");
const offerAgreement = document.getElementById("offer-agreement");
const submitButton = requestForm?.querySelector(".form-submit");
const requestFields = [nameField, phoneField, taskField, personalDataAgreement, offerAgreement].filter(Boolean);
const requestEndpoint = "/api/request";
let requestFormStartedAt = 0;
const requestSendErrorMessage = "Заявку не удалось отправить. Позвоните мастеру по номеру на сайте.";

const setFormStatus = (message, state = "info") => {
  if (!formStatus) return;

  formStatus.textContent = message;
  formStatus.dataset.state = state;
};

try {
  try { window.localStorage.removeItem("avtomalyarRequestHistory"); } catch {}
} catch {
  // The form works even when browser storage is unavailable.
}

const clearRequestValidation = () => {
  requestFields.forEach((field) => field.removeAttribute("aria-invalid"));
};

const resetRequestModalState = ({ clearFields = false } = {}) => {
  requestModal?.classList.remove("is-submitted");
  requestThanks?.setAttribute("hidden", "");
  requestForm?.removeAttribute("hidden");
  setFormStatus("");

  if (clearFields) {
    requestForm?.reset();
  }

  clearRequestValidation();
};

const showRequestThanks = () => {
  requestForm?.setAttribute("hidden", "");
  requestThanks?.removeAttribute("hidden");
  requestModal?.classList.add("is-submitted");
  requestThanks?.focus({ preventScroll: true });
};

const closeRequestModal = () => {
  if (requestModal?.open) {
    requestModal.close();
  } else {
    resetRequestModalState({ clearFields: true });
  }
};

const closeCallModal = () => {
  if (callModal?.open) {
    callModal.close();
  }
};

const openRequestModal = (trigger) => {
  if (!requestModal) return;

  resetRequestModalState({ clearFields: true });
  requestFormStartedAt = performance.now();
  const taskPrefill = trigger?.dataset.prefill || "";
  if (taskField) {
    taskField.value = taskPrefill;
  }
  setFormStatus("");

  if (typeof requestModal.showModal === "function") {
    requestModal.showModal();
  } else {
    requestModal.setAttribute("open", "");
  }

  window.setTimeout(() => {
    const firstEmptyField = requestForm?.querySelector("input:not([type='radio']):not([value]), textarea");
    (taskField?.value ? nameField : firstEmptyField)?.focus({ preventScroll: true });
  }, 80);
};

document.addEventListener("click", (event) => {
  if (!(event.target instanceof Element)) return;

  const prefillTrigger = event.target.closest("[data-prefill]");
  if (prefillTrigger) {
    event.preventDefault();
    openRequestModal(prefillTrigger);
    return;
  }

  const requestTrigger = event.target.closest("[data-request-open], a[href='#request-modal']");
  if (requestTrigger) {
    event.preventDefault();
    openRequestModal(requestTrigger);
    return;
  }

  const callTrigger = event.target.closest("[data-call-open], a[href='#call-modal']");
  if (!callTrigger) return;

  event.preventDefault();

  if (typeof callModal?.showModal === "function") {
    callModal.showModal();
  } else {
    callModal?.setAttribute("open", "");
  }

  window.setTimeout(() => {
    callModal?.querySelector(".call-option")?.focus({ preventScroll: true });
  }, 80);
});

requestModalClose?.addEventListener("click", closeRequestModal);
callModalClose?.addEventListener("click", closeCallModal);

requestModal?.addEventListener("click", (event) => {
  if (event.target === requestModal) {
    closeRequestModal();
  }
});

requestModal?.addEventListener("close", () => {
  resetRequestModalState({ clearFields: true });
});

callModal?.addEventListener("click", (event) => {
  if (event.target === callModal) {
    closeCallModal();
  }
});

caseModalClose?.addEventListener("click", closeCaseModal);

caseModal?.addEventListener("click", (event) => {
  if (event.target === caseModal) {
    closeCaseModal();
    return;
  }

  const prefillTrigger = event.target.closest("[data-prefill]");
  if (!prefillTrigger) return;

  event.preventDefault();
  event.stopPropagation();
  closeCaseModal();
  openRequestModal(prefillTrigger);
});

caseModal?.addEventListener("close", () => {
  resetWorkTriggers();
  caseModalContent?.replaceChildren();
});

document.querySelectorAll(".faq-item").forEach((item) => {
  item.addEventListener("toggle", () => {
    if (!item.open) return;

    document.querySelectorAll(".faq-item[open]").forEach((opened) => {
      if (opened !== item) {
        opened.removeAttribute("open");
      }
    });
  });
});

const getRequestFieldValue = (field) => field?.value.trim() || "не указано";

const buildRequestPayload = () => ({
  name: getRequestFieldValue(nameField),
  phone: getRequestFieldValue(phoneField),
  task: getRequestFieldValue(taskField),
  personalDataAgreement: Boolean(personalDataAgreement?.checked),
  offerAgreement: Boolean(offerAgreement?.checked),
  pageUrl: window.location.pathname,
  source: "request_form",
  website: websiteField?.value.trim() || "",
  formElapsedMs: Math.max(0, Math.round(performance.now() - requestFormStartedAt))
});

const submitRequest = async () => {
  const response = await fetch(requestEndpoint, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(buildRequestPayload())
  });

  let data = {};

  try {
    data = await response.json();
  } catch {
    data = {};
  }

  if (!response.ok || data.ok !== true) {
    throw new Error(data.error || "request_failed");
  }
};

const REQUEST_ERROR_TYPES = new Set([
  "invalid_name",
  "invalid_phone",
  "invalid_task",
  "personal_data_agreement_required",
  "offer_agreement_required",
  "spam_detected",
  "submission_too_fast",
  "invalid_form_timing",
  "invalid_source",
  "invalid_origin",
  "rate_limited",
  "request_too_large",
  "telegram_not_configured",
  "telegram_send_failed",
  "request_failed"
]);

const trackRequestEvent = (eventName, errorType = "") => {
  if (typeof window.avtomalyarTrack !== "function") return;
  const parameters = { form_name: "request_modal", placement: "request_modal" };
  if (errorType) parameters.error_type = errorType;
  window.avtomalyarTrack(eventName, parameters);
};
const validateRequestForm = () => {
  const nameValue = nameField?.value.trim() || "";
  const phoneValue = phoneField?.value.trim() || "";
  const taskValue = taskField?.value.trim() || "";
  const phoneDigits = phoneValue.replace(/\D/g, "");

  clearRequestValidation();

  if (nameValue.length < 2) {
    setFormStatus("Укажите имя: так мастеру будет понятно, как к вам обращаться.", "error");
    nameField?.setAttribute("aria-invalid", "true");
    nameField?.focus();
    return false;
  }

  if (phoneDigits.length < 10) {
    setFormStatus("Укажите телефон: минимум 10 цифр, чтобы мастер мог связаться с вами.", "error");
    phoneField?.setAttribute("aria-invalid", "true");
    phoneField?.focus();
    return false;
  }

  if (taskValue.length < 8) {
    setFormStatus("Опишите автомобиль, повреждение или симптом: минимум 8 символов.", "error");
    taskField?.setAttribute("aria-invalid", "true");
    taskField?.focus();
    return false;
  }

  if (!personalDataAgreement?.checked) {
    setFormStatus("Подтвердите согласие на обработку персональных данных и ознакомление с политикой конфиденциальности.", "error");
    personalDataAgreement?.setAttribute("aria-invalid", "true");
    personalDataAgreement?.focus();
    return false;
  }

  if (!offerAgreement?.checked) {
    setFormStatus("Подтвердите ознакомление с офертой и порядком записи на осмотр.", "error");
    offerAgreement?.setAttribute("aria-invalid", "true");
    offerAgreement?.focus();
    return false;
  }

  return true;
};

requestForm?.addEventListener("submit", async (event) => {
  event.preventDefault();

  if (!validateRequestForm()) return;

  submitButton?.setAttribute("disabled", "");
  setFormStatus("Отправляем заявку...", "info");

  try {
    await submitRequest();
    trackRequestEvent("lead_form_success");
    showRequestThanks();
  } catch (error) {
    const errorType = REQUEST_ERROR_TYPES.has(error?.message) ? error.message : "network_or_unknown";
    trackRequestEvent("lead_form_error", errorType);
    setFormStatus(requestSendErrorMessage, "error");
  } finally {
    submitButton?.removeAttribute("disabled");
  }
});

requestFields.forEach((field) => {
  field.addEventListener("input", () => {
    field.removeAttribute("aria-invalid");
  });
});

