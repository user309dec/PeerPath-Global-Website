/* PeerPath Global — lightweight back-office viewer (reads local records) */
(function () {
  "use strict";

  function read(key) {
    try { return JSON.parse(localStorage.getItem(key) || "[]"); }
    catch (e) { return []; }
  }
  function esc(s) {
    return String(s == null ? "" : s)
      .replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
  }
  function fmt(iso) {
    if (!iso) return "";
    var d = new Date(iso);
    return isNaN(d) ? iso : d.toLocaleString();
  }

  function renderTests() {
    var list = read("peerpath_submissions");
    var el = document.getElementById("tests");
    document.getElementById("tests-count").textContent = list.length;
    if (!list.length) { el.innerHTML = '<p class="muted">暂无测验提交记录（本浏览器）。</p>'; return; }
    el.innerHTML = list.slice().reverse().map(function (s) {
      var st = s.student || {};
      var sc = s.score || {};
      var skills = Object.keys(s.skills || {}).map(function (k) {
        var v = s.skills[k]; var p = v.total ? Math.round(v.earned / v.total * 100) : 0;
        return esc(k) + " " + p + "%";
      }).join(" · ");
      return '<div class="rec">' +
        '<div class="rec__head"><b>' + esc(st.name || "—") + '</b>' +
        '<span class="rec__badge">' + esc(s.level || "") + " · " + (sc.percent || 0) + '%</span></div>' +
        '<div class="rec__meta">' + fmt(s.submittedAt) + ' · ' + esc(st.city || "") + ' · ' + esc(st.grade || "") + '</div>' +
        '<table class="rec__tbl">' +
        row("邮箱", st.email) + row("微信", st.wechat) + row("电话", st.phone) +
        row("目标", st.goal) + row("时间线", st.timeline) +
        row("得分", (sc.earned || 0) + " / " + (sc.total || 0) + " （" + (sc.correct || 0) + "/" + (sc.of || 0) + " 题）") +
        row("能力分项", skills) +
        row("用时", Math.round((s.timeUsedSeconds || 0) / 60) + " 分钟" + (s.timedOut ? "（超时自动提交）" : "")) +
        '</table></div>';
    }).join("");
  }

  function renderContacts() {
    var list = read("peerpath_contacts");
    var el = document.getElementById("contacts");
    document.getElementById("contacts-count").textContent = list.length;
    if (!list.length) { el.innerHTML = '<p class="muted">暂无咨询预约记录（本浏览器）。</p>'; return; }
    el.innerHTML = list.slice().reverse().map(function (c) {
      return '<div class="rec">' +
        '<div class="rec__head"><b>' + esc(c.name || "—") + '</b><span class="rec__meta">' + fmt(c.submittedAt) + '</span></div>' +
        '<table class="rec__tbl">' +
        row("联系方式", c.contact) + row("方向", c.preferred) + row("留言", c.message) +
        '</table></div>';
    }).join("");
  }

  function row(label, val) {
    if (!val) return "";
    return '<tr><th>' + esc(label) + '</th><td>' + esc(val) + '</td></tr>';
  }

  function exportAll() {
    var data = { exportedAt: new Date().toISOString(), submissions: read("peerpath_submissions"), contacts: read("peerpath_contacts") };
    var blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
    var url = URL.createObjectURL(blob);
    var a = document.createElement("a");
    a.href = url; a.download = "peerpath-records-" + new Date().toISOString().slice(0, 10) + ".json"; a.click();
    URL.revokeObjectURL(url);
  }

  document.getElementById("export-btn").addEventListener("click", exportAll);
  document.getElementById("refresh-btn").addEventListener("click", function () { renderTests(); renderContacts(); });
  document.getElementById("clear-btn").addEventListener("click", function () {
    if (confirm("确定要清除本浏览器中保存的所有记录吗？此操作不可撤销。")) {
      localStorage.removeItem("peerpath_submissions");
      localStorage.removeItem("peerpath_contacts");
      renderTests(); renderContacts();
    }
  });

  renderTests();
  renderContacts();
})();
