/* ============================================================
   Aceistt — keyboard shortcuts / easter-egg cheat sheet.
   Press "?" to open, or via the command palette. Esc closes.
   ============================================================ */
(function () {
  "use strict";

  var PF = (window.PF = window.PF || {});

  var ROWS = [
    { keys: ["⌘/Ctrl", "K"], label: "Open command palette" },
    { keys: ["Ctrl", "`"], label: "Open terminal" },
    { keys: ["?"], label: "This shortcuts overlay" },
    { keys: ["↑↑↓↓←→←→", "B", "A"], label: "Konami code → confetti" },
    { keys: ["Esc"], label: "Close any overlay" }
  ];
  var EGGS = [
    { cmd: "snake", label: "Play Snake 🐍" },
    { cmd: "matrix", label: "Matrix rain 🟢" },
    { cmd: "retro", label: "Retro / CRT mode 📺" },
    { cmd: "color #hex", label: "Change accent colour 🎨" },
    { cmd: "achievements", label: "View achievements 🏆" },
    { cmd: "confetti", label: "Throw confetti 🎉" }
  ];

  var backdrop = document.createElement("div");
  backdrop.className = "sc-backdrop";
  var rows = ROWS.map(function (r) {
    var keys = r.keys.map(function (k) { return "<kbd>" + k + "</kbd>"; }).join(" ");
    return '<div class="sc-row"><span class="sc-keys">' + keys + '</span><span class="sc-label"></span></div>';
  }).join("");
  var eggs = EGGS.map(function (e) {
    return '<div class="sc-row"><span class="sc-keys"><code>' + e.cmd + '</code></span><span class="sc-label"></span></div>';
  }).join("");
  backdrop.innerHTML =
    '<div class="sc-panel" role="dialog" aria-label="Keyboard shortcuts">' +
      '<div class="sc-head"><h3>Shortcuts &amp; secrets</h3><button class="sc-close" id="scClose" aria-label="Close">×</button></div>' +
      '<div class="sc-cols">' +
        '<div><p class="sc-subtitle">Keyboard</p>' + rows + "</div>" +
        '<div><p class="sc-subtitle">Terminal commands</p>' + eggs + "</div>" +
      "</div>" +
      '<p class="sc-foot">Tip: open the terminal with <kbd>Ctrl</kbd> <kbd>`</kbd> and type these.</p>' +
    "</div>";
  document.body.appendChild(backdrop);

  // Fill labels safely (textContent, not innerHTML).
  var labelEls = backdrop.querySelectorAll(".sc-label");
  ROWS.concat(EGGS).forEach(function (item, idx) {
    if (labelEls[idx]) labelEls[idx].textContent = item.label;
  });

  function open() { backdrop.classList.add("open"); }
  function close() { backdrop.classList.remove("open"); }
  PF.openShortcuts = open;

  backdrop.querySelector("#scClose").addEventListener("click", close);
  backdrop.addEventListener("mousedown", function (e) { if (e.target === backdrop) close(); });

  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape") { close(); return; }
    // "?" (Shift + /), but not while typing in a field.
    var tag = (e.target.tagName || "").toLowerCase();
    if (tag === "input" || tag === "textarea" || e.target.isContentEditable) return;
    if (e.key === "?") { e.preventDefault(); backdrop.classList.contains("open") ? close() : open(); }
  });
})();
