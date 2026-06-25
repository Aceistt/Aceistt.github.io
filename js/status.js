/* ============================================================
   Aceistt — footer live status: NL time + day/night, real
   weather (open-meteo, free, no key), and a playful "now" status.
   ============================================================ */
(function () {
  "use strict";

  var clockEl = document.getElementById("footerClock");
  if (!clockEl) return;

  var timeFmt = new Intl.DateTimeFormat("en-GB", {
    timeZone: "Europe/Amsterdam", hour: "2-digit", minute: "2-digit", hour12: false
  });
  var hourFmt = new Intl.DateTimeFormat("en-GB", { timeZone: "Europe/Amsterdam", hour: "2-digit", hour12: false });

  var weather = ""; // filled in async

  function nowStatus(h) {
    if (h < 7) return "😴 sleeping";
    if (h < 9) return "☕ waking up";
    if (h < 12) return "💻 coding";
    if (h < 13) return "🍔 lunch";
    if (h < 17) return "💻 coding";
    if (h < 23) return "🎮 chilling";
    return "🌙 winding down";
  }

  function render() {
    var now = new Date();
    var h = parseInt(hourFmt.format(now), 10);
    var icon = h >= 7 && h < 19 ? "☀️" : "🌙";
    clockEl.textContent =
      icon + " " + timeFmt.format(now) + " NL" +
      (weather ? " · " + weather : "") +
      " · " + nowStatus(h);
  }
  render();
  setInterval(render, 1000);

  // ---- Real weather for Dordrecht via open-meteo (no API key) ----
  function wmoEmoji(c) {
    if (c === 0) return "☀️";
    if (c <= 3) return "⛅";
    if (c <= 48) return "🌫️";
    if (c <= 67) return "🌧️";
    if (c <= 77) return "❄️";
    if (c <= 82) return "🌧️";
    if (c <= 86) return "🌨️";
    return "⛈️";
  }
  function loadWeather() {
    fetch("https://api.open-meteo.com/v1/forecast?latitude=51.81&longitude=4.66&current=temperature_2m,weather_code&timezone=Europe%2FAmsterdam")
      .then(function (r) { return r.ok ? r.json() : Promise.reject(); })
      .then(function (d) {
        if (!d || !d.current) return;
        weather = Math.round(d.current.temperature_2m) + "°C " + wmoEmoji(d.current.weather_code);
        render();
      })
      .catch(function () { /* leave weather blank if offline */ });
  }
  loadWeather();
  setInterval(loadWeather, 15 * 60 * 1000); // refresh every 15 min
})();
