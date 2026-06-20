/* ==========================================================================
   Astra 星途国际英语 — Placement Test engine
   Steps: (1) student info form  ->  (2) timed reading test  ->  (3) result
   Records the submission locally (and to a backend endpoint if configured).
   ========================================================================== */
(function () {
  "use strict";

  var TEST = window.PLACEMENT_TEST;
  var CONFIG = window.ASTRA_CONFIG || window.PEERPATH_CONFIG || {};
  if (!TEST) return;

  var els = {
    stepInfo:   document.getElementById("step-info"),
    stepTest:   document.getElementById("step-test"),
    stepResult: document.getElementById("step-result"),
    infoForm:   document.getElementById("info-form"),
    testForm:   document.getElementById("test-form"),
    passages:   document.getElementById("passages"),
    timer:      document.getElementById("timer"),
    timerDot:   document.getElementById("timer-dot"),
    progress:   document.getElementById("progress-fill"),
    progressTxt:document.getElementById("progress-text"),
    submitBtn:  document.getElementById("submit-test"),
    result:     document.getElementById("result-body"),
    durationLabel: document.getElementById("duration-label")
  };

  var state = {
    student: null,
    startedAt: null,
    remaining: TEST.durationMinutes * 60,
    timerId: null,
    totalQuestions: 0
  };

  // ---- Step 1: student information -------------------------------------
  if (els.durationLabel) els.durationLabel.textContent = TEST.durationMinutes;

  function validateInfo(form) {
    var ok = true;
    form.querySelectorAll("[required]").forEach(function (input) {
      var field = input.closest(".field");
      var valid = input.value.trim() !== "";
      if (input.type === "email" && valid) {
        valid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(input.value.trim());
      }
      field.classList.toggle("field--error", !valid);
      if (!valid) ok = false;
    });
    return ok;
  }

  if (els.infoForm) {
    els.infoForm.addEventListener("submit", function (e) {
      e.preventDefault();
      if (!validateInfo(els.infoForm)) {
        els.infoForm.querySelector(".field--error input, .field--error select").focus();
        return;
      }
      var data = new FormData(els.infoForm);
      state.student = {
        name: data.get("name"),
        email: data.get("email"),
        phone: data.get("phone") || "",
        wechat: data.get("wechat") || "",
        city: data.get("city") || "",
        grade: data.get("grade") || "",
        goal: data.get("goal") || "",
        timeline: data.get("timeline") || ""
      };
      startTest();
    });
  }

  // ---- Step 2: render & run the test -----------------------------------
  function startTest() {
    renderTest();
    els.stepInfo.classList.add("hide");
    els.stepTest.classList.remove("hide");
    window.scrollTo({ top: 0, behavior: "smooth" });
    state.startedAt = Date.now();
    startTimer();
    updateProgress();
  }

  function renderTest() {
    var html = "";
    var qCount = 0;
    TEST.passages.forEach(function (p) {
      html += '<article class="passage">';
      html += '<h3>' + esc(p.title) + '</h3>';
      html += '<div class="passage__meta">' + esc(p.meta) + '</div>';
      html += '<div class="passage__body">';
      p.paragraphs.forEach(function (para, i) {
        html += '<p data-para="' + (i + 1) + '">' + esc(para) + '</p>';
      });
      html += '</div></article>';

      p.questions.forEach(function (q) {
        qCount++;
        html += renderQuestion(q, qCount);
      });
    });
    state.totalQuestions = qCount;
    els.passages.innerHTML = html;

    // Visual selected-state + progress tracking
    els.testForm.addEventListener("change", function (e) {
      if (e.target.matches('input[type="radio"]')) {
        var group = els.testForm.querySelectorAll('input[name="' + e.target.name + '"]');
        group.forEach(function (i) { i.closest(".option").classList.toggle("is-selected", i.checked); });
      }
      if (e.target.matches('input[type="checkbox"]')) {
        e.target.closest(".option").classList.toggle("is-selected", e.target.checked);
      }
      updateProgress();
    });
  }

  function renderQuestion(q, num) {
    var html = '<div class="question" id="' + q.id + '" data-type="' + q.type + '">';
    html += '<div class="question__num">QUESTION ' + num + ' · ' + esc(q.skill) + '</div>';
    html += '<p class="question__text">' + esc(q.prompt) + '</p>';
    if (q.hint) html += '<p class="question__hint">' + esc(q.hint) + '</p>';
    var inputType = q.type === "multi" ? "checkbox" : "radio";
    q.options.forEach(function (opt, i) {
      var letter = String.fromCharCode(65 + i);
      html += '<label class="option">';
      html += '<input type="' + inputType + '" name="' + q.id + '" value="' + i + '">';
      html += '<span class="option__label"><b>' + letter + '.</b> ' + esc(opt) + '</span>';
      html += '</label>';
    });
    html += '</div>';
    return html;
  }

  function updateProgress() {
    var answered = 0;
    TEST.passages.forEach(function (p) {
      p.questions.forEach(function (q) {
        if (els.testForm.querySelector('input[name="' + q.id + '"]:checked')) answered++;
      });
    });
    var pct = state.totalQuestions ? Math.round((answered / state.totalQuestions) * 100) : 0;
    if (els.progress) els.progress.style.width = pct + "%";
    if (els.progressTxt) els.progressTxt.textContent = answered + " / " + state.totalQuestions + " answered";
  }

  // ---- Timer ------------------------------------------------------------
  function startTimer() {
    renderTimer();
    state.timerId = setInterval(function () {
      state.remaining--;
      renderTimer();
      if (state.remaining <= 0) {
        clearInterval(state.timerId);
        finishTest(true);
      }
    }, 1000);
  }

  function renderTimer() {
    if (!els.timer) return;
    var m = Math.floor(state.remaining / 60);
    var s = state.remaining % 60;
    var label = (m < 10 ? "0" : "") + m + ":" + (s < 10 ? "0" : "") + s;
    var span = document.getElementById("timer-label");
    if (span) span.textContent = label;
    els.timer.classList.toggle("is-low", state.remaining <= 120);
  }

  if (els.submitBtn) {
    els.submitBtn.addEventListener("click", function () {
      var answered = els.testForm.querySelectorAll('input:checked').length;
      var msg = "确认提交测验吗？提交后将无法修改答案。\n\nSubmit your test? You will not be able to change your answers afterwards.";
      if (answered < state.totalQuestions) {
        msg = "你还有题目未作答。确认现在提交吗？\n\nSome questions are unanswered. Submit anyway?";
      }
      if (confirm(msg)) finishTest(false);
    });
  }

  // ---- Step 3: scoring & result ----------------------------------------
  function gatherResponses() {
    var responses = {};
    TEST.passages.forEach(function (p) {
      p.questions.forEach(function (q) {
        var checked = els.testForm.querySelectorAll('input[name="' + q.id + '"]:checked');
        responses[q.id] = Array.prototype.map.call(checked, function (i) { return Number(i.value); });
      });
    });
    return responses;
  }

  function scoreTest(responses) {
    var earned = 0, total = 0, correctCount = 0;
    var bySkill = {};
    TEST.passages.forEach(function (p) {
      p.questions.forEach(function (q) {
        total += q.points;
        bySkill[q.skill] = bySkill[q.skill] || { earned: 0, total: 0 };
        var got = 0;
        var chosen = responses[q.id] || [];
        if (q.type === "single") {
          if (chosen.length === 1 && chosen[0] === q.answer) { got = q.points; correctCount++; }
        } else {
          var correct = q.answers;
          var hits = chosen.filter(function (c) { return correct.indexOf(c) !== -1; }).length;
          var wrong = chosen.filter(function (c) { return correct.indexOf(c) === -1; }).length;
          got = Math.max(0, hits - wrong);                 // partial credit
          got = Math.min(got, q.points);
          if (got === q.points) correctCount++;
        }
        earned += got;
        bySkill[q.skill].earned += got;
        bySkill[q.skill].total += q.points;
      });
    });
    return { earned: earned, total: total, correctCount: correctCount, bySkill: bySkill };
  }

  function levelFor(pct) {
    if (pct >= 85) return {
      key: "Advanced", cn: "高阶 · 接近大学阅读水平", color: "#16a34a", bg: "#dcfce7",
      program: "University English Bridge 大学英语衔接课程",
      advice: "你的学术阅读基础扎实，已接近海外大学课堂的阅读要求。建议进入「大学英语衔接课程 University English Bridge」，重点训练 seminar 讨论、学术写作与高阶阅读策略。"
    };
    if (pct >= 70) return {
      key: "Upper-Intermediate", cn: "中高阶", color: "#2563eb", bg: "#dbeafe",
      program: "TOEFL Core Program 托福全科核心课程",
      advice: "你已具备较好的阅读理解能力，能处理大部分学术文本。建议进入「托福全科核心课程 TOEFL Core Program」系统冲刺目标分数，并补强推断题与长难句逻辑。"
    };
    if (pct >= 50) return {
      key: "Intermediate", cn: "中阶", color: "#d97706", bg: "#fef3c7",
      program: "托福阅读入学诊断 + 托福全科核心课程",
      advice: "你能理解文章主旨，但在学术词汇、细节定位与推断题上仍有提升空间。建议从「托福阅读入学诊断」起步，搭配「托福全科核心课程」稳步提升。"
    };
    return {
      key: "Foundational", cn: "基础", color: "#dc2626", bg: "#fee2e2",
      program: "TOEFL Reading Diagnostic 托福阅读入学诊断",
      advice: "你正处于打基础的阶段，建议优先扩充学术词汇、训练句子逻辑与阅读理解策略。我们会为你制定循序渐进的学习计划，从「托福阅读入学诊断」开始。"
    };
  }

  function finishTest(timedOut) {
    if (state.timerId) clearInterval(state.timerId);
    var responses = gatherResponses();
    var score = scoreTest(responses);
    var pct = score.total ? Math.round((score.earned / score.total) * 100) : 0;
    var level = levelFor(pct);
    var timeUsed = state.startedAt ? Math.round((Date.now() - state.startedAt) / 1000) : 0;

    var SUBMIT = window.ASTRA_SUBMISSIONS;
    var submissionData = {
      student: state.student,
      responses: responses,
      score: { earned: score.earned, total: score.total, percent: pct, correct: score.correctCount, of: state.totalQuestions },
      level: level.key,
      skills: score.bySkill,
      timeUsedSeconds: timeUsed,
      timedOut: !!timedOut,
      testVersion: TEST.version
    };
    var submission = SUBMIT ? SUBMIT.buildPayload("placement_test", submissionData) : submissionData;
    if (!submission.type) submission.type = "placement_test";
    if (!submission.submittedAt) submission.submittedAt = new Date().toISOString();

    saveSubmission(submission);
    renderResult(submission, level, pct, timeUsed, timedOut);

    els.stepTest.classList.add("hide");
    els.stepResult.classList.remove("hide");
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function saveSubmission(submission) {
    var SUBMIT = window.ASTRA_SUBMISSIONS;

    // 1) Always keep a local copy so the team can review during early operation.
    if (SUBMIT) {
      SUBMIT.saveLocal("peerpath_submissions", submission);
    } else {
      try {
        var key = "peerpath_submissions";
        var list = JSON.parse(localStorage.getItem(key) || "[]");
        list.push(submission);
        localStorage.setItem(key, JSON.stringify(list));
      } catch (e) { /* storage may be unavailable */ }
    }

    // 2) If a backend endpoint is configured, send it there too.
    if (SUBMIT && SUBMIT.hasEndpoint()) {
      SUBMIT.send(submission).catch(function () { /* non-blocking; student keeps result + download */ });
    } else if (CONFIG.submitEndpoint) {
      try {
        fetch(CONFIG.submitEndpoint, {
          method: "POST",
          headers: { "Content-Type": CONFIG.submitContentType || "application/json" },
          body: JSON.stringify(submission)
        }).catch(function () { /* non-blocking */ });
      } catch (e) { /* ignore */ }
    }
  }

  function renderResult(sub, level, pct, timeUsed, timedOut) {
    var min = Math.floor(timeUsed / 60), sec = timeUsed % 60;
    var timeStr = min + " 分 " + (sec < 10 ? "0" : "") + sec + " 秒";

    var skillRows = Object.keys(sub.skills).map(function (k) {
      var s = sub.skills[k];
      var sp = s.total ? Math.round((s.earned / s.total) * 100) : 0;
      return '<div class="field" style="margin-bottom:14px">' +
        '<div style="display:flex;justify-content:space-between;margin-bottom:4px;font-size:.92rem">' +
        '<span>' + esc(k) + '</span><b>' + sp + '%</b></div>' +
        '<div class="progressbar"><span style="width:' + sp + '%"></span></div></div>';
    }).join("");

    var wechat = esc(CONFIG.wechatId || "AstraGlobal");

    els.result.innerHTML =
      (timedOut ? '<div class="notice" style="margin-bottom:20px">⏱ 时间到，系统已自动提交你的答案。Time is up — your answers were submitted automatically.</div>' : '') +
      '<div class="result-card">' +
        '<span class="eyebrow">你的诊断结果 · Your Diagnostic Result</span>' +
        '<div class="score-ring" style="--pct:' + pct + '%">' +
          '<div class="score-ring__inner"><b>' + pct + '%</b><span>得分率</span></div>' +
        '</div>' +
        '<div class="level-badge" style="color:' + level.color + ';background:' + level.bg + '">' +
          'Level: ' + esc(level.key) + ' · ' + esc(level.cn) + '</div>' +
        '<div class="result-meta">' +
          '<div><b>' + sub.score.correct + ' / ' + sub.score.of + '</b><span>答对题数</span></div>' +
          '<div><b>' + sub.score.earned + ' / ' + sub.score.total + '</b><span>原始分</span></div>' +
          '<div><b>' + timeStr + '</b><span>用时</span></div>' +
        '</div>' +
        '<div style="text-align:left;max-width:480px;margin:24px auto 0">' +
          '<h3 style="font-size:1.05rem">能力分项 · Skill Breakdown</h3>' + skillRows +
        '</div>' +
        '<div class="notice" style="text-align:left;margin:22px 0">' +
          '<strong>个性化建议：</strong>' + esc(level.advice) +
          '<br><br><strong>推荐课程方向：</strong>' + esc(level.program) +
        '</div>' +
        '<p class="muted" style="font-size:.9rem">这是一份初步的自动评估。完整的个性化诊断报告将由我们的导师团队人工整理后，通过微信或视频咨询向你和家长详细解读。</p>' +
        '<div class="hero__actions" style="justify-content:center;margin-top:20px">' +
          '<a class="btn btn--primary btn--lg" href="contact.html">添加微信获取完整诊断报告</a>' +
          '<a class="btn btn--ghost" href="contact.html#book">预约初步咨询</a>' +
        '</div>' +
        '<p class="muted" style="font-size:.88rem;margin-top:18px">微信号 WeChat ID：<b>' + wechat + '</b></p>' +
        '<p style="margin-top:14px"><button type="button" class="btn btn--ghost" id="download-result">下载我的答题记录（JSON）</button></p>' +
      '</div>';

    var dl = document.getElementById("download-result");
    if (dl) dl.addEventListener("click", function () { downloadJSON(sub); });
  }

  function downloadJSON(sub) {
    var blob = new Blob([JSON.stringify(sub, null, 2)], { type: "application/json" });
    var url = URL.createObjectURL(blob);
    var a = document.createElement("a");
    var safe = (sub.student && sub.student.name ? sub.student.name : "student").replace(/[^\w一-龥-]/g, "_");
    a.href = url;
    a.download = "Astra-Placement-" + safe + ".json";
    a.click();
    URL.revokeObjectURL(url);
  }

  // ---- Helpers ----------------------------------------------------------
  function esc(str) {
    return String(str)
      .replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;").replace(/'/g, "&#39;");
  }
})();
