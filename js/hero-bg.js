/* ============================================================
   Aceistt — interactive hero background.
   A lightweight particle "constellation" that reacts to the
   cursor. Skipped for reduced-motion users (the CSS glow stays).
   ============================================================ */
(function () {
  "use strict";

  var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var canvas = document.getElementById("heroCanvas");
  if (!canvas || reduceMotion) return;

  var ctx = canvas.getContext("2d");
  var hero = canvas.parentElement;
  var dpr = Math.min(window.devicePixelRatio || 1, 2);
  var W = 0, H = 0;
  var particles = [];
  var mouse = { x: -9999, y: -9999 };
  var running = true;
  var raf = null;

  function accent() {
    // Read the live accent colour so it matches light/dark theme.
    var c = getComputedStyle(document.documentElement).getPropertyValue("--accent").trim();
    return c || "#6ea8fe";
  }
  var color = accent();

  function resize() {
    var rect = hero.getBoundingClientRect();
    W = rect.width;
    H = rect.height;
    canvas.width = W * dpr;
    canvas.height = H * dpr;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

    // Particle count scales with area, capped for performance.
    var target = Math.min(90, Math.round((W * H) / 16000));
    particles = [];
    for (var i = 0; i < target; i++) {
      particles.push({
        x: Math.random() * W,
        y: Math.random() * H,
        vx: (Math.random() * 2 - 1) * 0.3,
        vy: (Math.random() * 2 - 1) * 0.3,
        r: Math.random() * 1.6 + 0.6
      });
    }
  }

  function hexToRgb(hex) {
    var m = hex.replace("#", "");
    if (m.length === 3) m = m[0] + m[0] + m[1] + m[1] + m[2] + m[2];
    var n = parseInt(m, 16);
    return [(n >> 16) & 255, (n >> 8) & 255, n & 255];
  }

  function draw() {
    if (!running) return;
    ctx.clearRect(0, 0, W, H);
    var rgb = hexToRgb(color);
    var rgbStr = rgb[0] + "," + rgb[1] + "," + rgb[2];
    var LINK = 130;

    for (var i = 0; i < particles.length; i++) {
      var p = particles[i];

      // Cursor repulsion.
      var dx = p.x - mouse.x, dy = p.y - mouse.y;
      var dist = Math.sqrt(dx * dx + dy * dy);
      if (dist < 120 && dist > 0) {
        var force = (120 - dist) / 120;
        p.vx += (dx / dist) * force * 0.6;
        p.vy += (dy / dist) * force * 0.6;
      }

      p.x += p.vx;
      p.y += p.vy;
      p.vx *= 0.98;
      p.vy *= 0.98;

      // Gentle drift floor so they never fully stop.
      if (Math.abs(p.vx) < 0.05) p.vx += (Math.random() * 2 - 1) * 0.05;
      if (Math.abs(p.vy) < 0.05) p.vy += (Math.random() * 2 - 1) * 0.05;

      // Wrap around edges.
      if (p.x < 0) p.x = W; else if (p.x > W) p.x = 0;
      if (p.y < 0) p.y = H; else if (p.y > H) p.y = 0;

      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fillStyle = "rgba(" + rgbStr + ",0.8)";
      ctx.fill();

      // Links to nearby particles.
      for (var j = i + 1; j < particles.length; j++) {
        var q = particles[j];
        var lx = p.x - q.x, ly = p.y - q.y;
        var ld = Math.sqrt(lx * lx + ly * ly);
        if (ld < LINK) {
          ctx.beginPath();
          ctx.moveTo(p.x, p.y);
          ctx.lineTo(q.x, q.y);
          ctx.strokeStyle = "rgba(" + rgbStr + "," + (0.12 * (1 - ld / LINK)).toFixed(3) + ")";
          ctx.lineWidth = 1;
          ctx.stroke();
        }
      }
    }
    raf = requestAnimationFrame(draw);
  }

  function start() { if (!raf) { running = true; raf = requestAnimationFrame(draw); } }
  function stop() { running = false; if (raf) { cancelAnimationFrame(raf); raf = null; } }

  window.addEventListener("mousemove", function (e) {
    var rect = hero.getBoundingClientRect();
    mouse.x = e.clientX - rect.left;
    mouse.y = e.clientY - rect.top;
  }, { passive: true });
  window.addEventListener("mouseout", function () { mouse.x = -9999; mouse.y = -9999; });

  window.addEventListener("resize", resize);

  // Refresh accent colour when theme changes.
  document.addEventListener("i18n:changed", function () {}); // no-op keep parity
  var themeBtn = document.getElementById("themeToggle");
  if (themeBtn) themeBtn.addEventListener("click", function () {
    setTimeout(function () { color = accent(); }, 0);
  });

  // Pause when the hero scrolls out of view (saves battery/CPU).
  if ("IntersectionObserver" in window) {
    new IntersectionObserver(function (entries) {
      entries.forEach(function (en) { en.isIntersecting ? start() : stop(); });
    }, { threshold: 0 }).observe(hero);
  }

  resize();
  start();
})();
