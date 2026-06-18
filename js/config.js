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
  email: "hello@astraedu.com",            // TODO: 替换为正式联系邮箱
  // 可选：用于接收测验提交的后端地址（如 Formspree / Google Apps Script / 自建 API）。
  // 留空则只在浏览器本地（localStorage）记录，方便早期试运营。
  submitEndpoint: ""
};

// 向后兼容旧引用，避免遗漏处报错。
window.PEERPATH_CONFIG = window.ASTRA_CONFIG;
