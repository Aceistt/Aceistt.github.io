/* ============================================================
   Aceistt — 2048 mini-game.
   Open via PF.g2048() (terminal "2048" / command palette).
   Arrow keys / WASD to merge. Esc closes. Best score saved.
   ============================================================ */
(function () {
  "use strict";

  var PF = (window.PF = window.PF || {});
  var N = 4;

  var backdrop = document.createElement("div");
  backdrop.className = "snake-backdrop";
  backdrop.innerHTML =
    '<div class="snake-box" role="dialog" aria-label="2048 game">' +
      '<div class="snake-head">' +
        '<span class="snake-title">2048</span>' +
        '<span class="snake-score">Score <b id="g2Score">0</b> · Best <b id="g2Best">0</b></span>' +
        '<button class="snake-close" id="g2Close" aria-label="Close">×</button>' +
      "</div>" +
      '<div class="g2-grid" id="g2Grid"></div>' +
      '<div class="snake-foot" id="g2Foot">Arrow keys or WASD to merge · Esc to quit</div>' +
    "</div>";
  document.body.appendChild(backdrop);

  var gridEl = backdrop.querySelector("#g2Grid");
  var scoreEl = backdrop.querySelector("#g2Score");
  var bestEl = backdrop.querySelector("#g2Best");
  var foot = backdrop.querySelector("#g2Foot");

  var COLORS = {
    2: "#2b3346", 4: "#33405e", 8: "#3f6fe0", 16: "#5a86e8", 32: "#6ea8fe",
    64: "#8a7cf0", 128: "#a17cf0", 256: "#b69dff", 512: "#c88af0",
    1024: "#e0793b", 2048: "#f3b05a"
  };
  var board, score, best, over;
  try { best = parseInt(localStorage.getItem("g2Best") || "0", 10) || 0; } catch (e) { best = 0; }

  function reset() {
    board = [];
    for (var i = 0; i < N * N; i++) board.push(0);
    score = 0; over = false;
    addTile(); addTile();
    bestEl.textContent = String(best);
    foot.textContent = "Arrow keys or WASD to merge · Esc to quit";
    render();
  }
  function addTile() {
    var empty = [];
    board.forEach(function (v, i) { if (v === 0) empty.push(i); });
    if (!empty.length) return;
    board[empty[(Math.random() * empty.length) | 0]] = Math.random() < 0.9 ? 2 : 4;
  }
  function render() {
    gridEl.innerHTML = "";
    for (var i = 0; i < N * N; i++) {
      var v = board[i];
      var cell = document.createElement("div");
      cell.className = "g2-cell";
      if (v) {
        cell.textContent = v;
        cell.style.background = COLORS[v] || "#f3b05a";
        cell.style.color = v <= 4 ? "var(--muted)" : "#fff";
        cell.style.fontSize = v >= 1024 ? "1.1rem" : "1.4rem";
      }
      gridEl.appendChild(cell);
    }
    scoreEl.textContent = String(score);
  }

  function rotateClockwise(arr) {
    var r = new Array(N * N).fill(0);
    for (var y = 0; y < N; y++) for (var x = 0; x < N; x++) r[x * N + (N - 1 - y)] = arr[y * N + x];
    return r;
  }
  function slideLeft(arr) {
    var moved = false, gained = 0;
    for (var y = 0; y < N; y++) {
      var row = [];
      for (var x = 0; x < N; x++) if (arr[y * N + x]) row.push(arr[y * N + x]);
      for (var i = 0; i < row.length - 1; i++) {
        if (row[i] === row[i + 1]) { row[i] *= 2; gained += row[i]; row.splice(i + 1, 1); }
      }
      while (row.length < N) row.push(0);
      for (var x2 = 0; x2 < N; x2++) {
        if (arr[y * N + x2] !== row[x2]) moved = true;
        arr[y * N + x2] = row[x2];
      }
    }
    return { moved: moved, gained: gained };
  }
  function move(dir) {
    if (over) return;
    var rot = { left: 0, up: 3, right: 2, down: 1 }[dir];
    for (var i = 0; i < rot; i++) board = rotateClockwise(board);
    var res = slideLeft(board);
    for (var j = 0; j < (4 - rot) % 4; j++) board = rotateClockwise(board);
    if (res.moved) {
      score += res.gained;
      if (res.gained && PF.sound) PF.sound("blip");
      addTile();
      render();
      if (score > best) { best = score; try { localStorage.setItem("g2Best", String(best)); } catch (e) {} bestEl.textContent = String(best); }
      if (board.indexOf(2048) !== -1 && !over) { foot.innerHTML = "You hit <b>2048</b>! 🎉 Keep going or Esc."; if (PF.confetti) PF.confetti(); }
      else if (!canMove()) { over = true; foot.innerHTML = "Game over — score <b>" + score + "</b>. Press R to retry."; }
    }
  }
  function canMove() {
    if (board.indexOf(0) !== -1) return true;
    for (var y = 0; y < N; y++) for (var x = 0; x < N; x++) {
      var v = board[y * N + x];
      if (x < N - 1 && v === board[y * N + x + 1]) return true;
      if (y < N - 1 && v === board[(y + 1) * N + x]) return true;
    }
    return false;
  }

  function onKey(e) {
    if (!backdrop.classList.contains("open")) return;
    var k = e.key.toLowerCase();
    if (k === "escape") return close();
    if (k === "r") { reset(); return; }
    var map = { arrowleft: "left", a: "left", arrowright: "right", d: "right", arrowup: "up", w: "up", arrowdown: "down", s: "down" };
    if (map[k]) { e.preventDefault(); move(map[k]); }
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
    document.removeEventListener("keydown", onKey);
  }
  PF.g2048 = open;

  backdrop.querySelector("#g2Close").addEventListener("click", close);
  backdrop.addEventListener("mousedown", function (e) { if (e.target === backdrop) close(); });
})();
