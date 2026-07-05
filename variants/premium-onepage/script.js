const navLinks = document.querySelectorAll("[data-nav-link]");
const mobileMenu = document.querySelector("[data-mobile-menu]");
const mobileMenuToggle = document.querySelector("[data-mobile-menu-toggle]");
const mobileMenuPanel = document.getElementById("mobile-menu-panel");
const mobileSocialToggle = document.querySelector("[data-mobile-social-toggle]");
const mobileSocials = document.querySelector("[data-mobile-socials]");
const sections = ["hero", "about", "services", "works", "trust", "faq", "news", "contact"]
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

  document.querySelectorAll(".hero, .page-section").forEach((element) => addReveal(element, "reveal-section"));
  document.querySelectorAll(".hero__title, .hero__lead, .about-heading h2, .services-heading h2, .section-heading h2, .faq-layout__heading h2, .contact-copy h2")
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
  const panelId = trigger.getAttribute("aria-controls");
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
const requestHistoryButton = document.querySelector("[data-request-history]");
const formStatus = document.getElementById("form-status");
const taskField = document.getElementById("client-task");
const requestEndpoint = "/api/request";
const requestSendErrorMessage = "Заявку не удалось отправить. Позвоните мастеру по номеру на сайте.";
const requestHistoryKey = "avtomalyarRequestHistory";
let requestThanksTimer;

const setFormStatus = (message, state = "info") => {
  if (!formStatus) return;

  formStatus.textContent = message;
  formStatus.dataset.state = state;
};

const getRequestHistory = () => {
  try {
    const rawHistory = window.localStorage.getItem(requestHistoryKey);
    if (!rawHistory) return null;

    const history = JSON.parse(rawHistory);
    if (!history || typeof history !== "object") return null;

    return {
      name: typeof history.name === "string" ? history.name : "",
      phone: typeof history.phone === "string" ? history.phone : "",
      task: typeof history.task === "string" ? history.task : ""
    };
  } catch {
    return null;
  }
};

const hasRequestHistory = () => {
  const history = getRequestHistory();
  return Boolean(history?.name || history?.phone || history?.task);
};

const updateRequestHistoryButton = () => {
  requestHistoryButton?.toggleAttribute("hidden", !hasRequestHistory());
};

const applyRequestHistory = ({ includeTask = false, overwriteTask = false } = {}) => {
  const history = getRequestHistory();
  if (!history || !requestForm) return false;

  const nameField = requestForm.querySelector("#client-name");
  const phoneField = requestForm.querySelector("#client-phone");
  const taskInput = requestForm.querySelector("#client-task");

  if (history.name && nameField && !nameField.value.trim()) {
    nameField.value = history.name;
  }

  if (history.phone && phoneField && !phoneField.value.trim()) {
    phoneField.value = history.phone;
  }

  if (includeTask && history.task && taskInput && (overwriteTask || !taskInput.value.trim())) {
    taskInput.value = history.task;
  }

  return true;
};

const saveRequestHistory = () => {
  if (!requestForm) return;

  const history = {
    name: getRequestFieldValue("#client-name"),
    phone: getRequestFieldValue("#client-phone"),
    task: getRequestFieldValue("#client-task")
  };

  try {
    window.localStorage.setItem(requestHistoryKey, JSON.stringify(history));
    updateRequestHistoryButton();
  } catch {
    // If browser storage is unavailable, the form still works without history.
  }
};

const resetRequestModalState = ({ clearFields = false } = {}) => {
  window.clearTimeout(requestThanksTimer);
  requestModal?.classList.remove("is-submitted");
  requestThanks?.setAttribute("hidden", "");
  requestHistoryButton?.setAttribute("hidden", "");
  requestForm?.removeAttribute("hidden");
  setFormStatus("");

  if (clearFields) {
    requestForm?.reset();
  }

  requestForm?.querySelectorAll("[aria-invalid='true']").forEach((field) => {
    field.removeAttribute("aria-invalid");
  });
};

const showRequestThanks = () => {
  requestForm?.setAttribute("hidden", "");
  requestThanks?.removeAttribute("hidden");
  requestModal?.classList.add("is-submitted");
  requestThanks?.focus({ preventScroll: true });

  requestThanksTimer = window.setTimeout(() => {
    closeRequestModal();
  }, 4200);
};

const closeRequestModal = () => {
  window.clearTimeout(requestThanksTimer);
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
  const taskPrefill = trigger?.dataset.prefill || "";
  if (taskField) {
    taskField.value = taskPrefill;
  }
  applyRequestHistory({ includeTask: !taskPrefill });
  updateRequestHistoryButton();
  setFormStatus("");

  if (typeof requestModal.showModal === "function") {
    requestModal.showModal();
  } else {
    requestModal.setAttribute("open", "");
  }

  window.setTimeout(() => {
    const firstEmptyField = requestForm?.querySelector("input:not([type='radio']):not([value]), textarea");
    (taskField?.value ? document.getElementById("client-name") : firstEmptyField)?.focus({ preventScroll: true });
  }, 80);
};

requestHistoryButton?.addEventListener("click", () => {
  if (!applyRequestHistory({ includeTask: true, overwriteTask: true })) return;

  requestForm?.querySelectorAll("[aria-invalid='true']").forEach((field) => {
    field.removeAttribute("aria-invalid");
  });
  setFormStatus("Данные из прошлой заявки подставлены. Проверьте и отправьте заявку.", "info");
});

document.querySelectorAll("[data-prefill]").forEach((button) => {
  button.addEventListener("click", (event) => {
    event.preventDefault();
    event.stopPropagation();
    openRequestModal(button);
  });
});

document.addEventListener("click", (event) => {
  const requestTrigger = event.target instanceof Element
    ? event.target.closest("[data-request-open], a[href='#request-modal']")
    : null;
  if (!requestTrigger) return;

  event.preventDefault();
  openRequestModal(requestTrigger);
});

document.addEventListener("click", (event) => {
  const callTrigger = event.target instanceof Element
    ? event.target.closest("[data-call-open], a[href='#call-modal']")
    : null;
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

const getRequestFieldValue = (selector) => requestForm?.querySelector(selector)?.value.trim() || "не указано";

const buildRequestPayload = () => ({
  name: getRequestFieldValue("#client-name"),
  phone: getRequestFieldValue("#client-phone"),
  task: getRequestFieldValue("#client-task"),
  personalDataAgreement: Boolean(requestForm?.querySelector("#personal-data-agreement")?.checked),
  offerAgreement: Boolean(requestForm?.querySelector("#offer-agreement")?.checked),
  pageUrl: window.location.href,
  source: "request_form"
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

const trackLeadSubmitSuccess = () => {
  if (typeof window.va !== "function") return;

  window.va("event", "lead_submit_success", {
    form: "request_modal",
    source: "request_form"
  });
};
const validateRequestForm = () => {
  const nameField = requestForm?.querySelector("#client-name");
  const phoneField = requestForm?.querySelector("#client-phone");
  const taskField = requestForm?.querySelector("#client-task");
  const personalDataAgreement = requestForm?.querySelector("#personal-data-agreement");
  const offerAgreement = requestForm?.querySelector("#offer-agreement");
  const nameValue = nameField?.value.trim() || "";
  const phoneValue = phoneField?.value.trim() || "";
  const taskValue = taskField?.value.trim() || "";
  const phoneDigits = phoneValue.replace(/\D/g, "");

  [nameField, phoneField, taskField, personalDataAgreement, offerAgreement].forEach((field) => field?.removeAttribute("aria-invalid"));

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

  const submitButton = requestForm.querySelector(".form-submit");
  submitButton?.setAttribute("disabled", "");
  setFormStatus("Отправляем заявку...", "info");

  try {
    await submitRequest();
    saveRequestHistory();
    trackLeadSubmitSuccess();
    showRequestThanks();
  } catch {
    setFormStatus(requestSendErrorMessage, "error");
  } finally {
    submitButton?.removeAttribute("disabled");
  }
});

requestForm?.querySelectorAll("input, textarea").forEach((field) => {
  field.addEventListener("input", () => {
    field.removeAttribute("aria-invalid");
  });
});


