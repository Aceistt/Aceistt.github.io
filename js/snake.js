/* ============================================================
   Aceistt — Snake mini-game easter egg.
   Open via PF.snake() (terminal "snake" / command palette).
   Arrow keys or WASD. Esc closes. High score saved locally.
   ============================================================ */
(function () {
  "use strict";

  var PF = (window.PF = window.PF || {});

  var backdrop = document.createElement("div");
  backdrop.className = "snake-backdrop";
  backdrop.innerHTML =
    '<div class="snake-box" role="dialog" aria-label="Snake game">' +
      '<div class="snake-head">' +
        '<span class="snake-title">🐍 Snake</span>' +
        '<span class="snake-score">Score <b id="snakeScore">0</b> · Best <b id="snakeBest">0</b></span>' +
        '<button class="snake-close" id="snakeClose" aria-label="Close">×</button>' +
      "</div>" +
      '<canvas id="snakeCanvas" width="360" height="360"></canvas>' +
      '<div class="snake-foot" id="snakeFoot">Press an arrow key (or WASD) to start · Esc to quit</div>' +
    "</div>";
  document.body.appendChild(backdrop);

  var canvas = backdrop.querySelector("#snakeCanvas");
  var ctx = canvas.getContext("2d");
  var scoreEl = backdrop.querySelector("#snakeScore");
  var bestEl = backdrop.querySelector("#snakeBest");
  var foot = backdrop.querySelector("#snakeFoot");

  var GRID = 18, CELL = canvas.width / GRID;
  var snake, dir, nextDir, food, score, timer, running, best;
  try { best = parseInt(localStorage.getItem("snakeBest") || "0", 10) || 0; } catch (e) { best = 0; }

  function accent() {
    return getComputedStyle(document.documentElement).getPropertyValue("--accent").trim() || "#6ea8fe";
  }
  function accent2() {
    return getComputedStyle(document.documentElement).getPropertyValue("--accent-2").trim() || "#b69dff";
  }

  function reset() {
    snake = [{ x: 8, y: 9 }, { x: 7, y: 9 }, { x: 6, y: 9 }];
    dir = { x: 1, y: 0 };
    nextDir = dir;
    score = 0;
    placeFood();
    scoreEl.textContent = "0";
    bestEl.textContent = String(best);
    running = false;
    draw();
  }
  function placeFood() {
    do {
      food = { x: (Math.random() * GRID) | 0, y: (Math.random() * GRID) | 0 };
    } while (snake.some(function (s) { return s.x === food.x && s.y === food.y; }));
  }
  function start() {
    if (running) return;
    running = true;
    foot.textContent = "Eat the dots. Don't bite yourself!";
    clearInterval(timer);
    timer = setInterval(step, 110);
  }
  function gameOver() {
    running = false;
    clearInterval(timer);
    if (score > best) { best = score; try { localStorage.setItem("snakeBest", String(best)); } catch (e) {} }
    bestEl.textContent = String(best);
    foot.innerHTML = "Game over — score <b>" + score + "</b>. Press any arrow to retry.";
    if (PF.sound) PF.sound("close");
  }
  function step() {
    dir = nextDir;
    var head = { x: snake[0].x + dir.x, y: snake[0].y + dir.y };
    // walls + self
    if (head.x < 0 || head.y < 0 || head.x >= GRID || head.y >= GRID ||
        snake.some(function (s) { return s.x === head.x && s.y === head.y; })) {
      return gameOver();
    }
    snake.unshift(head);
    if (head.x === food.x && head.y === food.y) {
      score++;
      scoreEl.textContent = String(score);
      if (PF.sound) PF.sound("blip");
      placeFood();
    } else {
      snake.pop();
    }
    draw();
  }
  function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    // grid dots
    ctx.fillStyle = "rgba(255,255,255,0.04)";
    for (var i = 0; i < GRID; i++) for (var j = 0; j < GRID; j++) {
      ctx.fillRect(i * CELL + CELL / 2 - 1, j * CELL + CELL / 2 - 1, 2, 2);
    }
    // food
    ctx.fillStyle = accent2();
    roundRect(food.x * CELL + 3, food.y * CELL + 3, CELL - 6, CELL - 6, 4);
    // snake
    var a = accent();
    snake.forEach(function (s, idx) {
      ctx.fillStyle = idx === 0 ? a : a + "cc";
      roundRect(s.x * CELL + 1.5, s.y * CELL + 1.5, CELL - 3, CELL - 3, 4);
    });
  }
  function roundRect(x, y, w, h, r) {
    ctx.beginPath();
    ctx.moveTo(x + r, y);
    ctx.arcTo(x + w, y, x + w, y + h, r);
    ctx.arcTo(x + w, y + h, x, y + h, r);
    ctx.arcTo(x, y + h, x, y, r);
    ctx.arcTo(x, y, x + w, y, r);
    ctx.fill();
  }

  function onKey(e) {
    if (!backdrop.classList.contains("open")) return;
    var k = e.key.toLowerCase();
    var map = {
      arrowup: { x: 0, y: -1 }, w: { x: 0, y: -1 },
      arrowdown: { x: 0, y: 1 }, s: { x: 0, y: 1 },
      arrowleft: { x: -1, y: 0 }, a: { x: -1, y: 0 },
      arrowright: { x: 1, y: 0 }, d: { x: 1, y: 0 }
    };
    if (k === "escape") { close(); return; }
    var nd = map[k];
    if (!nd) return;
    e.preventDefault();
    if (!running) { if (score > 0 || foot.textContent.indexOf("over") !== -1) reset(); start(); }
    // prevent 180° reversal
    if (nd.x === -dir.x && nd.y === -dir.y) return;
    nextDir = nd;
  }

  function open() {
    reset();
    backdrop.classList.add("open");
    document.body.style.overflow = "hidden";
    document.addEventListener("keydown", onKey);
  }
  function close() {
    backdrop.classList.remove("open");
    document.body.style.overflow = "";
    clearInterval(timer);
    running = false;
    document.removeEventListener("keydown", onKey);
  }
  PF.snake = open;

  backdrop.querySelector("#snakeClose").addEventListener("click", close);
  backdrop.addEventListener("mousedown", function (e) { if (e.target === backdrop) close(); });
})();
