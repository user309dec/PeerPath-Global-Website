/* ==========================================================================
   Astra 星途国际英语 — site-wide configuration
   Edit these values to update branding & contact details across the whole site.
   js/main.js injects brand fields into any element marked with the matching
   data-* attribute (data-brand-en / data-brand-cn / data-brand-mark / data-tagline).
   ========================================================================== */
window.ASTRA_CONFIG = {
  brandEn: "Astra",                       // 英文品牌名
  brandCn: "星途国际英语",                 // 中文品牌名
  brandFull: "Astra 星途国际英语",         // 完整品牌名（标题等使用）
  brandMark: "A",                         // Logo 字母标识
  tagline: "由真实海外在校生带你点亮留学星途，完成从申请英语到大学英语的过渡。",
  wechatId: "AstraGlobal",                // TODO: 替换为正式微信号
  email: "yc677liu@gmail.com",            // 正式咨询接收邮箱
  // 用于接收咨询预约和测验提交的 HTTPS 地址。
  // 当前使用 FormSubmit 免账号邮件端点；第一次提交后需在邮箱中点确认激活。
  submitEndpoint: "https://formsubmit.co/ajax/yc677liu@gmail.com",
  // 默认以 JSON body 发送；Google Apps Script 如遇 CORS 预检问题可改为 "text/plain;charset=utf-8"。
  submitContentType: "application/json",
  // 仅 Netlify Forms 需要：改为 "form" 后会把完整 JSON 放入 payload 字段提交。
  submitBodyFormat: "json",
  netlifyFormName: "astra-submissions",
  submissionRecipientEmail: "yc677liu@gmail.com"
};

// 向后兼容旧引用，避免遗漏处报错。
window.PEERPATH_CONFIG = window.ASTRA_CONFIG;
