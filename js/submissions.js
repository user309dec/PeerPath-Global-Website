/* Astra 星途国际英语 — shared static-friendly submission helpers */
(function () {
  "use strict";

  var CONFIG = window.ASTRA_CONFIG || window.PEERPATH_CONFIG || {};
  var DEFAULT_TIMEOUT_MS = 15000;

  function endpoint() {
    return typeof CONFIG.submitEndpoint === "string" ? CONFIG.submitEndpoint.trim() : "";
  }

  function hasEndpoint() {
    return endpoint() !== "";
  }

  function saveLocal(key, payload) {
    try {
      var list = JSON.parse(localStorage.getItem(key) || "[]");
      list.push(payload);
      localStorage.setItem(key, JSON.stringify(list));
      return true;
    } catch (e) {
      return false;
    }
  }

  function buildPayload(type, data) {
    var payload = {
      type: type,
      _subject: "New Astra submission: " + type,
      _captcha: "false",
      submittedAt: new Date().toISOString(),
      site: CONFIG.brandFull || "Astra 星途国际英语",
      pageUrl: window.location.href,
      recipientEmail: CONFIG.submissionRecipientEmail || CONFIG.email || ""
    };
    Object.keys(data || {}).forEach(function (key) {
      payload[key] = data[key];
    });
    return payload;
  }

  function send(payload) {
    if (!hasEndpoint()) {
      return Promise.resolve({ sent: false, skipped: true });
    }
    if (!window.fetch) {
      return Promise.reject(new Error("This browser does not support fetch()."));
    }

    var bodyFormat = CONFIG.submitBodyFormat || "json";
    var contentType = CONFIG.submitContentType || "application/json";
    var body = JSON.stringify(payload);

    if (bodyFormat === "form") {
      contentType = "application/x-www-form-urlencoded;charset=UTF-8";
      body = encodeFormPayload(payload);
    }

    var controller = window.AbortController ? new AbortController() : null;
    var timeoutId = controller ? window.setTimeout(function () {
      controller.abort();
    }, CONFIG.submitTimeoutMs || DEFAULT_TIMEOUT_MS) : null;

    return fetch(endpoint(), {
      method: "POST",
      headers: {
        "Content-Type": contentType,
        "Accept": "application/json"
      },
      body: body,
      mode: "cors",
      signal: controller ? controller.signal : undefined
    }).then(function (response) {
      if (!response.ok) {
        throw new Error("Submission endpoint returned HTTP " + response.status + ".");
      }
      return parseEndpointResponse(response).then(function (data) {
        if (data && (data.success === false || data.success === "false" || data.ok === false)) {
          throw new Error(data.message || "Submission endpoint did not accept the request.");
        }
        return { sent: true, status: response.status, data: data };
      });
    }).then(function (result) {
      if (timeoutId) window.clearTimeout(timeoutId);
      return result;
    }).catch(function (error) {
      if (timeoutId) window.clearTimeout(timeoutId);
      throw error;
    });
  }

  function encodeFormPayload(payload) {
    var params = new URLSearchParams();
    var student = payload.student || {};
    params.append("form-name", CONFIG.netlifyFormName || "astra-submissions");
    params.append("type", payload.type || "");
    params.append("submittedAt", payload.submittedAt || "");
    params.append("name", payload.name || student.name || "");
    params.append("contact", payload.contact || student.email || student.wechat || student.phone || "");
    params.append("recipientEmail", payload.recipientEmail || "");
    params.append("payload", JSON.stringify(payload));
    return params.toString();
  }

  function parseEndpointResponse(response) {
    var contentType = response.headers && response.headers.get("content-type");
    if (contentType && contentType.indexOf("application/json") !== -1) {
      return response.json().catch(function () { return null; });
    }
    return response.text().then(function (text) {
      if (!text) return null;
      try { return JSON.parse(text); }
      catch (e) { return { raw: text }; }
    }).catch(function () { return null; });
  }

  window.ASTRA_SUBMISSIONS = {
    buildPayload: buildPayload,
    endpoint: endpoint,
    hasEndpoint: hasEndpoint,
    saveLocal: saveLocal,
    send: send
  };
})();
