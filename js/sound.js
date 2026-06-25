/* ============================================================
   Aceistt — synthesized UI sound effects (Web Audio, no files).
   Off by default; toggle in the nav. Persists in localStorage.
   Other scripts can call PF.sound('click' | 'open' | 'success').
   ============================================================ */
(function () {
  "use strict";

  var PF = (window.PF = window.PF || {});
  var enabled = false;
  try { enabled = localStorage.getItem("sound") === "on"; } catch (e) {}

  var ctx = null;
  function ac() {
    if (!ctx) {
      var AC = window.AudioContext || window.webkitAudioContext;
      if (AC) ctx = new AC();
    }
    if (ctx && ctx.state === "suspended") ctx.resume();
    return ctx;
  }

  function tone(freq, dur, type, vol, when) {
    var c = ac();
    if (!c) return;
    var t = c.currentTime + (when || 0);
    var osc = c.createOscillator();
    var g = c.createGain();
    osc.type = type || "sine";
    osc.frequency.setValueAtTime(freq, t);
    g.gain.setValueAtTime(0.0001, t);
    g.gain.exponentialRampToValueAtTime(vol || 0.08, t + 0.008);
    g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
    osc.connect(g); g.connect(c.destination);
    osc.start(t); osc.stop(t + dur + 0.02);
  }

  var PRESETS = {
    click:   function () { tone(420, 0.06, "triangle", 0.05); },
    open:    function () { tone(440, 0.08, "sine", 0.06); tone(660, 0.09, "sine", 0.05, 0.05); },
    close:   function () { tone(520, 0.07, "sine", 0.05); tone(360, 0.08, "sine", 0.05, 0.04); },
    success: function () { [523, 659, 784, 1047].forEach(function (f, i) { tone(f, 0.12, "triangle", 0.06, i * 0.07); }); },
    blip:    function () { tone(880, 0.05, "square", 0.03); }
  };

  function play(name) {
    if (!enabled) return;
    var p = PRESETS[name] || PRESETS.click;
    try { p(); } catch (e) {}
  }
  PF.sound = play;

  /* ---- Toggle button ---- */
  var btn = document.getElementById("soundToggle");
  function reflect() {
    document.documentElement.setAttribute("data-sound", enabled ? "on" : "off");
    if (btn) btn.setAttribute("aria-pressed", String(enabled));
  }
  reflect();
  if (btn) {
    btn.addEventListener("click", function () {
      enabled = !enabled;
      try { localStorage.setItem("sound", enabled ? "on" : "off"); } catch (e) {}
      reflect();
      if (enabled) { ac(); play("open"); } // confirm with a sound + unlock audio
    });
  }

  /* ---- Delegated UI clicks ---- */
  document.addEventListener("click", function (e) {
    if (!enabled) return;
    var t = e.target.closest("button, .nav-link, .btn, a.card-link, .cmdk-item, .chat-chip, .tag");
    if (t && t.id !== "soundToggle") play("click");
  }, true);

  PF.soundEnabled = function () { return enabled; };
})();
