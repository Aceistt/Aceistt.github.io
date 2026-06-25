/* ============================================================
   Aceistt — boot-up intro.
   Terminal-style boot sequence shown once per session. Loaded in
   <head> so it covers the page before paint. Skippable; skipped
   entirely for reduced-motion users.
   ============================================================ */
(function () {
  "use strict";

  try { if (sessionStorage.getItem("booted")) return; } catch (e) {}
  if (window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    try { sessionStorage.setItem("booted", "1"); } catch (e) {}
    return;
  }

  var root = document.documentElement;
  root.style.overflow = "hidden";

  var el = document.createElement("div");
  el.id = "boot";
  el.style.cssText =
    "position:fixed;inset:0;z-index:99999;background:#0b0e14;color:#3fd06a;" +
    "font:14px/1.7 ui-monospace,SFMono-Regular,Menlo,Consolas,monospace;" +
    "padding:8vh 8vw;overflow:hidden;cursor:pointer;transition:opacity .4s ease;";
  var pre = document.createElement("pre");
  pre.style.cssText = "margin:0;white-space:pre-wrap;text-shadow:0 0 6px rgba(63,208,106,.4)";
  el.appendChild(pre);
  var hint = document.createElement("div");
  hint.style.cssText = "position:absolute;bottom:6vh;left:8vw;color:#5fa05f;font-size:12px";
  hint.textContent = "click or press a key to skip";
  el.appendChild(hint);
  (document.body || root).appendChild(el);

  var lines = [
    "aceist.os v1.0 — initializing",
    "",
    "[ OK ] loading modules",
    "[ OK ] mounting /projects",
    "[ OK ] starting chatbot daemon",
    "[ OK ] calibrating accent gradient",
    "[ OK ] establishing secure connection",
    "",
    "welcome, visitor. enjoy the site._"
  ];

  var i = 0, timer = null, done = false;
  function tick() {
    if (done) return;
    if (i < lines.length) {
      pre.textContent += lines[i] + "\n";
      i++;
      timer = window.setTimeout(tick, i < 2 ? 260 : 150);
    } else {
      timer = window.setTimeout(finish, 550);
    }
  }
  function finish() {
    if (done) return;
    done = true;
    if (timer) clearTimeout(timer);
    try { sessionStorage.setItem("booted", "1"); } catch (e) {}
    el.style.opacity = "0";
    root.style.overflow = "";
    window.setTimeout(function () { if (el.parentNode) el.parentNode.removeChild(el); }, 450);
    window.removeEventListener("keydown", finish);
  }

  el.addEventListener("click", finish);
  window.addEventListener("keydown", finish);
  tick();
})();
