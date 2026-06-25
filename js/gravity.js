/* ============================================================
   Aceistt — "gravity" easter egg.
   PF.gravity() drops the page's elements with simple physics;
   call again to restore everything to where it was.
   ============================================================ */
(function () {
  "use strict";

  var PF = (window.PF = window.PF || {});

  var SELECTOR = [
    ".card", ".tag", ".nav-link", ".btn", ".hero-title", ".hero-role",
    ".section-title", ".section-eyebrow", ".timeline-item", ".contact-link",
    ".repo-card", ".gh-counter", ".footer-col-title", ".footer-links li",
    ".brand-logo", ".social-link", ".about-photo", ".case-title"
  ].join(",");

  var active = false, raf = null, bodies = [];

  function activate() {
    var els = Array.prototype.slice.call(document.querySelectorAll(SELECTOR)).slice(0, 90);
    bodies = els.map(function (el) {
      var r = el.getBoundingClientRect();
      return {
        el: el,
        prev: el.getAttribute("style") || "",
        x: r.left, y: r.top, w: r.width, h: r.height,
        vx: (Math.random() * 2 - 1) * 6,
        vy: Math.random() * -4,
        rot: 0, vr: (Math.random() * 2 - 1) * 6
      };
    });
    bodies.forEach(function (b) {
      var s = b.el.style;
      s.position = "fixed";
      s.left = b.x + "px";
      s.top = b.y + "px";
      s.width = b.w + "px";
      s.height = b.h + "px";
      s.margin = "0";
      s.zIndex = "9000";
      s.transition = "none";
      s.willChange = "transform,top,left";
    });
    active = true;
    loop();
  }

  function loop() {
    if (!active) return;
    var H = window.innerHeight, W = window.innerWidth, g = 0.6;
    bodies.forEach(function (b) {
      b.vy += g;
      b.x += b.vx;
      b.y += b.vy;
      b.rot += b.vr;
      if (b.y + b.h > H) { b.y = H - b.h; b.vy *= -0.55; b.vx *= 0.85; b.vr *= 0.7; }
      if (b.x < 0) { b.x = 0; b.vx = Math.abs(b.vx) * 0.8; }
      else if (b.x + b.w > W) { b.x = W - b.w; b.vx = -Math.abs(b.vx) * 0.8; }
      b.el.style.left = b.x + "px";
      b.el.style.top = b.y + "px";
      b.el.style.transform = "rotate(" + b.rot + "deg)";
    });
    raf = requestAnimationFrame(loop);
  }

  function deactivate() {
    active = false;
    if (raf) cancelAnimationFrame(raf);
    bodies.forEach(function (b) { b.el.setAttribute("style", b.prev); });
    bodies = [];
  }

  PF.gravity = function () {
    if (active) { deactivate(); return false; }
    activate();
    return true;
  };
})();
