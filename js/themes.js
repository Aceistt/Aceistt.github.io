/* ============================================================
   Aceistt — full theme presets (beyond just the accent colour).
   Sets the whole CSS-variable palette, persists it, and injects
   preset chips into the accent picker popover. Applied before
   paint by the inline <head> script (reads "theme-vars").
   ============================================================ */
(function () {
  "use strict";

  var PF = (window.PF = window.PF || {});
  var root = document.documentElement;

  var PRESETS = {
    synthwave: {
      "--bg": "#1a0b2e", "--surface": "#251440", "--surface-2": "#2f1a4f",
      "--border": "#44306b", "--text": "#f0e6ff", "--muted": "#b9a6d8",
      "--accent": "#ff5ca8", "--accent-2": "#7c4dff", "--accent-ink": "#150a26"
    },
    forest: {
      "--bg": "#0c1a12", "--surface": "#102418", "--surface-2": "#16301f",
      "--border": "#244634", "--text": "#e6f5ec", "--muted": "#8fb39c",
      "--accent": "#3fd06a", "--accent-2": "#9be88a", "--accent-ink": "#06120a"
    },
    mono: {
      "--bg": "#0e0e10", "--surface": "#16161a", "--surface-2": "#1d1d22",
      "--border": "#34343c", "--text": "#ededf0", "--muted": "#9a9aa6",
      "--accent": "#c8c8d2", "--accent-2": "#ffffff", "--accent-ink": "#0e0e10"
    },
    matrix: {
      "--bg": "#001000", "--surface": "#021a02", "--surface-2": "#032603",
      "--border": "#0a4a0a", "--text": "#b6ffb6", "--muted": "#5fa05f",
      "--accent": "#3fd06a", "--accent-2": "#8bff8b", "--accent-ink": "#001000"
    }
  };

  function apply(name) {
    var vars = PRESETS[name];
    if (!vars) return;
    for (var k in vars) root.style.setProperty(k, vars[k]);
    try {
      localStorage.setItem("theme-vars", JSON.stringify(vars));
      // a preset defines its own accent — clear separate accent overrides
      localStorage.removeItem("accent");
      localStorage.removeItem("accent2");
    } catch (e) {}
    if (PF.unlock) PF.unlock("color");
  }
  function reset() {
    var keys = ["--bg", "--surface", "--surface-2", "--border", "--text", "--muted", "--accent", "--accent-2", "--accent-ink"];
    keys.forEach(function (k) { root.style.removeProperty(k); });
    try {
      localStorage.removeItem("theme-vars");
      localStorage.removeItem("accent");
      localStorage.removeItem("accent2");
    } catch (e) {}
  }
  PF.setPreset = apply;
  PF.resetTheme = reset;

  // ---- Inject preset chips into the accent popover ----
  function injectUI() {
    var pop = document.querySelector(".accent-pop");
    if (!pop) return;
    var section = document.createElement("div");
    section.className = "preset-section";
    section.innerHTML = '<p class="accent-pop-title">Theme preset</p><div class="preset-chips"></div>';
    var chips = section.querySelector(".preset-chips");
    Object.keys(PRESETS).forEach(function (name) {
      var v = PRESETS[name];
      var b = document.createElement("button");
      b.className = "preset-chip";
      b.type = "button";
      b.title = name;
      b.style.background = v["--bg"];
      b.style.borderColor = v["--border"];
      b.innerHTML =
        '<span class="preset-dot" style="background:' + v["--accent"] + '"></span>' +
        '<span class="preset-dot" style="background:' + v["--accent-2"] + '"></span>' +
        '<span class="preset-name" style="color:' + v["--text"] + '">' + name + "</span>";
      b.addEventListener("click", function () { apply(name); });
      chips.appendChild(b);
    });
    pop.insertBefore(section, pop.firstChild);
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", injectUI);
  } else {
    injectUI();
  }
})();
