<img width="1800" height="948" alt="Image" src="https://github.com/user-attachments/assets/98d55d5b-d1f9-4081-864f-eba872541e56" />

<div align="center">

<br/>

```
  ┌──────────────────────────────────────────────┐
  │     NO-CODE PROMPT LIBRARY + BUILD ASSISTANT │
  └──────────────────────────────────────────────┘
```

**A fast, phased prompt system for building full-stack products with no-code AI tools.**  
Roles · Phase Prompts · Skills Bundle · Prompt Optimizer · AI Recommender

[![GitHub Pages](https://img.shields.io/badge/Live%20Demo-GitHub%20Pages-1a1916?style=flat-square&logo=github)](https://jeswinjestin.github.io/No-code-Prompt-Library/nocode-prompt-library.html)
[![Skills Catalog](https://img.shields.io/badge/Antigravity%20Skills-1%2C381%2B-059669?style=flat-square)](https://sickn33.github.io/antigravity-awesome-skills/)
[![License: MIT](https://img.shields.io/badge/License-MIT-f0efe9?style=flat-square)](LICENSE)
[![Static Site](https://img.shields.io/badge/Static-Zero%20Backend-9333ea?style=flat-square)]()

<br/>

</div>

---

## What this is

A single-page toolkit that takes you from raw product idea to a shippable, tested, deployed no-code app — without writing code. It combines a structured prompt library (PM → Design → Build → Backend → Testing → Deploy), a live Antigravity skills explorer, a bundle builder, and an AI-powered prompt optimizer — all in static HTML files you can host on GitHub Pages for free.

---

## Three files, one system

| File | Purpose |
|------|---------|
| `nocode-prompt-library.html` | Phased prompt library — 24 copy-paste prompts across 6 build phases |
| `build-assistant.html` | Skills browser + bundle builder + AI prompt optimizer |
| `index.html` | GitHub Pages entry point (redirect) |

---

## Features

**Prompt Library**
- Role prompts for 5 agents: PM, UX/UI Designer, No-Code Engineer, QA, Security
- 6 build phases with 3–4 prompts each and an approval gate between every phase
- One-click copy per prompt
- MVP walkthrough example (TaskFlow task tracker)

**Build Assistant**
- Browse 1,381+ Antigravity skills filtered by build phase and category
- AI recommender — describe your task, get 5 `@skillname` suggestions powered by Claude
- Bundle builder — add skills to a persistent tray, copy the full collection in one shot
- Prompt Optimizer — paste any raw prompt, pick your tool, load your bundle → Claude rewrites it with tool-specific instructions, skill guidance woven in, and an acceptance criteria checklist

**Prompt Optimizer — supported tools**

| Tool | Stack |
|------|-------|
| Lovable | React + Vite + Tailwind |
| Bolt.new | Vite + React + TypeScript |
| v0 | shadcn/ui + Next.js App Router |
| Webflow | No-code CMS |
| Bubble | Visual logic |
| FlutterFlow | Flutter / Dart |

---

## Build phases

```
P1 · Ideation      →  Problem statement · MVP scope · North Star metric
P2 · Design        →  Style brief · Design system · Screen-by-screen specs
P3 · Frontend      →  Tool selection · Per-screen build prompts · Responsive audit
P4 · Backend       →  Data model · Auth & permissions · Automations & APIs
P5 · Testing       →  Test plan · Security audit · Bug fix loop
P6 · Deploy        →  Pre-launch checklist · Landing page · Monitoring setup
```

Each phase has an **approval gate** — a checklist you must pass before the next phase unlocks. This is what keeps a 2-hour build from becoming a 2-week mess.

---

## Workflow

```
1.  Open Prompt Library  →  pick your current phase
2.  Load phase template  →  fill in [PLACEHOLDERS]
3.  Open Build Assistant →  browse skills, add to bundle
4.  Prompt Optimizer     →  paste prompt + pick tool + bundle loaded
5.  Hit Optimize (⌘↵)   →  copy the output
6.  Paste into Lovable / Bolt / Webflow / Bubble
```

---

## Run locally

The clipboard API requires `http://` or `https://` — not `file://`.

**Python (quickest)**
```bash
python -m http.server 8000
# open http://localhost:8000
```

**VS Code**  
Open `index.html` → right-click → `Open with Live Server`

---

## Deploy to GitHub Pages

```
1.  Push repo to GitHub
2.  Settings → Pages
3.  Source: main branch, / (root) folder
4.  Save → open the Pages URL
```

The site is fully static — no build step, no dependencies, no server.

---

## Sync the skills catalog

The Build Assistant loads a curated local skill set and can sync live from the upstream Antigravity repo. Hit **⟳ Sync GitHub** in the header to pull the latest 1,381+ skills into the browser session.

To refresh the local snapshot file:

```bash
node -e "
import('node:fs/promises').then(async fs => {
  const url = 'https://raw.githubusercontent.com/sickn33/antigravity-awesome-skills/main/CATALOG.md';
  const res  = await fetch(url);
  const text = await res.text();
  await fs.writeFile('data/catalog.md', text, 'utf8');
  console.log('Updated —', text.length, 'bytes');
});
"
```

---

## Extend without code changes

**Add a new intent or skill recommendation**
→ Edit `data/intent-map.json` — add an intent with `preferredSkillIds` and/or `fallbackQueryTokens`

**Change which MCQ answers trigger which skills**
→ Edit `data/mcq.templates.json` — update `intents` under any answer option

**Change tool-specific optimizer instructions**
→ Edit the `TOOLS` object in `build-assistant.html` — each tool has its own `instructions` string

No JavaScript changes required for intent or skill mapping updates.

---

## Tests

Requires Node.js 18+.

```bash
npm test
```

Validates:
- Catalog loads ≥ 1,300 skills
- Index covers ≥ 95% of catalog entries
- Exact-id search retrieves ≥ 95% of skills
- Selection latency < 200ms for 100 warm-index queries

---

## Project structure

```
/
├── index.html                      # GitHub Pages entry point
├── nocode-prompt-library.html      # Phased prompt library (24 prompts, 6 phases)
├── build-assistant.html            # Skills browser + bundle + optimizer
├── data/
│   ├── mcq.schema.json             # JSON Schema for MCQ templates
│   ├── mcq.templates.json          # MCQ templates per lifecycle stage
│   ├── intent-map.json             # Intent → skill mapping
│   └── skills_index.json           # Local Antigravity catalog snapshot
└── src/
    ├── skillCatalog.js             # Catalog loader + token indexer
    └── agentSelector.js            # MCQ → intent → skill selection engine
```

---

## Repository topics

```
no-code  prompt-library  ai-prompts  product-management  ux-design
ui-design  qa-testing  security  github-pages  html  vanilla-javascript
single-page-app  static-site  antigravity  lovable  bubble  webflow
```

---

## Notes

- Copy buttons use `navigator.clipboard` with a legacy fallback for older browsers
- Google Fonts load from `fonts.googleapis.com` — the app still works offline but will use system fonts
- The AI Recommender and Prompt Optimizer require a live Anthropic API connection (handled client-side via the Claude.ai artifact API; no key needed when running inside Claude)
- If GitHub Pages shows a 404, confirm Pages is set to `main` branch and `/ (root)` and that `index.html` exists at the repo root

---

<div align="center">

Built by [Jeswin Thomas Jestin](https://github.com/JeswinJestin) · Skills catalog by [sickn33/antigravity-awesome-skills](https://github.com/sickn33/antigravity-awesome-skills)

</div>
