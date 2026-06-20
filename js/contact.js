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
  var submitBtn = form.querySelector('button[type="submit"]');
  var submitBtnLabel = submitBtn ? submitBtn.textContent : "";
  var SUBMIT = window.ASTRA_SUBMISSIONS;

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
    var payload = SUBMIT ? SUBMIT.buildPayload("consultation_request", {
      name: data.get("name"),
      contact: data.get("contact"),
      preferred: data.get("preferred") || "",
      message: data.get("message") || ""
    }) : {
      type: "consultation_request",
      submittedAt: new Date().toISOString(),
      site: CONFIG.brandFull || "Astra 星途国际英语",
      pageUrl: window.location.href,
      recipientEmail: CONFIG.submissionRecipientEmail || CONFIG.email || "",
      name: data.get("name"),
      contact: data.get("contact"),
      preferred: data.get("preferred") || "",
      message: data.get("message") || ""
    };

    // Record locally so the team can review during early operation.
    var localSaved = SUBMIT ? SUBMIT.saveLocal("peerpath_contacts", payload) : saveLocal(payload);

    if (!SUBMIT || !SUBMIT.hasEndpoint()) {
      setBusy(false);
      showStatus("warning",
        "<strong>已在本浏览器保存，但尚未发送给 Astra。</strong> 当前没有配置在线接收端；请直接添加微信或发送邮件，确保我们能收到你的预约信息。");
      return;
    }

    setBusy(true);
    showStatus("sending", "<strong>正在提交预约...</strong> 请稍等，我们正在发送你的信息。");

    SUBMIT.send(payload).then(function () {
      form.reset();
      setBusy(false);
      showStatus("success",
        "<strong>已收到你的预约！</strong> 我们会尽快通过微信或邮箱与你联系。如需更快沟通，欢迎直接扫码添加微信。");
    }).catch(function () {
      setBusy(false);
      showStatus("error",
        "<strong>暂时未能发送到在线接收端。</strong> 请直接添加微信或发送邮件给 " + esc(CONFIG.email || "yc677liu@gmail.com") + "；" +
        (localSaved ? "本浏览器已保留一份本地记录。" : "本浏览器也未能保存本地记录。"));
    });
  });

  function setBusy(isBusy) {
    if (!submitBtn) return;
    submitBtn.disabled = !!isBusy;
    submitBtn.textContent = isBusy ? "提交中... Sending..." : submitBtnLabel;
  }

  function showStatus(kind, html) {
    if (!status) return;
    status.classList.remove("hide", "notice--success", "notice--warning", "notice--error", "notice--sending");
    status.classList.add("notice--" + kind);
    status.innerHTML = html;
    status.scrollIntoView({ behavior: "smooth", block: "center" });
  }

  function saveLocal(payload) {
    try {
      var key = "peerpath_contacts";
      var list = JSON.parse(localStorage.getItem(key) || "[]");
      list.push(payload);
      localStorage.setItem(key, JSON.stringify(list));
      return true;
    } catch (err) {
      return false;
    }
  }

  function esc(str) {
    return String(str)
      .replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;").replace(/'/g, "&#39;");
  }
})();
