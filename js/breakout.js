/* ============================================================
   Aceistt — Breakout mini-game.
   Open via PF.breakout() (terminal "breakout" / command palette).
   Mouse or ←/→ to move the paddle. Esc closes.
   ============================================================ */
(function () {
  "use strict";

  var PF = (window.PF = window.PF || {});

  var W = 380, H = 440;
  var backdrop = document.createElement("div");
  backdrop.className = "snake-backdrop";
  backdrop.innerHTML =
    '<div class="snake-box" role="dialog" aria-label="Breakout game">' +
      '<div class="snake-head">' +
        '<span class="snake-title">🧱 Breakout</span>' +
        '<span class="snake-score">Score <b id="bkScore">0</b> · Lives <b id="bkLives">3</b></span>' +
        '<button class="snake-close" id="bkClose" aria-label="Close">×</button>' +
      "</div>" +
      '<canvas id="bkCanvas" width="' + W + '" height="' + H + '"></canvas>' +
      '<div class="snake-foot" id="bkFoot">Move with the mouse or ←/→ · click to launch · Esc to quit</div>' +
    "</div>";
  document.body.appendChild(backdrop);

  var canvas = backdrop.querySelector("#bkCanvas");
  var ctx = canvas.getContext("2d");
  var scoreEl = backdrop.querySelector("#bkScore");
  var livesEl = backdrop.querySelector("#bkLives");
  var foot = backdrop.querySelector("#bkFoot");

  var COLS = 8, ROWS = 5, PAD = 6;
  var bw = (W - PAD * (COLS + 1)) / COLS, bh = 16;
  var paddle, ball, bricks, score, lives, running, raf, leftKey, rightKey;

  function css(v, d) { return getComputedStyle(document.documentElement).getPropertyValue(v).trim() || d; }

  function reset() {
    paddle = { w: 74, h: 12, x: (W - 74) / 2 };
    ball = { x: W / 2, y: H - 60, r: 6, vx: 0, vy: 0, live: false };
    score = 0; lives = 3; running = false;
    leftKey = rightKey = false;
    bricks = [];
    for (var r = 0; r < ROWS; r++)
      for (var c = 0; c < COLS; c++)
        bricks.push({ x: PAD + c * (bw + PAD), y: 40 + r * (bh + PAD), alive: true, row: r });
    scoreEl.textContent = "0"; livesEl.textContent = "3";
    draw();
  }
  function launch() {
    if (ball.live || running === "over" || running === "win") {
      if (running === "over" || running === "win") { reset(); }
    }
    ball.live = true; running = true;
    ball.vx = 3 * (Math.random() < 0.5 ? -1 : 1);
    ball.vy = -3.4;
    foot.textContent = "Break all the bricks!";
    if (!raf) loop();
  }
  function loseLife() {
    lives--;
    livesEl.textContent = String(lives);
    ball.live = false; ball.x = W / 2; ball.y = H - 60;
    if (PF.sound) PF.sound("close");
    if (lives <= 0) { running = "over"; foot.innerHTML = "Game over — score <b>" + score + "</b>. Click to retry."; }
    else { foot.textContent = "Click to launch (" + lives + " left)"; }
  }
  function win() {
    running = "win";
    foot.innerHTML = "You cleared it! 🎉 Score <b>" + score + "</b>. Click to play again.";
    if (PF.confetti) PF.confetti();
  }

  function loop() {
    raf = requestAnimationFrame(loop);
    update();
    draw();
  }
  function update() {
    if (leftKey) paddle.x -= 6;
    if (rightKey) paddle.x += 6;
    paddle.x = Math.max(0, Math.min(W - paddle.w, paddle.x));
    if (!ball.live || running === "over" || running === "win") return;

    ball.x += ball.vx; ball.y += ball.vy;
    if (ball.x - ball.r < 0) { ball.x = ball.r; ball.vx = Math.abs(ball.vx); }
    if (ball.x + ball.r > W) { ball.x = W - ball.r; ball.vx = -Math.abs(ball.vx); }
    if (ball.y - ball.r < 0) { ball.y = ball.r; ball.vy = Math.abs(ball.vy); }
    if (ball.y - ball.r > H) { loseLife(); return; }

    // paddle
    var py = H - 24;
    if (ball.y + ball.r >= py && ball.y + ball.r <= py + paddle.h + 6 &&
        ball.x >= paddle.x && ball.x <= paddle.x + paddle.w && ball.vy > 0) {
      ball.vy = -Math.abs(ball.vy);
      var hit = (ball.x - (paddle.x + paddle.w / 2)) / (paddle.w / 2);
      ball.vx = hit * 4;
    }
    // bricks
    for (var i = 0; i < bricks.length; i++) {
      var b = bricks[i];
      if (!b.alive) continue;
      if (ball.x > b.x && ball.x < b.x + bw && ball.y - ball.r < b.y + bh && ball.y + ball.r > b.y) {
        b.alive = false;
        ball.vy = -ball.vy;
        score += 10;
        scoreEl.textContent = String(score);
        if (PF.sound) PF.sound("blip");
        break;
      }
    }
    if (bricks.every(function (b) { return !b.alive; })) win();
  }
  function draw() {
    ctx.clearRect(0, 0, W, H);
    var a = css("--accent", "#6ea8fe"), a2 = css("--accent-2", "#b69dff");
    // bricks
    bricks.forEach(function (b) {
      if (!b.alive) return;
      ctx.fillStyle = b.row % 2 ? a2 : a;
      ctx.globalAlpha = 1 - b.row * 0.08;
      ctx.fillRect(b.x, b.y, bw, bh);
    });
    ctx.globalAlpha = 1;
    // paddle
    ctx.fillStyle = a;
    ctx.fillRect(paddle.x, H - 24, paddle.w, paddle.h);
    // ball
    ctx.fillStyle = "#fff";
    ctx.beginPath(); ctx.arc(ball.x, ball.y, ball.r, 0, Math.PI * 2); ctx.fill();
  }

  function onMove(e) {
    var rect = canvas.getBoundingClientRect();
    var scale = W / rect.width;
    paddle.x = (e.clientX - rect.left) * scale - paddle.w / 2;
  }
  function onKey(e) {
    if (!backdrop.classList.contains("open")) return;
    var k = e.key.toLowerCase();
    if (k === "escape") return close();
    if (k === "arrowleft" || k === "a") { leftKey = true; e.preventDefault(); }
    if (k === "arrowright" || k === "d") { rightKey = true; e.preventDefault(); }
    if (k === " " || k === "enter") { launch(); e.preventDefault(); }
  }
  function onKeyUp(e) {
    var k = e.key.toLowerCase();
    if (k === "arrowleft" || k === "a") leftKey = false;
    if (k === "arrowright" || k === "d") rightKey = false;
  }

  function open() {
    reset();
    backdrop.classList.add("open");
    document.body.style.overflow = "hidden";
    canvas.addEventListener("mousemove", onMove);
    document.addEventListener("keydown", onKey);
    document.addEventListener("keyup", onKeyUp);
  }
  function close() {
    backdrop.classList.remove("open");
    document.body.style.overflow = "";
    if (raf) { cancelAnimationFrame(raf); raf = null; }
    running = false;
    canvas.removeEventListener("mousemove", onMove);
    document.removeEventListener("keydown", onKey);
    document.removeEventListener("keyup", onKeyUp);
  }
  PF.breakout = open;

  backdrop.querySelector("#bkClose").addEventListener("click", close);
  canvas.addEventListener("click", launch);
  backdrop.addEventListener("mousedown", function (e) { if (e.target === backdrop) close(); });
})();
