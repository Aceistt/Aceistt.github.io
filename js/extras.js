/* ============================================================
   Aceistt — command palette (⌘K) + terminal easter egg.
   Depends on window.PF (theme/lang/confetti) from main.js & i18n.js.
   ============================================================ */
(function () {
  "use strict";

  var PF = (window.PF = window.PF || {});

  function go(hash) {
    var el = document.querySelector(hash);
    if (el) el.scrollIntoView({ behavior: "smooth" });
  }
  function open(url) { window.open(url, "_blank", "noopener"); }

  /* ============================================================
     Command palette
     ============================================================ */
  var COMMANDS = [
    // — Navigation —
    { icon: "→", label: "Go to About", keys: "about over mij navigate", run: function () { go("#about"); } },
    { icon: "→", label: "Go to Experience", keys: "experience ervaring work navigate", run: function () { go("#experience"); } },
    { icon: "→", label: "Go to Projects", keys: "projects projecten work navigate", run: function () { go("#projects"); } },
    { icon: "→", label: "Go to Contact", keys: "contact email reach navigate", run: function () { go("#contact"); } },

    // — Appearance —
    { icon: "◐", label: "Toggle dark / light", keys: "theme dark light mode appearance", run: function () { if (PF.toggleTheme) PF.toggleTheme(); } },
    { icon: "🎨", label: "Theme & colours…", keys: "theme themes preset colour color accent appearance synthwave forest mono matrix", run: function () { if (PF.openAccent) PF.openAccent(); } },
    { icon: "🌐", label: "Switch language (EN / NL)", keys: "language taal english nederlands", run: function () { if (PF.toggleLang) PF.toggleLang(); } },

    // — Links —
    { icon: "★", label: "View Hisuri case study", keys: "hisuri case study project work", run: function () { window.location.href = "hisuri.html"; } },
    { icon: "⤓", label: "Download CV", keys: "cv resume download", run: function () { window.location.href = "assets/cv.pdf"; } },
    { icon: "✉", label: "Send an email", keys: "email mail contact", run: function () { window.location.href = "mailto:terence.werman@outlook.com"; } },
    { icon: "↗", label: "Open GitHub", keys: "github code repos links", run: function () { open("https://github.com/Aceistt"); } },
    { icon: "↗", label: "Open LinkedIn", keys: "linkedin links", run: function () { open("https://linkedin.com/in/terence-werman"); } },

    // — Fun & games —
    { icon: "🎉", label: "Launch confetti", keys: "confetti party fun celebrate", run: function () { if (PF.confetti) PF.confetti(); } },
    { icon: "🏆", label: "View achievements", keys: "achievements badges trophies progress", run: function () { if (PF.openAchievements) PF.openAchievements(); } },
    { icon: "⌨️", label: "Keyboard shortcuts", keys: "shortcuts keys help cheat sheet hotkeys", run: function () { if (PF.openShortcuts) PF.openShortcuts(); } },
    { icon: "🐍", label: "Play Snake", keys: "snake game play arcade", run: function () { if (PF.snake) PF.snake(); } },
    { icon: "🧱", label: "Play Breakout", keys: "breakout game play arcade bricks", run: function () { if (PF.breakout) PF.breakout(); } },
    { icon: "🔢", label: "Play 2048", keys: "2048 game play tiles puzzle merge", run: function () { if (PF.g2048) PF.g2048(); } },
    { icon: "📺", label: "Toggle retro mode", keys: "retro crt vintage old effect", run: function () { if (PF.toggleRetro) PF.toggleRetro(); } },
    { icon: "🟢", label: "Enter the Matrix", keys: "matrix rain neo hacker effect", run: function () { if (PF.matrix) PF.matrix(); } },
    { icon: "🪐", label: "Gravity mode", keys: "gravity drop fall physics chaos effect", run: function () { if (PF.gravity) PF.gravity(); } },
    { icon: "▸", label: "Open terminal", keys: "terminal console cli shell", run: function () { openTerminal(); } }
  ];

  var backdrop = document.createElement("div");
  backdrop.className = "cmdk-backdrop";
  backdrop.setAttribute("role", "dialog");
  backdrop.setAttribute("aria-modal", "true");
  backdrop.innerHTML =
    '<div class="cmdk">' +
      '<input class="cmdk-input" id="cmdkInput" type="text" placeholder="Type a command or search…" autocomplete="off" spellcheck="false" />' +
      '<div class="cmdk-list" id="cmdkList"></div>' +
      '<div class="cmdk-foot"><span><kbd>↑</kbd> <kbd>↓</kbd> to navigate</span><span><kbd>↵</kbd> to select</span><span><kbd>esc</kbd> to close</span></div>' +
    "</div>";
  document.body.appendChild(backdrop);

  var input = backdrop.querySelector("#cmdkInput");
  var list = backdrop.querySelector("#cmdkList");
  var active = 0;
  var filtered = COMMANDS.slice();
  var lastFocus = null;

  function renderList() {
    list.innerHTML = "";
    if (!filtered.length) {
      list.innerHTML = '<div class="cmdk-empty">No matching commands</div>';
      return;
    }
    filtered.forEach(function (cmd, i) {
      var item = document.createElement("div");
      item.className = "cmdk-item" + (i === active ? " active" : "");
      item.innerHTML =
        '<span class="cmdk-item-icon">' + cmd.icon + "</span>" +
        '<span class="cmdk-item-label"></span>';
      item.querySelector(".cmdk-item-label").textContent = cmd.label;
      item.addEventListener("mousemove", function () { active = i; paintActive(); });
      item.addEventListener("click", function () { execute(i); });
      list.appendChild(item);
    });
  }
  function paintActive() {
    Array.prototype.forEach.call(list.children, function (el, i) {
      el.classList.toggle("active", i === active);
    });
    var el = list.children[active];
    if (el && el.scrollIntoView) el.scrollIntoView({ block: "nearest" });
  }
  function filter() {
    var q = input.value.trim().toLowerCase();
    filtered = !q ? COMMANDS.slice() : COMMANDS.filter(function (c) {
      return (c.label + " " + c.keys).toLowerCase().indexOf(q) !== -1;
    });
    active = 0;
    renderList();
  }
  function execute(i) {
    var cmd = filtered[i];
    if (!cmd) return;
    closePalette();
    cmd.run();
  }
  function openPalette() {
    if (PF.unlock) PF.unlock("palette");
    lastFocus = document.activeElement;
    input.value = "";
    filter();
    backdrop.classList.add("open");
    document.body.style.overflow = "hidden";
    setTimeout(function () { input.focus(); }, 20);
  }
  function closePalette() {
    backdrop.classList.remove("open");
    document.body.style.overflow = "";
    if (lastFocus && lastFocus.focus) lastFocus.focus();
  }
  function paletteOpen() { return backdrop.classList.contains("open"); }

  input.addEventListener("input", filter);
  backdrop.addEventListener("mousedown", function (e) { if (e.target === backdrop) closePalette(); });
  input.addEventListener("keydown", function (e) {
    if (e.key === "ArrowDown") { e.preventDefault(); active = Math.min(active + 1, filtered.length - 1); paintActive(); }
    else if (e.key === "ArrowUp") { e.preventDefault(); active = Math.max(active - 1, 0); paintActive(); }
    else if (e.key === "Enter") { e.preventDefault(); execute(active); }
    else if (e.key === "Escape") { e.preventDefault(); closePalette(); }
  });

  var trigger = document.getElementById("cmdkTrigger");
  if (trigger) trigger.addEventListener("click", openPalette);

  document.addEventListener("keydown", function (e) {
    if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
      e.preventDefault();
      paletteOpen() ? closePalette() : openPalette();
    }
  });

  /* ============================================================
     Terminal
     ============================================================ */
  var termBackdrop = document.createElement("div");
  termBackdrop.className = "term-backdrop";
  termBackdrop.innerHTML =
    '<div class="term" role="dialog" aria-label="Terminal">' +
      '<div class="term-bar">' +
        '<span class="term-dot term-dot--r"></span>' +
        '<span class="term-dot term-dot--y"></span>' +
        '<span class="term-dot term-dot--g"></span>' +
        '<span class="term-title">visitor@aceistt: ~</span>' +
      "</div>" +
      '<div class="term-body" id="termBody">' +
        '<div class="term-input-line">' +
          '<span class="term-prompt">visitor@aceistt:~$</span>' +
          '<input class="term-input" id="termInput" type="text" autocomplete="off" spellcheck="false" />' +
        "</div>" +
      "</div>" +
    "</div>";
  document.body.appendChild(termBackdrop);

  var termBody = termBackdrop.querySelector("#termBody");
  var termInput = termBackdrop.querySelector("#termInput");
  var inputLine = termBackdrop.querySelector(".term-input-line");
  var history = [];
  var histIdx = -1;
  var booted = false;

  function print(html, cls) {
    var line = document.createElement("div");
    line.className = "term-line" + (cls ? " " + cls : "");
    line.innerHTML = html;
    termBody.insertBefore(line, inputLine);
    termBody.scrollTop = termBody.scrollHeight;
  }
  function printEcho(cmd) {
    print('<span class="term-prompt">visitor@aceistt:~$</span> ' + escapeHtml(cmd));
  }
  function escapeHtml(s) {
    return s.replace(/[&<>"]/g, function (c) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c];
    });
  }

  var TERM = {
    help: function () {
      print("Available commands:", "muted");
      print('  <span class="ok">about</span>      who I am');
      print('  <span class="ok">projects</span>   what I\'ve built');
      print('  <span class="ok">skills</span>     my tech stack');
      print('  <span class="ok">social</span>     where to find me');
      print('  <span class="ok">contact</span>    get in touch');
      print('  <span class="ok">theme</span>      open theme menu  (or theme dark|light)');
      print('  <span class="ok">lang</span>       switch language       (lang en|nl)');
      print('  <span class="ok">color</span>      change accent colour  (color #6ea8fe | reset)');
      print('  <span class="ok">confetti</span>   🎉');
      print('  <span class="ok">achievements</span> view your badges');
      print('  <span class="ok">retro</span>      toggle CRT mode');
      print('  <span class="ok">matrix</span>     enter the matrix');
      print('  <span class="ok">snake</span>      play snake 🐍');
      print('  <span class="ok">breakout</span>   play breakout 🧱');
      print('  <span class="ok">2048</span>       play 2048 🔢');
      print('  <span class="ok">preset</span>     theme preset (synthwave|forest|mono|matrix)');
      print('  <span class="ok">weather</span>    current weather in NL');
      print('  <span class="ok">gravity</span>    drop everything 🪐');
      print('  <span class="ok">neofetch</span>   system info');
      print('  <span class="ok">clear</span>      clear the screen');
      print('  <span class="muted">(tip: press Tab to autocomplete)</span>');
      print('  <span class="ok">exit</span>       close the terminal');
    },
    about: function () {
      print('Hi, I\'m <span class="accent2">Terence</span> (aka Aceistt) — a software developer.');
      print('I build websites, mobile apps and tools with C#, Python and React Native.');
      print('Currently studying at Curio and fresh off an internship at Rex Media.');
    },
    whoami: function () { print("visitor — but you can call yourself whatever you like 😄"); },
    projects: function () {
      print('<span class="ok">Hisuri</span>        Website + mobile registration platform (Rex Media)');
      print('<span class="ok">Amazing RPG</span>   Console role-playing game in C#');
      print('<span class="ok">Tic-Tac-Toe</span>   React game');
      print('<span class="ok">Booking</span>       Python check-in/booking automation');
      print('<span class="ok">Logbook</span>       Python logbook utility');
      print('Type <span class="ok">contact</span> to reach out about any of them.');
    },
    skills: function () {
      print('<span class="green">Languages</span>  C#, Python, JavaScript');
      print('<span class="green">Frontend</span>   React, React Native, HTML, CSS');
      print('<span class="green">Tools</span>      .NET, Git');
    },
    social: function () {
      print('GitHub    <span class="ok">https://github.com/Aceistt</span>');
      print('LinkedIn  <span class="ok">https://linkedin.com/in/terence-werman</span>');
    },
    contact: function () {
      print('Email     <span class="ok">terence.werman@outlook.com</span>');
      print('Drop me a line any time — I\'m open to new opportunities.');
    },
    theme: function (arg) {
      if (arg === "dark" || arg === "light") { if (PF.setTheme) PF.setTheme(arg); print("Theme set to " + arg + ".", "muted"); return; }
      if (PF.openAccent) PF.openAccent();
      print("Opening theme menu — pick a preset or accent colour. (also: theme dark|light)", "muted");
    },
    lang: function (arg) {
      if (arg === "en" || arg === "nl") { if (PF.setLang) PF.setLang(arg); print("Language set to " + arg.toUpperCase() + ".", "muted"); }
      else { if (PF.toggleLang) PF.toggleLang(); print("Language toggled.", "muted"); }
    },
    confetti: function () { if (PF.confetti) PF.confetti(); print("🎉", "accent2"); },
    color: function (arg, rest) {
      var v = (rest || "").trim();
      if (!v) { if (PF.openAccent) PF.openAccent(); print("Opening colour picker…", "muted"); return; }
      if (v.toLowerCase() === "reset") { if (PF.resetAccent) PF.resetAccent(); print("Accent reset to default.", "muted"); return; }
      if (/^#?[0-9a-fA-F]{6}$/.test(v)) {
        var hex = v[0] === "#" ? v : "#" + v;
        if (PF.setAccent) PF.setAccent(hex, null, true);
        print("Accent set to " + hex + ".", "muted");
      } else { print("Usage: color #6ea8fe  |  color reset", "muted"); }
    },
    retro: function () { if (PF.toggleRetro) { var on = PF.toggleRetro(); print(on ? "Entering retro mode… type 'retro' again to exit." : "Back to the future.", "muted"); } },
    matrix: function () { if (PF.matrix) { PF.matrix(); print("Wake up, Neo…", "green"); } },
    achievements: function () { if (PF.openAchievements) PF.openAchievements(); print("Opening achievements…", "muted"); },
    snake: function () { if (PF.snake) { PF.snake(); print("🐍 Use arrow keys / WASD. Good luck!", "green"); } },
    breakout: function () { if (PF.breakout) { PF.breakout(); print("🧱 Mouse or arrows to move. Click to launch!", "green"); } },
    "2048": function () { if (PF.g2048) { PF.g2048(); print("Merge the tiles to 2048! Arrows / WASD.", "green"); } },
    preset: function (arg) {
      var ok = ["synthwave", "forest", "mono", "matrix"];
      if (arg === "reset" || arg === "default") { if (PF.resetTheme) PF.resetTheme(); print("Theme reset.", "muted"); return; }
      if (ok.indexOf(arg) !== -1) { if (PF.setPreset) PF.setPreset(arg); print("Theme: " + arg + ".", "muted"); }
      else { print("Presets: " + ok.join(", ") + "  (or 'preset reset')", "muted"); }
    },
    weather: function () {
      var el = document.getElementById("footerClock");
      print(el && el.textContent ? el.textContent : "Weather loading…", "muted");
    },
    gravity: function () {
      if (!PF.gravity) return;
      var on = PF.gravity();
      print(on ? "Gravity engaged 🪐 — type 'gravity' again to restore." : "Order restored.", "muted");
    },
    screensaver: function () { if (PF.screensaver) { PF.screensaver(); print("💤 Screensaver on — move the mouse to wake.", "muted"); } },
    neofetch: function () {
      var art = ["    /\\    ", "   /  \\   ", "  / /\\ \\  ", " / ____ \\ ", "/_/    \\_\\"];
      var info = [
        '<span class="green">visitor</span>@<span class="green">aceistt</span>',
        "---------------",
        '<span class="accent2">OS</span>      aceist.os 1.0',
        '<span class="accent2">Host</span>    aceistt.github.io',
        '<span class="accent2">Shell</span>   aceist-sh',
        '<span class="accent2">Dev</span>     Terence Werman',
        '<span class="accent2">Langs</span>   C#, Python, JS',
        '<span class="accent2">Stack</span>   React, React Native'
      ];
      var n = Math.max(art.length, info.length);
      for (var i = 0; i < n; i++) {
        var a = art[i] || "         ";
        print('<span class="ok">' + a + "</span>   " + (info[i] || ""));
      }
    },
    sudo: function () { print("Nice try. 😏", "muted"); },
    echo: function (arg, raw) { print(escapeHtml(raw || "")); },
    clear: function () {
      Array.prototype.slice.call(termBody.querySelectorAll(".term-line")).forEach(function (l) { l.remove(); });
    },
    exit: function () { closeTerminal(); },
    close: function () { closeTerminal(); }
  };

  function runTerm(raw) {
    var trimmed = raw.trim();
    if (!trimmed) return;
    var parts = trimmed.split(/\s+/);
    var name = parts[0].toLowerCase();
    var arg = (parts[1] || "").toLowerCase();
    var rest = trimmed.slice(parts[0].length).trim();
    if (TERM[name]) TERM[name](arg, rest);
    else print('command not found: ' + escapeHtml(name) + '  — type <span class="ok">help</span>', "muted");
  }

  function banner() {
    print('<span class="ok">Aceistt</span> // interactive shell  —  type <span class="ok">help</span> to begin.', "");
    print("");
  }

  function openTerminal() {
    if (PF.unlock) PF.unlock("terminal");
    closePalette();
    termBackdrop.classList.add("open");
    document.body.style.overflow = "hidden";
    if (!booted) { banner(); booted = true; }
    setTimeout(function () { termInput.focus(); }, 20);
  }
  function closeTerminal() {
    termBackdrop.classList.remove("open");
    document.body.style.overflow = "";
  }
  function terminalOpen() { return termBackdrop.classList.contains("open"); }

  termBackdrop.addEventListener("mousedown", function (e) { if (e.target === termBackdrop) closeTerminal(); });
  termBody.addEventListener("click", function () { termInput.focus(); });
  termInput.addEventListener("keydown", function (e) {
    if (e.key === "Enter") {
      var val = termInput.value;
      printEcho(val);
      if (val.trim()) { history.push(val); histIdx = history.length; }
      runTerm(val);
      termInput.value = "";
    } else if (e.key === "Escape") {
      closeTerminal();
    } else if (e.key === "ArrowUp") {
      if (history.length) { e.preventDefault(); histIdx = Math.max(0, histIdx - 1); termInput.value = history[histIdx] || ""; }
    } else if (e.key === "Tab") {
      e.preventDefault();
      var typed = termInput.value.trim().toLowerCase();
      if (!typed) return;
      var names = Object.keys(TERM);
      var hits = names.filter(function (n) { return n.indexOf(typed) === 0; });
      if (hits.length === 1) {
        termInput.value = hits[0] + " ";
      } else if (hits.length > 1) {
        var prefix = hits[0];
        hits.forEach(function (m) { while (m.indexOf(prefix) !== 0) prefix = prefix.slice(0, -1); });
        termInput.value = prefix;
        print('<span class="muted">' + hits.join("&nbsp;&nbsp;&nbsp;") + "</span>");
      }
    } else if (e.key === "ArrowDown") {
      if (history.length) { e.preventDefault(); histIdx = Math.min(history.length, histIdx + 1); termInput.value = history[histIdx] || ""; }
    }
  });

  // Open terminal with Ctrl+`  (like VS Code)
  document.addEventListener("keydown", function (e) {
    if (e.ctrlKey && e.key === "`") {
      e.preventDefault();
      terminalOpen() ? closeTerminal() : openTerminal();
    }
  });

  // Expose so the palette command (and anything else) can launch it.
  PF.openTerminal = openTerminal;
})();
