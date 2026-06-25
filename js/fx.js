/* ============================================================
   Aceistt — fun FX: retro/CRT mode + Matrix rain.
   Triggered from the terminal ("retro" / "matrix") or palette.
   ============================================================ */
(function () {
  "use strict";

  var PF = (window.PF = window.PF || {});

  /* ---------- Retro / CRT mode ---------- */
  var overlay = null;
  function toggleRetro() {
    var on = document.body.classList.toggle("retro");
    if (on && !overlay) {
      overlay = document.createElement("div");
      overlay.className = "crt-overlay";
      overlay.setAttribute("aria-hidden", "true");
      document.body.appendChild(overlay);
    }
    if (overlay) overlay.style.display = on ? "block" : "none";
    if (on && PF.unlock) PF.unlock("retro");
    return on;
  }
  PF.toggleRetro = toggleRetro;

  /* ---------- Matrix rain ---------- */
  var matrixRunning = false;
  function matrix() {
    if (matrixRunning) return;
    matrixRunning = true;
    if (PF.unlock) PF.unlock("matrix");

    var canvas = document.createElement("canvas");
    canvas.className = "matrix-canvas";
    document.body.appendChild(canvas);
    var ctx = canvas.getContext("2d");
    var W = canvas.width = window.innerWidth;
    var H = canvas.height = window.innerHeight;
    var font = 16;
    var cols = Math.floor(W / font);
    var drops = [];
    for (var i = 0; i < cols; i++) drops[i] = Math.random() * -50;
    var glyphs = "アイウエオカキクケコｱｲｳｴｵ0123456789ABCDEFﾊﾋﾌﾍﾎ".split("");

    var start = null;
    var DURATION = 6000;
    function frame(ts) {
      if (start === null) start = ts;
      var elapsed = ts - start;

      ctx.fillStyle = "rgba(0,0,0,0.08)";
      ctx.fillRect(0, 0, W, H);
      ctx.fillStyle = "#3fd06a";
      ctx.font = font + "px monospace";
      for (var i = 0; i < drops.length; i++) {
        var ch = glyphs[Math.floor(Math.random() * glyphs.length)];
        ctx.fillText(ch, i * font, drops[i] * font);
        if (drops[i] * font > H && Math.random() > 0.975) drops[i] = 0;
        drops[i]++;
      }

      // Fade out near the end.
      if (elapsed > DURATION - 1200) {
        canvas.style.opacity = String(Math.max(0, (DURATION - elapsed) / 1200));
      }
      if (elapsed < DURATION) {
        requestAnimationFrame(frame);
      } else {
        canvas.remove();
        matrixRunning = false;
      }
    }
    requestAnimationFrame(frame);

    // Click or key ends it early.
    var stop = function () {
      if (canvas.parentNode) { canvas.remove(); matrixRunning = false; }
      window.removeEventListener("click", stop);
      window.removeEventListener("keydown", stop);
    };
    setTimeout(function () {
      window.addEventListener("click", stop);
      window.addEventListener("keydown", stop);
    }, 50);
  }
  PF.matrix = matrix;
})();
