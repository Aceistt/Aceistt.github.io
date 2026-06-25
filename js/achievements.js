/* ============================================================
   Aceistt — achievements / unlockables.
   Other scripts call PF.unlock(id). Progress persists in
   localStorage; a panel (palette / terminal "achievements")
   shows the collection. A toast pops on each new unlock.
   ============================================================ */
(function () {
  "use strict";

  var PF = (window.PF = window.PF || {});

  var LIST = [
    { id: "welcome",   icon: "👋", title: "Welcome!",          desc: "Visited the portfolio" },
    { id: "palette",   icon: "🎛️", title: "Power user",        desc: "Opened the command palette" },
    { id: "terminal",  icon: "🖥️", title: "Hacker",            desc: "Opened the terminal" },
    { id: "konami",    icon: "🕹️", title: "Old school",        desc: "Entered the Konami code" },
    { id: "theme",     icon: "🌗", title: "Two-faced",         desc: "Toggled the theme" },
    { id: "lang",      icon: "🗣️", title: "Polyglot",          desc: "Switched language" },
    { id: "color",     icon: "🎨", title: "Interior designer", desc: "Changed the accent colour" },
    { id: "confetti",  icon: "🎉", title: "Party time",        desc: "Launched the confetti" },
    { id: "casestudy", icon: "📖", title: "Curious",           desc: "Read the Hisuri case study" },
    { id: "retro",     icon: "📺", title: "Time traveller",    desc: "Found retro mode" },
    { id: "matrix",    icon: "🟢", title: "Red pill",          desc: "Entered the Matrix" },
    { id: "explorer",  icon: "🧭", title: "Completionist",     desc: "Scrolled all the way down" }
  ];
  var BY_ID = {};
  LIST.forEach(function (a) { BY_ID[a.id] = a; });
  var KEY = "achievements";

  function load() {
    try { return JSON.parse(localStorage.getItem(KEY) || "[]"); } catch (e) { return []; }
  }
  function save(arr) {
    try { localStorage.setItem(KEY, JSON.stringify(arr)); } catch (e) {}
  }
  var got = load();

  function unlock(id) {
    if (!BY_ID[id] || got.indexOf(id) !== -1) return;
    got.push(id);
    save(got);
    toast(BY_ID[id]);
    if (PF.sound) PF.sound("success");
    updatePanel();
  }
  PF.unlock = unlock;

  /* ---- Toast ---- */
  function toast(a) {
    var t = document.createElement("div");
    t.className = "ach-toast";
    t.innerHTML =
      '<span class="ach-toast-icon">' + a.icon + "</span>" +
      '<span class="ach-toast-text"><strong>Achievement unlocked</strong>' +
      a.title + " · " + (got.length) + "/" + LIST.length + "</span>";
    document.body.appendChild(t);
    requestAnimationFrame(function () { t.classList.add("show"); });
    setTimeout(function () {
      t.classList.remove("show");
      setTimeout(function () { t.remove(); }, 300);
    }, 3200);
  }

  /* ---- Panel ---- */
  var backdrop = document.createElement("div");
  backdrop.className = "ach-backdrop";
  backdrop.innerHTML =
    '<div class="ach-panel" role="dialog" aria-label="Achievements">' +
      '<div class="ach-head"><h3>Achievements</h3><span class="ach-progress" id="achProgress"></span></div>' +
      '<div class="ach-grid" id="achGrid"></div>' +
    "</div>";
  document.body.appendChild(backdrop);
  var grid = backdrop.querySelector("#achGrid");
  var progress = backdrop.querySelector("#achProgress");

  function updatePanel() {
    if (!grid) return;
    progress.textContent = got.length + " / " + LIST.length + " unlocked";
    grid.innerHTML = "";
    LIST.forEach(function (a) {
      var has = got.indexOf(a.id) !== -1;
      var card = document.createElement("div");
      card.className = "ach-card" + (has ? " unlocked" : "");
      card.innerHTML =
        '<span class="ach-icon">' + (has ? a.icon : "🔒") + "</span>" +
        '<span class="ach-title"></span>' +
        '<span class="ach-desc"></span>';
      card.querySelector(".ach-title").textContent = a.title;
      card.querySelector(".ach-desc").textContent = has ? a.desc : "Locked";
      grid.appendChild(card);
    });
  }
  function open() { updatePanel(); backdrop.classList.add("open"); }
  function close() { backdrop.classList.remove("open"); }
  PF.openAchievements = open;

  backdrop.addEventListener("mousedown", function (e) { if (e.target === backdrop) close(); });
  document.addEventListener("keydown", function (e) { if (e.key === "Escape") close(); });

  /* ---- Built-in unlock triggers ---- */
  // Welcome + (on the case-study page) curious.
  setTimeout(function () { unlock("welcome"); }, 800);
  if (/hisuri/i.test(location.pathname)) unlock("casestudy");

  // Scrolled to the bottom.
  window.addEventListener("scroll", function () {
    if (window.innerHeight + window.scrollY >= document.body.scrollHeight - 4) unlock("explorer");
  }, { passive: true });

  updatePanel();
})();
