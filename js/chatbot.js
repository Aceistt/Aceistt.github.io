/* ============================================================
   Aceistt — "Ask my portfolio" chatbot (rule-based, no backend).
   Scoring-based intent matching, varied replies, bilingual,
   and it can actually trigger site actions via window.PF.
   ============================================================ */
(function () {
  "use strict";

  var PF = (window.PF = window.PF || {});
  function lang() { return (PF.getLang && PF.getLang()) || "en"; }
  function pick(arr) { return arr[Math.floor(Math.random() * arr.length)]; }

  // Age is computed live so it stays correct without hard-coding a number.
  var BIRTH_YEAR = 2008, BIRTH_MONTH = 6; // month is 0-indexed
  function calcAge() {
    var now = new Date();
    var age = now.getFullYear() - BIRTH_YEAR;
    if (now.getMonth() < BIRTH_MONTH) age--;
    return age;
  }
  // Replace {age}, {name}, {fullname} tokens in a reply.
  function fill(text) {
    return text
      .replace(/\{age\}/g, calcAge())
      .replace(/\{fullname\}/g, "Terence Werman")
      .replace(/\{name\}/g, "Terence");
  }

  function norm(s) {
    return (" " + s.toLowerCase() + " ")
      .normalize("NFD").replace(/[̀-ͯ]/g, "")   // strip accents
      .replace(/[^a-z0-9# ]+/g, " ")                         // drop punctuation
      .replace(/\s+/g, " ");
  }

  /* ---- Intents ----
     k: keywords (any language). Longer phrases score higher.
     en / nl: arrays of possible replies (one picked at random).
     act: optional action to actually do something. ----------- */
  var INTENTS = [
    {
      id: "greeting", k: ["hi", "hello", "hey", "yo", "hoi", "hallo", "hey there", "good morning", "goedemorgen", "hej", "sup", "howdy"],
      en: ["Hey there! 👋 Ask me about Terence's skills, projects, internship, or how to reach him.",
           "Hi! 😄 What do you want to know — skills, projects, contact?"],
      nl: ["Hoi! 👋 Vraag me over Terence's skills, projecten, stage of hoe je hem bereikt.",
           "Hey! 😄 Wat wil je weten — skills, projecten, contact?"]
    },
    {
      id: "howareyou", k: ["how are you", "how r u", "hows it going", "how is it going", "hoe gaat het", "alles goed", "how you doing"],
      en: ["Running at 60fps, thanks for asking! 😎 How can I help?",
           "All good — just vibing in the footer. What can I tell you?"],
      nl: ["Draait op 60fps, dankje! 😎 Waarmee kan ik helpen?",
           "Prima — gewoon lekker aan het chillen hier. Wat wil je weten?"]
    },
    {
      id: "who", k: ["who are you", "who is terence", "who is this", "wie ben je", "wie is terence", "about you", "tell me about", "wie ben jij", "yourself", "jezelf", "aceistt", "terence"],
      en: ["I'm Terence's mini-assistant 🤖. Terence Werman (aka Aceistt) is a {age}-year-old software developer who builds for web and mobile — curious, fast-learning, and happiest shipping real things.",
           "Terence Werman — handle 'Aceistt' — is a {age}-year-old software developer studying at Curio, fresh off a Rex Media internship. He likes clean code and building stuff people actually use."],
      nl: ["Ik ben Terence's mini-assistent 🤖. Terence Werman (oftewel Aceistt) is een {age}-jarige softwareontwikkelaar die voor web én mobiel bouwt — nieuwsgierig, leert snel, en het gelukkigst als er iets echts wordt opgeleverd.",
           "Terence Werman — handle 'Aceistt' — is een {age}-jarige softwareontwikkelaar, studeert aan Curio en heeft net stage gelopen bij Rex Media. Houdt van nette code en dingen die mensen echt gebruiken."]
    },
    {
      id: "name", k: ["full name", "fullname", "your name", "whats your name", "what is your name", "volledige naam", "achternaam", "last name", "surname", "hoe heet", "real name", "echte naam"],
      en: ["His full name is Terence Werman — online he goes by 'Aceistt'.",
           "That'd be Terence Werman 🙂 (handle: Aceistt)."],
      nl: ["Zijn volledige naam is Terence Werman — online heet hij 'Aceistt'.",
           "Dat is Terence Werman 🙂 (handle: Aceistt)."]
    },
    {
      id: "skills", k: ["skill", "skills", "tech", "stack", "language", "languages", "talen", "vaardig", "kunnen", "programmeer", "programming", "code in", "technologies", "frameworks"],
      en: ["Terence works with C#, Python and JavaScript, plus React, React Native, HTML, CSS and Git. The mobile side (React Native) is from the Rex Media internship.",
           "Main stack: C#, Python, JavaScript, React & React Native, HTML/CSS, Git. Want detail on any of them?"],
      nl: ["Terence werkt met C#, Python en JavaScript, plus React, React Native, HTML, CSS en Git. Het mobiele deel (React Native) komt van de stage bij Rex Media.",
           "Belangrijkste stack: C#, Python, JavaScript, React & React Native, HTML/CSS, Git. Wil je over een specifieke meer weten?"]
    },
    {
      id: "projects", k: ["project", "projects", "projecten", "built", "gebouwd", "work", "werk", "portfolio", "made", "gemaakt", "what have you", "wat heb je gemaakt"],
      en: ["Main project: Hisuri — a website + mobile registration platform (Rex Media). Others: Amazing RPG (C# console game), a React Tic-Tac-Toe, and Python tools (Booking, Logbook). Ask about any one!",
           "There's Hisuri (web + app), Amazing RPG (C#), Tic-Tac-Toe (React), and Booking/Logbook (Python). Which sounds interesting?"],
      nl: ["Grootste project: Hisuri — een website + mobiel registratieplatform (Rex Media). Verder: Amazing RPG (C#-consolespel), een React Boter-kaas-en-eieren, en Python-tools (Booking, Logbook). Vraag naar eentje!",
           "Er is Hisuri (web + app), Amazing RPG (C#), Tic-Tac-Toe (React), en Booking/Logbook (Python). Welke spreekt aan?"]
    },
    {
      id: "hisuri", k: ["hisuri", "case study", "casestudy", "registration", "registratie"],
      en: ["Hisuri is Terence's standout project — a website and React Native mobile app built end-to-end during the Rex Media internship, from design to a working registration platform. There's a full case study on the site (open it via the command palette, ⌘K).",],
      nl: ["Hisuri is Terence's pronkstuk — een website en React Native-app, van begin tot eind gebouwd tijdens de stage bij Rex Media, van ontwerp tot werkend registratieplatform. Er staat een volledige case study op de site (open via het commandopalet, ⌘K).",]
    },
    {
      id: "rpg", k: ["rpg", "amazing rpg", "game", "spel", "console game", "c#"],
      en: ["Amazing RPG is a text-based role-playing game running entirely in the console, built in C# — combat, exploration and game state coded from scratch.",],
      nl: ["Amazing RPG is een tekstgebaseerd rollenspel dat volledig in de console draait, gebouwd in C# — gevechten, verkenning en spelstatus volledig zelf gecodeerd.",]
    },
    {
      id: "internship", k: ["internship", "stage", "rex media", "rexmedia", "experience", "ervaring", "job experience", "werkervaring"],
      en: ["At the Rex Media internship (Apr–Jun 2026, Dordrecht) Terence built Hisuri end-to-end: a website and a React Native app, plus functional and technical improvements — the full process from design to shipping.",],
      nl: ["Tijdens de stage bij Rex Media (apr–jun 2026, Dordrecht) bouwde Terence Hisuri van begin tot eind: een website en een React Native-app, plus functionele en technische verbeteringen — het hele proces van ontwerp tot oplevering.",]
    },
    {
      id: "education", k: ["study", "studie", "school", "curio", "education", "opleiding", "studeer", "learning", "leren", "student"],
      en: ["Terence is studying Software Development at Curio (2024–2028) — programming, web development, databases and real project work.",],
      nl: ["Terence studeert Software Development aan Curio (2024–2028) — programmeren, webontwikkeling, databases en echte projecten.",]
    },
    {
      id: "contact", k: ["contact", "email", "mail", "reach", "bereik", "get in touch", "message", "berichten", "e mail"],
      en: ["Easiest is email: terence.werman@outlook.com 📧. Also on GitHub (@Aceistt) and LinkedIn (/in/terence-werman). Want me to scroll you to the contact section?"],
      nl: ["Het makkelijkst is e-mail: terence.werman@outlook.com 📧. Ook op GitHub (@Aceistt) en LinkedIn (/in/terence-werman). Zal ik je naar het contactblok scrollen?"],
      act: function () { setTimeout(function () { var el = document.querySelector("#contact"); if (el) el.scrollIntoView({ behavior: "smooth" }); }, 600); }
    },
    {
      id: "hire", k: ["hire", "inhuren", "available", "beschikbaar", "job", "vacature", "freelance", "work together", "samenwerken", "opdracht", "looking for work", "open to"],
      en: ["Yes — Terence is open to new opportunities! 🚀 Best is email: terence.werman@outlook.com. He's into web + mobile development.",],
      nl: ["Ja — Terence staat open voor nieuwe kansen! 🚀 Het beste is e-mail: terence.werman@outlook.com. Hij doet web- + mobiele ontwikkeling.",]
    },
    {
      id: "whyhire", k: ["why hire", "why you", "what makes you", "waarom jou", "waarom inhuren", "strong", "sterk", "good at"],
      en: ["Terence learns fast, takes ownership, and ships real products — he built a full website + app during a 3-month internship. Curious, reliable, and he sweats the details. 💪",],
      nl: ["Terence leert snel, neemt eigenaarschap en levert échte producten op — een volledige website + app in een stage van 3 maanden. Nieuwsgierig, betrouwbaar, en let op de details. 💪",]
    },
    {
      id: "location", k: ["where", "waar", "location", "based", "woon", "city", "stad", "country", "land", "netherlands", "nederland"],
      en: ["Terence is based in the Netherlands 🇳🇱 (the Rex Media internship was in Dordrecht).",],
      nl: ["Terence woont in Nederland 🇳🇱 (de stage bij Rex Media was in Dordrecht).",]
    },
    {
      id: "hobbies", k: ["hobby", "hobbies", "free time", "vrije tijd", "fun", "leuk", "outside", "buiten werk", "spare time"],
      en: ["Outside coding Terence is usually learning something new, tinkering with side projects, or finding better ways to solve everyday problems. (This very site is one of those side projects 😉)",],
      nl: ["Buiten het coderen is Terence meestal iets nieuws aan het leren, aan het knutselen aan zijprojecten, of op zoek naar betere manieren om alledaagse problemen op te lossen. (Deze site is er zo eentje 😉)",]
    },
    {
      id: "cv", k: ["cv", "resume", "curriculum", "download cv", "lebenslauf"],
      en: ["You can grab Terence's CV from the hero — opening it for you now. 📄"],
      nl: ["Je kunt Terence's cv pakken bovenaan de pagina — ik open 'm nu voor je. 📄"],
      act: function () { setTimeout(function () { window.location.href = "assets/cv.pdf"; }, 700); }
    },
    {
      id: "secret", k: ["secret", "secrets", "easter", "egg", "konami", "hidden", "geheim", "geheimen", "cheat", "cool stuff"],
      en: ["Ooh, a fellow explorer 😏 Try the Konami code (↑↑↓↓←→←→ B A), press ⌘K for the command palette, or ask me to 'open terminal' and type 'matrix'.",],
      nl: ["Oh, een mede-ontdekker 😏 Probeer de Konami-code (↑↑↓↓←→←→ B A), druk ⌘K voor het commandopalet, of vraag me om de 'terminal te openen' en typ 'matrix'.",]
    },
    {
      id: "joke", k: ["joke", "grap", "mop", "funny", "make me laugh", "lach"],
      en: ["Why do programmers prefer dark mode? Because light attracts bugs. 🐛 (speaking of which — try the theme toggle!)",
           "A SQL query walks into a bar, walks up to two tables and asks: 'Can I join you?' 🍻"],
      nl: ["Waarom gebruiken programmeurs dark mode? Omdat licht bugs aantrekt. 🐛 (probeer trouwens de thema-knop!)",
           "Een SQL-query loopt een café binnen, ziet twee tafels en vraagt: 'Mag ik joinen?' 🍻"]
    },
    {
      id: "thanks", k: ["thank", "thanks", "bedankt", "dank", "thx", "merci", "appreciate"],
      en: ["Anytime! 😄 Anything else you'd like to know?", "You're welcome! Ask me more whenever."],
      nl: ["Graag gedaan! 😄 Wil je nog iets weten?", "Geen probleem! Vraag gerust meer."]
    },
    {
      id: "compliment", k: ["cool", "nice", "awesome", "vet", "mooi", "gaaf", "amazing", "love it", "great site", "sick", "impressive", "tof"],
      en: ["Thanks — Terence built every pixel by hand with plain HTML/CSS/JS. 🙌 Want to see the projects?", "Right?! All vanilla, no frameworks. 😎"],
      nl: ["Dankje — Terence heeft elke pixel met de hand gebouwd in pure HTML/CSS/JS. 🙌 Wil je de projecten zien?", "Toch?! Helemaal vanilla, geen frameworks. 😎"]
    },
    {
      id: "bye", k: ["bye", "goodbye", "doei", "tot ziens", "later", "ciao", "see ya", "cya"],
      en: ["See you! 👋 Don't forget to reach out: terence.werman@outlook.com", "Later! 👋 Ping Terence any time."],
      nl: ["Tot ziens! 👋 Vergeet niet contact op te nemen: terence.werman@outlook.com", "Later! 👋 Mail Terence gerust."]
    },
    {
      id: "age", k: ["how old", "age", "leeftijd", "hoe oud", "born", "geboren", "birthday", "verjaardag", "birth date", "geboortedatum"],
      en: ["Terence is {age} years old. 🎂",
           "He's {age} — young, hungry, and learning fast. 🚀"],
      nl: ["Terence is {age} jaar oud. 🎂",
           "Hij is {age} — jong, gretig en snel lerend. 🚀"]
    },

    /* ---- Action intents (the bot actually does something) ---- */
    {
      id: "act_dark", k: ["dark mode", "dark theme", "donker", "donkere modus", "lights off", "night mode"],
      en: ["Lights off. 🌙"], nl: ["Lichten uit. 🌙"],
      act: function () { if (PF.setTheme) PF.setTheme("dark"); }
    },
    {
      id: "act_light", k: ["light mode", "light theme", "licht", "lichte modus", "lights on", "day mode"],
      en: ["Let there be light. ☀️"], nl: ["Daar is het licht. ☀️"],
      act: function () { if (PF.setTheme) PF.setTheme("light"); }
    },
    {
      id: "act_confetti", k: ["confetti", "party", "feest", "celebrate", "vier"],
      en: ["🎉🎉🎉"], nl: ["🎉🎉🎉"],
      act: function () { if (PF.confetti) PF.confetti(); }
    },
    {
      id: "act_terminal", k: ["open terminal", "terminal", "console", "cli", "shell", "command line"],
      en: ["Opening the terminal — type 'help' in there. ▸"], nl: ["Terminal openen — typ daar 'help'. ▸"],
      act: function () { if (PF.openTerminal) setTimeout(PF.openTerminal, 500); }
    },
    {
      id: "act_matrix", k: ["matrix", "neo", "rain", "regen", "red pill"],
      en: ["Wake up, Neo… 🟢"], nl: ["Word wakker, Neo… 🟢"],
      act: function () { if (PF.matrix) setTimeout(PF.matrix, 400); }
    },
    {
      id: "act_retro", k: ["retro", "crt", "vintage", "old school", "80s", "90s"],
      en: ["Flipping the time machine… 📺 (ask again to switch back)"], nl: ["Tijdmachine aan… 📺 (vraag nog eens om terug te gaan)"],
      act: function () { if (PF.toggleRetro) PF.toggleRetro(); }
    },
    {
      id: "act_color", k: ["change color", "change colour", "accent", "recolor", "kleur", "verander kleur", "theme color"],
      en: ["Opening the colour picker — make it yours. 🎨"], nl: ["Kleurkiezer openen — maak 'm van jou. 🎨"],
      act: function () { if (PF.openAccent) setTimeout(PF.openAccent, 400); }
    },
    {
      id: "act_lang", k: ["dutch", "nederlands", "english", "engels", "switch language", "andere taal", "change language", "taal"],
      en: ["Switching language. 🌐"], nl: ["Taal wisselen. 🌐"],
      act: function () { if (PF.toggleLang) PF.toggleLang(); }
    },
    {
      id: "act_achievements", k: ["achievement", "achievements", "badges", "trophies", "prestaties", "progress"],
      en: ["Here's the trophy cabinet 🏆"], nl: ["Hier is de prijzenkast 🏆"],
      act: function () { if (PF.openAchievements) setTimeout(PF.openAchievements, 400); }
    }
  ];

  var FALLBACK = {
    en: ["Hmm, not sure about that one 🤔 — I can talk about skills, projects, the internship, studies, contact, or do tricks (try 'dark mode', 'confetti', 'open terminal').",
         "I didn't quite get that. Ask about Terence's skills, projects or contact — or type 'confetti' 😉"],
    nl: ["Hmm, die snap ik niet helemaal 🤔 — ik kan vertellen over skills, projecten, de stage, opleiding, contact, of trucjes doen (probeer 'dark mode', 'confetti', 'open terminal').",
         "Snapte 'm niet helemaal. Vraag naar Terence's skills, projecten of contact — of typ 'confetti' 😉"]
  };
  var GREETING = {
    en: "Hi! 👋 I'm Terence's assistant. Ask me anything — or tell me to do tricks like 'dark mode' or 'confetti'.",
    nl: "Hoi! 👋 Ik ben Terence's assistent. Vraag me alles — of laat me trucjes doen zoals 'dark mode' of 'confetti'."
  };
  var SUGGEST = {
    en: ["What are your skills?", "Tell me about Hisuri", "Are you available?", "Do a trick 🎉"],
    nl: ["Wat zijn je skills?", "Vertel over Hisuri", "Ben je beschikbaar?", "Doe een trucje 🎉"]
  };

  function match(text) {
    var q = norm(text);
    var best = null, bestScore = 0;
    INTENTS.forEach(function (intent) {
      var score = 0;
      intent.k.forEach(function (kw) {
        if (q.indexOf(" " + kw + " ") !== -1 || q.indexOf(" " + kw) !== -1 && kw.indexOf(" ") !== -1) {
          score += kw.indexOf(" ") !== -1 ? 3 : 1; // multi-word phrases weigh more
        } else if (q.indexOf(kw) !== -1) {
          score += kw.length > 3 ? 1 : 0.5;
        }
      });
      if (score > bestScore) { bestScore = score; best = intent; }
    });
    return bestScore > 0 ? best : null;
  }

  function reply(text) {
    var intent = match(text);
    if (!intent) return { text: fill(pick(FALLBACK[lang()] || FALLBACK.en)) };
    if (intent.act) { try { intent.act(); } catch (e) {} }
    return { text: fill(pick(intent[lang()] || intent.en)) };
  }

  /* ============================================================
     UI
     ============================================================ */
  var btn = document.createElement("button");
  btn.className = "chat-fab";
  btn.id = "chatFab";
  btn.setAttribute("aria-label", "Open chat");
  btn.innerHTML =
    '<svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' +
    '<path d="M21 11.5a8.5 8.5 0 0 1-12.3 7.6L3 21l1.9-5.7A8.5 8.5 0 1 1 21 11.5z"/></svg>';
  document.body.appendChild(btn);

  var panel = document.createElement("div");
  panel.className = "chat-panel";
  panel.innerHTML =
    '<div class="chat-head">' +
      '<span class="chat-avatar"><img src="assets/icon.png" alt="Aceist" /></span>' +
      '<div><strong>Ask my portfolio</strong><span class="chat-sub">Usually replies instantly 🤖</span></div>' +
      '<button class="chat-close" id="chatClose" aria-label="Close chat">×</button>' +
    "</div>" +
    '<div class="chat-log" id="chatLog"></div>' +
    '<div class="chat-suggest" id="chatSuggest"></div>' +
    '<form class="chat-form" id="chatForm">' +
      '<input class="chat-input" id="chatInput" type="text" placeholder="Type a message…" autocomplete="off" />' +
      '<button class="chat-send" type="submit" aria-label="Send">➤</button>' +
    "</form>";
  document.body.appendChild(panel);

  var log = panel.querySelector("#chatLog");
  var suggestWrap = panel.querySelector("#chatSuggest");
  var form = panel.querySelector("#chatForm");
  var inputEl = panel.querySelector("#chatInput");
  var greeted = false;

  function bubble(text, who) {
    var b = document.createElement("div");
    b.className = "chat-msg chat-msg--" + who;
    b.textContent = text;
    log.appendChild(b);
    log.scrollTop = log.scrollHeight;
    return b;
  }
  function botReply(text) {
    var typing = document.createElement("div");
    typing.className = "chat-msg chat-msg--bot chat-typing";
    typing.innerHTML = "<span></span><span></span><span></span>";
    log.appendChild(typing);
    log.scrollTop = log.scrollHeight;
    setTimeout(function () { typing.remove(); bubble(text, "bot"); }, 420 + Math.min(text.length * 7, 650));
  }
  function renderSuggest() {
    suggestWrap.innerHTML = "";
    (SUGGEST[lang()] || SUGGEST.en).forEach(function (s) {
      var chip = document.createElement("button");
      chip.className = "chat-chip";
      chip.type = "button";
      chip.textContent = s;
      chip.addEventListener("click", function () { send(s); });
      suggestWrap.appendChild(chip);
    });
  }
  function send(text) {
    if (!text.trim()) return;
    bubble(text, "user");
    inputEl.value = "";
    var r = reply(text);
    botReply(r.text);
  }

  function openChat() {
    panel.classList.add("open");
    btn.classList.add("hidden");
    if (!greeted) { bubble(GREETING[lang()] || GREETING.en, "bot"); greeted = true; }
    renderSuggest();
    setTimeout(function () { inputEl.focus(); }, 50);
  }
  function closeChat() { panel.classList.remove("open"); btn.classList.remove("hidden"); }

  btn.addEventListener("click", openChat);
  panel.querySelector("#chatClose").addEventListener("click", closeChat);
  form.addEventListener("submit", function (e) { e.preventDefault(); send(inputEl.value); });
  document.addEventListener("keydown", function (e) { if (e.key === "Escape") closeChat(); });
  document.addEventListener("i18n:changed", function () { if (panel.classList.contains("open")) renderSuggest(); });

  PF.openChat = openChat;
})();
