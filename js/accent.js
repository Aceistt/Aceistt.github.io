/* ============================================================
   Aceistt — accent colour customiser.
   Lets visitors recolour the site; persists in localStorage.
   Opened via the command palette ("Change accent colour") or
   the terminal ("color #hex" / "color reset").
   ============================================================ */
(function () {
  "use strict";

  var PF = (window.PF = window.PF || {});
  var root = document.documentElement;

  var PRESETS = [
    { name: "Blue",   a: "#6ea8fe", b: "#b69dff" },
    { name: "Violet", a: "#9b6cf0", b: "#c8a6ff" },
    { name: "Teal",   a: "#2fd0c9", b: "#6ef0e0" },
    { name: "Green",  a: "#3fd06a", b: "#9be8a8" },
    { name: "Orange", a: "#ff8a5c", b: "#ffb38a" },
    { name: "Pink",   a: "#ff5c8a", b: "#ff9ec0" }
  ];

  function setAccent(a, b, persist) {
    if (a) root.style.setProperty("--accent", a);
    if (b) root.style.setProperty("--accent-2", b);
    if (persist) {
      try {
        if (a) localStorage.setItem("accent", a);
        if (b) localStorage.setItem("accent2", b);
      } catch (e) {}
    }
    if (PF.unlock) PF.unlock("color");
  }
  function reset() {
    if (PF.resetTheme) { PF.resetTheme(); return; } // also clears theme presets
    root.style.removeProperty("--accent");
    root.style.removeProperty("--accent-2");
    try { localStorage.removeItem("accent"); localStorage.removeItem("accent2"); } catch (e) {}
  }

  PF.setAccent = setAccent;
  PF.resetAccent = reset;

  // ---- Popover UI ----
  var pop = document.createElement("div");
  pop.className = "accent-pop-backdrop";
  var swatches = PRESETS.map(function (p, i) {
    return '<button class="accent-swatch" data-i="' + i + '" title="' + p.name + '" ' +
      'style="background:linear-gradient(135deg,' + p.a + ',' + p.b + ')"></button>';
  }).join("");
  pop.innerHTML =
    '<div class="accent-pop" role="dialog" aria-label="Accent colour">' +
      '<p class="accent-pop-title">Pick an accent</p>' +
      '<div class="accent-swatches">' + swatches + "</div>" +
      '<label class="accent-custom">Custom <input type="color" id="accentCustom" value="#6ea8fe" /></label>' +
      '<button class="accent-reset" id="accentReset">Reset to default</button>' +
    "</div>";
  document.body.appendChild(pop);

  function openPop() { pop.classList.add("open"); }
  function closePop() { pop.classList.remove("open"); }
  PF.openAccent = openPop;

  pop.addEventListener("mousedown", function (e) { if (e.target === pop) closePop(); });
  pop.querySelectorAll(".accent-swatch").forEach(function (btn) {
    btn.addEventListener("click", function () {
      var p = PRESETS[+btn.getAttribute("data-i")];
      setAccent(p.a, p.b, true);
    });
  });
  pop.querySelector("#accentCustom").addEventListener("input", function (e) {
    setAccent(e.target.value, null, true);
  });
  pop.querySelector("#accentReset").addEventListener("click", function () { reset(); closePop(); });
  document.addEventListener("keydown", function (e) { if (e.key === "Escape") closePop(); });
})();
