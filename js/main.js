/* PeerPath Global — shared site interactions */
(function () {
  "use strict";

  // Mobile nav toggle
  var header = document.querySelector(".site-header");
  var toggle = document.querySelector(".nav__toggle");
  if (toggle && header) {
    toggle.addEventListener("click", function () {
      header.classList.toggle("nav-open");
      var expanded = header.classList.contains("nav-open");
      toggle.setAttribute("aria-expanded", String(expanded));
    });
  }

  // Highlight active nav link based on current page
  var path = location.pathname.split("/").pop() || "index.html";
  document.querySelectorAll(".nav__links a").forEach(function (a) {
    var href = a.getAttribute("href");
    if (href === path || (path === "" && href === "index.html")) {
      a.classList.add("is-active");
      a.setAttribute("aria-current", "page");
    }
  });

  // FAQ accordion
  document.querySelectorAll(".faq__q").forEach(function (btn) {
    btn.addEventListener("click", function () {
      var item = btn.closest(".faq__item");
      var open = item.classList.contains("is-open");
      // Close siblings for a clean accordion feel
      var parent = item.parentElement;
      parent.querySelectorAll(".faq__item.is-open").forEach(function (other) {
        if (other !== item) {
          other.classList.remove("is-open");
          other.querySelector(".faq__q").setAttribute("aria-expanded", "false");
        }
      });
      item.classList.toggle("is-open", !open);
      btn.setAttribute("aria-expanded", String(!open));
    });
  });

  // Set current year in footers
  document.querySelectorAll("[data-year]").forEach(function (el) {
    el.textContent = new Date().getFullYear();
  });
})();
