/* ============================================================
   Aceistt — DVD-style idle screensaver.
   After a stretch of inactivity the logo badge bounces around the
   screen, changing colour on every wall hit. A corner hit throws
   confetti. Any input dismisses it. Skipped for reduced-motion.
   ============================================================ */
(function () {
  "use strict";

  var PF = (window.PF = window.PF || {});
  if (window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

  var IDLE = 30000; // ms before it kicks in
  var COLORS = ["#6ea8fe", "#b69dff", "#3fd0c9", "#ff8a5c", "#e0436b", "#f3b05a", "#3fd06a"];

  var overlay = document.createElement("div");
  overlay.className = "saver-backdrop";
  overlay.innerHTML =
    '<div class="saver-logo" id="saverLogo">' +
      '<img src="assets/logo.png" alt="" />' +
    "</div>";
  document.body.appendChild(overlay);
  var badge = overlay.querySelector("#saverLogo");

  var active = false, raf = null, idleTimer = null;
  var x = 80, y = 80, vx = 2.4, vy = 2.4, ci = 0;

  function setColor() {
    ci = (ci + 1) % COLORS.length;
    badge.style.background = COLORS[ci];
  }

  function start() {
    if (active) return;
    active = true;
    overlay.classList.add("on");
    var W = window.innerWidth, H = window.innerHeight;
    x = Math.random() * (W - 200); y = Math.random() * (H - 100);
    vx = Math.random() < 0.5 ? -2.4 : 2.4;
    vy = Math.random() < 0.5 ? -2.4 : 2.4;
    setColor();
    loop();
  }
  function stop() {
    if (!active) return;
    active = false;
    overlay.classList.remove("on");
    if (raf) cancelAnimationFrame(raf);
  }
  function loop() {
    if (!active) return;
    var W = window.innerWidth, H = window.innerHeight;
    var bw = badge.offsetWidth, bh = badge.offsetHeight;
    x += vx; y += vy;
    var hitX = false, hitY = false;
    if (x <= 0) { x = 0; vx = Math.abs(vx); hitX = true; }
    else if (x + bw >= W) { x = W - bw; vx = -Math.abs(vx); hitX = true; }
    if (y <= 0) { y = 0; vy = Math.abs(vy); hitY = true; }
    else if (y + bh >= H) { y = H - bh; vy = -Math.abs(vy); hitY = true; }
    if (hitX || hitY) setColor();
    if (hitX && hitY && PF.confetti) PF.confetti(); // corner!
    badge.style.transform = "translate(" + x + "px," + y + "px)";
    raf = requestAnimationFrame(loop);
  }

  function resetIdle() {
    if (active) { stop(); }
    clearTimeout(idleTimer);
    idleTimer = setTimeout(start, IDLE);
  }

  ["mousemove", "mousedown", "keydown", "scroll", "touchstart", "wheel"].forEach(function (ev) {
    window.addEventListener(ev, resetIdle, { passive: true });
  });
  resetIdle();

  // Let other code start it on demand (e.g. a terminal command).
  PF.screensaver = start;
})();
