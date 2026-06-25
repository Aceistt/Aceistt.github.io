# Aceistt.github.io

My personal portfolio — a single-page software developer site built with plain
HTML, CSS, and JavaScript (no framework, no build step). Hosted on GitHub Pages
at **https://aceistt.github.io**.

## Structure

```
index.html        # hero, about, experience, projects, testimonial, skills & contact
hisuri.html       # Hisuri project case-study page
404.html          # branded not-found page (served automatically by GitHub Pages)
css/styles.css    # dark/light theme (CSS custom properties)
js/main.js        # nav, theme toggle, typing hero, scroll-reveal, live GitHub repos
js/i18n.js        # EN/NL translations + language toggle
assets/           # favicon, og-image, your images / headshot / cv
robots.txt        # search-engine directives
sitemap.xml       # sitemap for crawlers
.nojekyll         # serve files as-is (skip Jekyll processing)
```

## Editing

Everything to personalize is marked with `<!-- TODO: ... -->`:

- **Bio & facts** — `#about` in `index.html` (drop a square photo at
  `assets/profile.jpg`)
- **Projects** — the `.card` blocks in `#projects`
- **Hisuri case study** — copy and screenshots in `hisuri.html`
  (`assets/hisuri-web.png`, `assets/hisuri-app-1.png`, `assets/hisuri-app-2.png`)
- **CV** — save your CV as `assets/cv.pdf` (the hero download button points to it)

### Translations (EN / NL)

All visible strings live in `js/i18n.js` as an `en` / `nl` dictionary, keyed by
the `data-i18n="..."` attributes in the HTML. To change wording, edit both
languages for that key. The language toggle is the `EN`/`NL` button in the nav.

### Optional setup

- **Guestbook** — uses giscus (GitHub Discussions). Enable Discussions on the repo,
  install <https://github.com/apps/giscus>, then paste the repo/category IDs from
  <https://giscus.app> into `CONFIG` at the top of `js/guestbook.js`. Until then a
  friendly note shows instead.
- **Analytics** — create a free site at <https://www.goatcounter.com> and replace
  `YOURCODE` in the GoatCounter `<script>` at the bottom of `index.html`.

### Built-in extras (no setup)

- **Command palette** (⌘K), **terminal** (Ctrl+`), **Snake** (`snake`),
  **retro/matrix** modes, **accent colour picker**, **achievements**, **chatbot**,
  **UI sounds** (toggle in nav), and **Konami code** confetti.

Theme colors live in the `:root` block at the top of `css/styles.css`
(`--accent`, `--bg`, etc.); the light palette is under `:root[data-theme="light"]`.

## Develop locally

No tooling needed — just open `index.html` in a browser. Or serve it:

```bash
python -m http.server 8000   # then visit http://localhost:8000
```

## Deploy

Push to the default branch. GitHub Pages serves `<username>.github.io` repos
automatically; changes go live within a minute.
