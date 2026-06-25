/* ============================================================
   Aceistt — bilingual (EN / NL) support.
   Swaps text on [data-i18n] elements, persists choice, and
   dispatches "i18n:changed" so other scripts (e.g. the hero
   typer) can react. Loaded BEFORE main.js.
   ============================================================ */
(function () {
  "use strict";

  var I18N = {
    en: {
      "skip": "Skip to content",
      "cmdk.search": "Search",

      "nav.about": "About",
      "nav.experience": "Experience",
      "nav.projects": "Projects",
      "nav.contact": "Contact",

      "hero.eyebrow": "Hi, I'm",
      "hero.roles": "Software Developer,React Native Developer,Web Developer,Student @ Curio",
      "hero.tagline": "I build clean, reliable web applications — turning ideas into fast, accessible products that people enjoy using.",
      "hero.viewProjects": "View Projects",
      "hero.getInTouch": "Get in touch",
      "hero.cv": "Download CV",

      "about.eyebrow": "About",
      "about.title": "A bit about me",
      "about.p1": "I'm a software developer who enjoys building things for the web — from polished front-ends to the APIs and tooling behind them. I care about clean code, thoughtful UX, and shipping work that holds up.",
      "about.p2": "When I'm not coding, I'm usually learning something new, tinkering with side projects, or exploring better ways to solve everyday problems.",
      "about.focusLabel": "Focus",
      "about.focusValue": "Web apps & APIs",
      "about.basedLabel": "Based in",
      "about.basedValue": "Netherlands",
      "about.openLabel": "Open to",
      "about.openValue": "Job offers & new opportunities",

      "exp.eyebrow": "Journey",
      "exp.title": "Education & experience",
      "exp.lead": "Where I'm learning and growing as a developer.",
      "exp.eduTitle": "Education",
      "exp.expTitle": "Experience",
      "edu.curio.title": "Software Development",
      "edu.curio.desc": "Studying software development — programming, web development, databases, and building real projects from the ground up.",
      "exp.rex.date": "Apr 2026 — Jun 2026",
      "exp.rex.title": "Software Development Intern",
      "exp.rex.desc": "Built a complete website and a mobile application end-to-end, and shipped functional and technical improvements — gaining experience across the full development process, from design to implementation.",

      "work.eyebrow": "Work",
      "work.title": "Selected projects",
      "work.lead": "A few things I've built — from console apps to the web.",
      "proj.caseStudy": "Case study →",
      "proj.hisuri.desc": "A website and mobile app built during my internship at Rex Media — taking a real product from design through to a working registration platform.",
      "proj.rpg.desc": "A text-based role-playing game that runs entirely in the console, built in C# — combat, exploration, and game state from scratch.",
      "proj.ttt.desc": "A classic tic-tac-toe game built with React — interactive board, turn tracking, and win detection.",
      "proj.booking.desc": "A Python script for handling check-in and booking flows — automating a repetitive reservation task.",
      "proj.logbook.desc": "A Python logbook tool for recording and reviewing entries over time — a lightweight, practical utility.",

      "more.title": "More on GitHub",
      "more.link": "See all repositories ↗",
      "gh.repos": "Repositories",
      "gh.stars": "Stars earned",
      "gh.langs": "Languages",
      "gh.breakdown": "Language breakdown",

      "skills.eyebrow": "Toolbox",
      "skills.title": "Skills & tech",

      "contact.eyebrow": "Contact",
      "contact.title": "Let's work together",
      "contact.lead": "Have a project in mind or just want to say hi? Reach out.",
      "contact.email": "Email",

      "guest.eyebrow": "Guestbook",
      "guest.title": "Sign the guestbook",
      "guest.lead": "Sign in with GitHub and leave a message — powered by giscus.",

      "footer.status": "Available for new opportunities",
      "footer.ctaTitle": "Let's build something together.",
      "footer.ctaBtn": "Say hello",
      "footer.blurb": "Software developer building websites, mobile apps and tools.",
      "footer.navTitle": "Navigate",
      "footer.elsewhereTitle": "Elsewhere",
      "footer.built": "Built with HTML, CSS & JS.",
      "footer.top": "Back to top ↑"
    },

    nl: {
      "skip": "Naar inhoud",
      "cmdk.search": "Zoeken",

      "nav.about": "Over mij",
      "nav.experience": "Ervaring",
      "nav.projects": "Projecten",
      "nav.contact": "Contact",

      "hero.eyebrow": "Hoi, ik ben",
      "hero.roles": "Softwareontwikkelaar,React Native-ontwikkelaar,Webontwikkelaar,Student @ Curio",
      "hero.tagline": "Ik bouw strakke, betrouwbare webapplicaties — en zet ideeën om in snelle, toegankelijke producten waar mensen graag mee werken.",
      "hero.viewProjects": "Bekijk projecten",
      "hero.getInTouch": "Neem contact op",
      "hero.cv": "Download cv",

      "about.eyebrow": "Over mij",
      "about.title": "Even voorstellen",
      "about.p1": "Ik ben een softwareontwikkelaar die graag dingen voor het web bouwt — van verzorgde front-ends tot de API's en tooling erachter. Ik hecht aan nette code, doordachte UX en werk dat blijft staan.",
      "about.p2": "Als ik niet aan het programmeren ben, ben ik meestal iets nieuws aan het leren, aan het knutselen aan zijprojecten, of op zoek naar betere manieren om alledaagse problemen op te lossen.",
      "about.focusLabel": "Focus",
      "about.focusValue": "Web-apps & API's",
      "about.basedLabel": "Woonachtig in",
      "about.basedValue": "Nederland",
      "about.openLabel": "Open voor",
      "about.openValue": "Vacatures & nieuwe kansen",

      "exp.eyebrow": "Mijn pad",
      "exp.title": "Opleiding & ervaring",
      "exp.lead": "Waar ik leer en groei als ontwikkelaar.",
      "exp.eduTitle": "Opleiding",
      "exp.expTitle": "Ervaring",
      "edu.curio.title": "Software Development",
      "edu.curio.desc": "Ik studeer software development — programmeren, webontwikkeling, databases en het van de grond af bouwen van echte projecten.",
      "exp.rex.date": "apr. 2026 — jun. 2026",
      "exp.rex.title": "Stagiair Software Development",
      "exp.rex.desc": "Een volledige website en mobiele app van begin tot eind gebouwd en functionele en technische verbeteringen doorgevoerd — ervaring opgedaan met het hele ontwikkelproces, van ontwerp tot implementatie.",

      "work.eyebrow": "Werk",
      "work.title": "Geselecteerde projecten",
      "work.lead": "Een greep uit wat ik heb gebouwd — van console-apps tot het web.",
      "proj.caseStudy": "Casestudy →",
      "proj.hisuri.desc": "Een website en mobiele app gebouwd tijdens mijn stage bij Rex Media — een echt product van ontwerp tot een werkend registratieplatform.",
      "proj.rpg.desc": "Een tekstgebaseerd rollenspel dat volledig in de console draait, gebouwd in C# — gevechten, verkenning en spelstatus volledig zelf gemaakt.",
      "proj.ttt.desc": "Een klassiek boter-kaas-en-eieren spel gebouwd met React — interactief bord, beurtwisseling en winstdetectie.",
      "proj.booking.desc": "Een Python-script voor het afhandelen van check-in- en boekingsstromen — een repetitieve reserveringstaak geautomatiseerd.",
      "proj.logbook.desc": "Een Python-logboektool om gegevens over tijd vast te leggen en terug te lezen — een lichte, praktische tool.",

      "more.title": "Meer op GitHub",
      "more.link": "Bekijk alle repositories ↗",
      "gh.repos": "Repositories",
      "gh.stars": "Sterren verdiend",
      "gh.langs": "Talen",
      "gh.breakdown": "Verdeling per taal",

      "skills.eyebrow": "Gereedschap",
      "skills.title": "Vaardigheden & tech",

      "contact.eyebrow": "Contact",
      "contact.title": "Laten we samenwerken",
      "contact.lead": "Heb je een project in gedachten of wil je gewoon even hallo zeggen? Neem contact op.",
      "contact.email": "E-mail",

      "guest.eyebrow": "Gastenboek",
      "guest.title": "Teken het gastenboek",
      "guest.lead": "Log in met GitHub en laat een bericht achter — mogelijk gemaakt door giscus.",

      "footer.status": "Beschikbaar voor nieuwe kansen",
      "footer.ctaTitle": "Laten we samen iets bouwen.",
      "footer.ctaBtn": "Zeg hallo",
      "footer.blurb": "Softwareontwikkelaar die websites, mobiele apps en tools bouwt.",
      "footer.navTitle": "Navigatie",
      "footer.elsewhereTitle": "Elders",
      "footer.built": "Gemaakt met HTML, CSS & JS.",
      "footer.top": "Terug naar boven ↑"
    }
  };

  var LANGS = ["en", "nl"];

  function getInitialLang() {
    try {
      var saved = localStorage.getItem("lang");
      if (saved && LANGS.indexOf(saved) !== -1) return saved;
    } catch (e) {}
    var nav = (navigator.language || "en").toLowerCase();
    return nav.indexOf("nl") === 0 ? "nl" : "en";
  }

  function apply(lang) {
    var dict = I18N[lang] || I18N.en;

    document.documentElement.setAttribute("lang", lang);

    document.querySelectorAll("[data-i18n]").forEach(function (el) {
      var key = el.getAttribute("data-i18n");
      if (dict[key] != null) el.textContent = dict[key];
    });

    // Hero typing roles live in a data-attribute, not text content.
    var typed = document.getElementById("typed");
    if (typed && dict["hero.roles"]) typed.setAttribute("data-words", dict["hero.roles"]);

    // The button shows the language you'd switch TO.
    var btn = document.getElementById("langToggle");
    if (btn) {
      var other = lang === "en" ? "nl" : "en";
      btn.textContent = other.toUpperCase();
      btn.setAttribute("aria-label", other === "nl" ? "Schakel naar Nederlands" : "Switch to English");
    }

    try { localStorage.setItem("lang", lang); } catch (e) {}

    document.dispatchEvent(new CustomEvent("i18n:changed", { detail: { lang: lang } }));
  }

  function current() {
    var l = document.documentElement.getAttribute("lang");
    return LANGS.indexOf(l) !== -1 ? l : "en";
  }

  // Apply as soon as the DOM is ready.
  function init() {
    apply(getInitialLang());
    var btn = document.getElementById("langToggle");
    if (btn) {
      btn.addEventListener("click", function () {
        apply(current() === "en" ? "nl" : "en");
        if (PF.unlock) PF.unlock("lang");
      });
    }
  }

  // Shared global API for the command palette / terminal.
  var PF = (window.PF = window.PF || {});
  PF.setLang = apply;
  PF.getLang = current;
  PF.toggleLang = function () { apply(current() === "en" ? "nl" : "en"); if (PF.unlock) PF.unlock("lang"); };

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
