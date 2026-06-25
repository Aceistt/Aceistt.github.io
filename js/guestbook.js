/* ============================================================
   Aceistt — guestbook via giscus (GitHub Discussions, no backend).

   ONE-TIME SETUP (5 min):
   1. Make sure this repo is public (it is — *.github.io).
   2. On GitHub: repo → Settings → General → Features → enable "Discussions".
   3. Install the giscus app: https://github.com/apps/giscus  (grant it this repo).
   4. Go to https://giscus.app, enter "Aceistt/Aceistt.github.io", pick a
      Discussions category (e.g. "General" or make one called "Guestbook"),
      and copy the data-repo-id and data-category-id it generates.
   5. Paste them into CONFIG below. Done — the guestbook goes live.

   Until repoId + categoryId are filled in, a friendly note shows instead.
   ============================================================ */
(function () {
  "use strict";

  var CONFIG = {
    repo: "Aceistt/Aceistt.github.io",
    repoId: "R_kgDOTEsndg",
    category: "General",
    categoryId: "DIC_kwDOTEsnds4C_3lv"
  };

  var mount = document.getElementById("guestbookMount");
  var note = document.getElementById("guestbookNote");
  if (!mount) return;

  function giscusTheme() {
    return document.documentElement.getAttribute("data-theme") === "light" ? "light" : "dark";
  }

  if (!CONFIG.repoId || !CONFIG.categoryId) {
    if (note) note.hidden = false;
    return;
  }

  var s = document.createElement("script");
  s.src = "https://giscus.app/client.js";
  s.async = true;
  s.crossOrigin = "anonymous";
  s.setAttribute("data-repo", CONFIG.repo);
  s.setAttribute("data-repo-id", CONFIG.repoId);
  s.setAttribute("data-category", CONFIG.category);
  s.setAttribute("data-category-id", CONFIG.categoryId);
  s.setAttribute("data-mapping", "pathname");
  s.setAttribute("data-strict", "0");
  s.setAttribute("data-reactions-enabled", "1");
  s.setAttribute("data-emit-metadata", "0");
  s.setAttribute("data-input-position", "top");
  s.setAttribute("data-theme", giscusTheme());
  s.setAttribute("data-lang", (window.PF && PF.getLang && PF.getLang() === "nl") ? "nl" : "en");
  mount.appendChild(s);

  // Keep giscus' theme in sync when the site theme changes.
  function sync() {
    var frame = document.querySelector("iframe.giscus-frame");
    if (!frame) return;
    frame.contentWindow.postMessage(
      { giscus: { setConfig: { theme: giscusTheme() } } }, "https://giscus.app"
    );
  }
  var themeBtn = document.getElementById("themeToggle");
  if (themeBtn) themeBtn.addEventListener("click", function () { setTimeout(sync, 50); });
})();
