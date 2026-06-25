/* ============================================================
   Aceistt — Portfolio behavior
   Mobile nav, scroll-reveal, active-link highlighting, header shadow.
   ============================================================ */
(function () {
  "use strict";

  const header = document.querySelector(".site-header");
  const toggle = document.getElementById("navToggle");
  const menu = document.getElementById("navMenu");
  const navLinks = Array.from(document.querySelectorAll(".nav-link"));
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  // Shared global API so the command palette / terminal can drive the same controls.
  const PF = (window.PF = window.PF || {});

  /* ---- Theme toggle (dark / light) ---- */
  function setTheme(next) {
    if (next === "light") {
      document.documentElement.setAttribute("data-theme", "light");
    } else {
      document.documentElement.removeAttribute("data-theme");
    }
    try { localStorage.setItem("theme", next); } catch (e) {}
    if (PF.unlock) PF.unlock("theme");
  }
  function toggleTheme() {
    const isLight = document.documentElement.getAttribute("data-theme") === "light";
    setTheme(isLight ? "dark" : "light");
  }
  PF.setTheme = setTheme;
  PF.toggleTheme = toggleTheme;

  const themeToggle = document.getElementById("themeToggle");
  if (themeToggle) themeToggle.addEventListener("click", toggleTheme);

  /* ---- Rotating / typing hero text ---- */
  const typed = document.getElementById("typed");
  let typeTimer = null;
  function startTyping() {
    if (!typed) return;
    if (typeTimer) { window.clearTimeout(typeTimer); typeTimer = null; }
    const words = (typed.getAttribute("data-words") || "")
      .split(",").map(function (w) { return w.trim(); }).filter(Boolean);
    if (!words.length) return;

    if (reduceMotion) {
      typed.textContent = words[0]; // no animation — just show the first role
      return;
    }
    let wordIndex = 0, charIndex = 0, deleting = false;
    const type = function () {
      const word = words[wordIndex];
      typed.textContent = word.slice(0, charIndex);
      let delay;
      if (!deleting && charIndex < word.length) {
        charIndex++; delay = 90;
      } else if (deleting && charIndex > 0) {
        charIndex--; delay = 45;
      } else if (!deleting && charIndex === word.length) {
        deleting = true; delay = 1600; // pause on the full word
      } else {
        deleting = false; wordIndex = (wordIndex + 1) % words.length; delay = 350;
      }
      typeTimer = window.setTimeout(type, delay);
    };
    type();
  }
  startTyping();
  // Restart with the new roles whenever the language changes.
  document.addEventListener("i18n:changed", startTyping);

  /* ---- Live "More on GitHub" repos ---- */
  const moreGithub = document.getElementById("moreGithub");
  const repoGrid = document.getElementById("repoGrid");
  if (moreGithub && repoGrid) {
    // Repos already showcased above (or not worth listing) — skip these.
    const FEATURED = ["amazingrpg", "tic-tac-toe-react", "booking", "logbook", "aceistt", "aceistt.github.io"];
    const MAX = 6;
    fetch("https://api.github.com/users/Aceistt/repos?per_page=100&sort=updated")
      .then(function (res) { return res.ok ? res.json() : Promise.reject(); })
      .then(function (repos) {
        if (!Array.isArray(repos)) return;

        // ---- Stats across all original (non-fork) repos ----
        renderGithubStats(repos.filter(function (r) { return !r.fork; }));

        const items = repos
          .filter(function (r) { return !r.fork && FEATURED.indexOf(r.name.toLowerCase()) === -1; })
          .slice(0, MAX);
        if (!items.length) { moreGithub.hidden = false; return; }

        const frag = document.createDocumentFragment();
        items.forEach(function (r) {
          const a = document.createElement("a");
          a.className = "repo-card";
          a.href = r.html_url;
          a.target = "_blank";
          a.rel = "noopener";

          const name = document.createElement("span");
          name.className = "repo-card-name";
          name.textContent = r.name;
          a.appendChild(name);

          if (r.description) {
            const desc = document.createElement("p");
            desc.className = "repo-card-desc";
            desc.textContent = r.description;
            a.appendChild(desc);
          }

          const meta = document.createElement("div");
          meta.className = "repo-card-meta";
          if (r.language) {
            const lang = document.createElement("span");
            lang.className = "repo-lang";
            lang.textContent = r.language;
            meta.appendChild(lang);
          }
          if (r.stargazers_count > 0) {
            const stars = document.createElement("span");
            stars.textContent = "★ " + r.stargazers_count;
            meta.appendChild(stars);
          }
          if (meta.childNodes.length) a.appendChild(meta);

          frag.appendChild(a);
        });
        repoGrid.appendChild(frag);
        moreGithub.hidden = false;
      })
      .catch(function () { /* GitHub unreachable or rate-limited — keep section hidden */ });
  }

  function renderGithubStats(repos) {
    const wrap = document.getElementById("ghStats");
    if (!wrap || !repos.length) return;

    const LANG_COLORS = {
      "C#": "#9b6cf0", "Python": "#3fa0ff", "JavaScript": "#f1c84b",
      "TypeScript": "#3178c6", "HTML": "#e34c26", "CSS": "#6ea8fe",
      "PHP": "#8892bf", "Java": "#e07b39", "Shell": "#4caf50"
    };
    const FALLBACK = ["#6ea8fe", "#b69dff", "#3fd0c9", "#ff8a5c", "#e0436b", "#f3b05a", "#9b6cf0"];

    let stars = 0;
    const langCount = {};
    repos.forEach(function (r) {
      stars += r.stargazers_count || 0;
      if (r.language) langCount[r.language] = (langCount[r.language] || 0) + 1;
    });

    const langs = Object.keys(langCount).map(function (k) { return { name: k, count: langCount[k] }; })
      .sort(function (a, b) { return b.count - a.count; });
    const total = langs.reduce(function (s, l) { return s + l.count; }, 0) || 1;

    // Animated counters
    animateCount(document.getElementById("ghRepos"), repos.length);
    animateCount(document.getElementById("ghStars"), stars);
    animateCount(document.getElementById("ghLangs"), langs.length);

    // Language bar + legend
    const bar = document.getElementById("ghLangBar");
    const legend = document.getElementById("ghLegend");
    if (bar && legend) {
      bar.innerHTML = ""; legend.innerHTML = "";
      langs.forEach(function (l, i) {
        const color = LANG_COLORS[l.name] || FALLBACK[i % FALLBACK.length];
        const pct = (l.count / total) * 100;

        const seg = document.createElement("span");
        seg.className = "gh-seg";
        seg.style.width = pct + "%";
        seg.style.background = color;
        seg.title = l.name + " · " + Math.round(pct) + "%";
        bar.appendChild(seg);

        const li = document.createElement("li");
        const dot = document.createElement("span");
        dot.className = "gh-dot";
        dot.style.background = color;
        li.appendChild(dot);
        li.appendChild(document.createTextNode(l.name + " " + Math.round(pct) + "%"));
        legend.appendChild(li);
      });
    }
    wrap.hidden = false;
  }

  function animateCount(el, to) {
    if (!el) return;
    if (reduceMotion) { el.textContent = String(to); return; }
    const dur = 1100;
    let startTs = null;
    function step(ts) {
      if (startTs === null) startTs = ts;
      const p = Math.min((ts - startTs) / dur, 1);
      const eased = 1 - Math.pow(1 - p, 3);
      el.textContent = String(Math.round(eased * to));
      if (p < 1) requestAnimationFrame(step);
    }
    requestAnimationFrame(step);
  }

  /* ---- Current year in footer ---- */
  const yearEl = document.getElementById("year");
  if (yearEl) yearEl.textContent = String(new Date().getFullYear());

  /* ---- Mobile nav toggle ---- */
  function closeMenu() {
    menu.classList.remove("open");
    toggle.setAttribute("aria-expanded", "false");
  }
  if (toggle && menu) {
    toggle.addEventListener("click", function () {
      const open = menu.classList.toggle("open");
      toggle.setAttribute("aria-expanded", String(open));
    });
    // Close after tapping a link (mobile)
    menu.addEventListener("click", function (e) {
      if (e.target.closest(".nav-link")) closeMenu();
    });
    // Close on Escape
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape") closeMenu();
    });
  }

  /* ---- Header shadow + scroll-to-top visibility ---- */
  const toTop = document.getElementById("toTop");
  function onScroll() {
    const y = window.scrollY;
    if (header) header.classList.toggle("scrolled", y > 8);
    if (toTop) toTop.classList.toggle("show", y > 500);
  }
  onScroll();
  window.addEventListener("scroll", onScroll, { passive: true });

  /* ---- Scroll reveal ---- */
  const revealEls = document.querySelectorAll(".reveal");
  if (reduceMotion || !("IntersectionObserver" in window)) {
    revealEls.forEach(function (el) { el.classList.add("visible"); });
  } else {
    const revealObserver = new IntersectionObserver(function (entries, obs) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add("visible");
          obs.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: "0px 0px -8% 0px" });
    revealEls.forEach(function (el) { revealObserver.observe(el); });
  }

  /* ---- Active nav link based on section in view ---- */
  const sections = navLinks
    .map(function (link) {
      const id = link.getAttribute("href");
      return id && id.startsWith("#") && id.length > 1 ? document.querySelector(id) : null;
    })
    .filter(Boolean);

  if (sections.length && "IntersectionObserver" in window) {
    const spyObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        const id = "#" + entry.target.id;
        navLinks.forEach(function (link) {
          link.classList.toggle("active", link.getAttribute("href") === id);
        });
      });
    }, { rootMargin: "-45% 0px -50% 0px", threshold: 0 });
    sections.forEach(function (sec) { spyObserver.observe(sec); });
  }

  /* ============================================================
     Fun stuff — ambient effects (fine pointer + motion ok only)
     ============================================================ */
  const finePointer = window.matchMedia("(pointer: fine)").matches;

  /* ---- Click sparkles ---- */
  if (!reduceMotion) {
    const sparkColors = function () {
      const cs = getComputedStyle(document.documentElement);
      return [cs.getPropertyValue("--accent").trim() || "#6ea8fe",
              cs.getPropertyValue("--accent-2").trim() || "#b69dff", "#ffffff"];
    };
    document.addEventListener("click", function (e) {
      const tag = (e.target.tagName || "").toLowerCase();
      if (tag === "input" || tag === "textarea" || e.target.isContentEditable) return;
      const colors = sparkColors();
      for (let i = 0; i < 8; i++) {
        const p = document.createElement("span");
        const ang = Math.random() * Math.PI * 2;
        const dist = 16 + Math.random() * 28;
        const dx = Math.cos(ang) * dist, dy = Math.sin(ang) * dist;
        const sz = 4 + Math.random() * 4;
        p.style.cssText =
          "position:fixed;left:" + e.clientX + "px;top:" + e.clientY + "px;width:" + sz + "px;height:" + sz +
          "px;border-radius:50%;pointer-events:none;z-index:10006;background:" + colors[i % 3] + ";";
        document.body.appendChild(p);
        const anim = p.animate(
          [{ transform: "translate(-50%,-50%) scale(1)", opacity: 1 },
           { transform: "translate(calc(-50% + " + dx + "px),calc(-50% + " + dy + "px)) scale(0)", opacity: 0 }],
          { duration: 480 + Math.random() * 260, easing: "cubic-bezier(.2,.7,.3,1)" }
        );
        anim.onfinish = function () { p.remove(); };
      }
    });
  }

  /* ---- Cursor glow ---- */
  if (finePointer && !reduceMotion) {
    const glow = document.createElement("div");
    glow.className = "cursor-glow";
    document.body.appendChild(glow);
    let gx = 0, gy = 0, cx = 0, cy = 0, raf = null;
    const render = function () {
      cx += (gx - cx) * 0.18;
      cy += (gy - cy) * 0.18;
      glow.style.transform = "translate(" + cx + "px," + cy + "px)";
      if (Math.abs(gx - cx) > 0.5 || Math.abs(gy - cy) > 0.5) {
        raf = requestAnimationFrame(render);
      } else { raf = null; }
    };
    window.addEventListener("mousemove", function (e) {
      gx = e.clientX; gy = e.clientY;
      glow.classList.add("on");
      if (!raf) raf = requestAnimationFrame(render);
    }, { passive: true });
    document.addEventListener("mouseleave", function () { glow.classList.remove("on"); });
  }

  /* ---- 3D tilt on project cards ---- */
  if (finePointer && !reduceMotion) {
    const cards = document.querySelectorAll(".project-grid .card");
    cards.forEach(function (card) {
      card.classList.add("tilt");
      card.addEventListener("mousemove", function (e) {
        const r = card.getBoundingClientRect();
        const px = (e.clientX - r.left) / r.width - 0.5;
        const py = (e.clientY - r.top) / r.height - 0.5;
        const max = 6; // degrees
        card.style.transform =
          "perspective(700px) rotateX(" + (-py * max).toFixed(2) + "deg) rotateY(" +
          (px * max).toFixed(2) + "deg) translateY(-4px)";
      });
      card.addEventListener("mouseleave", function () { card.style.transform = ""; });
    });
  }

  /* ---- Konami code → confetti 🎉 ---- */
  const KONAMI = ["ArrowUp","ArrowUp","ArrowDown","ArrowDown","ArrowLeft","ArrowRight","ArrowLeft","ArrowRight","b","a"];
  let kIdx = 0;
  document.addEventListener("keydown", function (e) {
    const key = e.key.length === 1 ? e.key.toLowerCase() : e.key;
    kIdx = (key === KONAMI[kIdx]) ? kIdx + 1 : (key === KONAMI[0] ? 1 : 0);
    if (kIdx === KONAMI.length) { kIdx = 0; if (PF.unlock) PF.unlock("konami"); confettiBurst(); }
  });

  PF.confetti = confettiBurst;
  function confettiBurst() {
    if (PF.unlock) PF.unlock("confetti");
    if (PF.sound) PF.sound("success");
    const canvas = document.createElement("canvas");
    canvas.style.cssText = "position:fixed;inset:0;pointer-events:none;z-index:10000;";
    document.body.appendChild(canvas);
    const ctx = canvas.getContext("2d");
    let W = canvas.width = window.innerWidth;
    let H = canvas.height = window.innerHeight;
    const colors = ["#6ea8fe","#b69dff","#3fd0c9","#ff8a5c","#e0436b","#f3b05a"];
    const parts = [];
    for (let i = 0; i < 150; i++) {
      parts.push({
        x: W / 2, y: H * 0.4,
        vx: (Math.random() * 2 - 1) * 9,
        vy: Math.random() * -13 - 4,
        g: 0.28 + Math.random() * 0.18,
        size: 6 + Math.random() * 7,
        color: colors[i % colors.length],
        rot: Math.random() * Math.PI,
        vr: (Math.random() * 2 - 1) * 0.25
      });
    }
    let frame = 0;
    (function anim() {
      ctx.clearRect(0, 0, W, H);
      let alive = false;
      parts.forEach(function (p) {
        p.vy += p.g; p.x += p.vx; p.y += p.vy; p.vx *= 0.99; p.rot += p.vr;
        if (p.y < H + 30) alive = true;
        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.rotate(p.rot);
        ctx.fillStyle = p.color;
        ctx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size * 0.6);
        ctx.restore();
      });
      frame++;
      if (alive && frame < 240) requestAnimationFrame(anim);
      else canvas.remove();
    })();
  }
})();
