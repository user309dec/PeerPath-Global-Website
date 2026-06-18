/* Astra 星途国际英语 — contact form handling + config-driven contact details */
(function () {
  "use strict";
  var CONFIG = window.ASTRA_CONFIG || window.PEERPATH_CONFIG || {};

  // Fill config-driven values (WeChat ID, email) wherever marked.
  document.querySelectorAll("[data-wechat]").forEach(function (el) {
    el.textContent = CONFIG.wechatId || "AstraGlobal";
  });
  document.querySelectorAll("[data-email]").forEach(function (el) {
    var email = CONFIG.email || "hello@astraedu.com";
    if (el.tagName === "A") { el.href = "mailto:" + email; }
    el.textContent = email;
  });

  var form = document.getElementById("contact-form");
  if (!form) return;
  var status = document.getElementById("contact-status");

  form.addEventListener("submit", function (e) {
    e.preventDefault();
    var ok = true;
    form.querySelectorAll("[required]").forEach(function (input) {
      var field = input.closest(".field");
      var valid = input.value.trim() !== "";
      if (input.type === "email" && valid) valid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(input.value.trim());
      field.classList.toggle("field--error", !valid);
      if (!valid) ok = false;
    });
    if (!ok) { form.querySelector(".field--error input").focus(); return; }

    var data = new FormData(form);
    var payload = {
      type: "consultation_request",
      submittedAt: new Date().toISOString(),
      name: data.get("name"),
      contact: data.get("contact"),
      preferred: data.get("preferred") || "",
      message: data.get("message") || ""
    };

    // Record locally so the team can review during early operation.
    try {
      var key = "peerpath_contacts";
      var list = JSON.parse(localStorage.getItem(key) || "[]");
      list.push(payload);
      localStorage.setItem(key, JSON.stringify(list));
    } catch (err) { /* ignore */ }

    // Send to backend endpoint if configured.
    if (CONFIG.submitEndpoint) {
      fetch(CONFIG.submitEndpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      }).catch(function () {});
    }

    form.reset();
    if (status) {
      status.classList.remove("hide");
      status.scrollIntoView({ behavior: "smooth", block: "center" });
    }
  });
})();
