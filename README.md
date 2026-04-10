# No-Code Prompt Library

A fast, single-page prompt library for building no-code products with AI. Includes role prompts (PM, UX, Engineer, QA, Security) and phase-by-phase build prompts (ideation → design → build → backend → testing → deploy). Built as a lightweight HTML app with one-click copy.

## GitHub Description (paste into “About”)

No-code AI prompt library for building products end-to-end (roles + phased prompts). Single-page HTML app with one-click copy. Deploy on GitHub Pages.

## Suggested Topics (tags)

Add these under **Repository → About → Topics**:

- no-code
- prompt-library
- ai-prompts
- chatgpt-prompts
- product-management
- ux-design
- ui-design
- qa-testing
- security
- github-pages
- html
- vanilla-javascript
- single-page-app
- static-site

## Project Structure

- `index.html` — Entry point for GitHub Pages (redirects to the app file)
- `nocode-prompt-library.html` — The app (HTML + CSS + JS in one file)

## Features

- Role-based system prompts: PM, UX/UI, No-Code Engineer, QA, Security/Compliance
- Phase tabs: Roles + P1–P6 prompts + an MVP example
- One-click “Copy” per prompt + “Copy all in this tab”
- Rapid Requirements tab: MCQ flow for ideation → design → front-end → back-end → testing → deployment
- Instant agent recommendations powered by the Antigravity Awesome Skills catalog (using a local snapshot with upstream fallback)
- Works as a static site (ideal for GitHub Pages)
- Responsive layout (mobile → desktop)

## Rapid Requirements (MCQ Flow)

- Open the **Rapid** tab
- First, complete the **Ideation → initial description** step (captures the original requirements)
- Then answer short MCQs that clarify scope (single-click; optional free-text remains available where relevant)
- Answer each question with a single click (free-text is clearly marked as optional)
- The app recommends a minimal set of Antigravity skills for the implied technical work and outputs ready-to-paste invocations for common hosts

### Template Files (Deliverable #1)

- `data/mcq.schema.json` — JSON Schema for MCQ templates
- `data/mcq.templates.json` — MCQ templates for each life-cycle stage
- `data/intent-map.json` — Intent → skill mapping configuration

## Run Locally

The clipboard feature works best from a local web server (not `file://`).

### Option A: Python

```bash
python -m http.server 8000
```

Open:

http://localhost:8000/

### Option B: VS Code Live Server

Open `index.html` and use “Live Server”.

## Usage

- Open the site, pick a phase, and click **Copy** (or **Copy all in this tab**).
- Replace placeholders like `[PROJECT_NAME]` and `[PASTE …]` before using prompts in your no-code AI tool (Lovable, Bolt.new, Bubble, Webflow, v0, etc.).

## Agent Selection (Deliverable #2)

The selection engine:

- Loads a local snapshot of the Antigravity skills index (`data/skills_index.json`) and falls back to upstream when needed
- Builds an in-memory token index (id/name/category/description)
- Translates MCQ answers → intents → minimal recommended skills

Core logic:

- [skillCatalog.js](file:///c:/Users/jeswi/OneDrive/Desktop/Projects/No-code%20Prompt%20Library/src/skillCatalog.js)
- [agentSelector.js](file:///c:/Users/jeswi/OneDrive/Desktop/Projects/No-code%20Prompt%20Library/src/agentSelector.js)

### Update the Skills Catalog Snapshot

To refresh `data/skills_index.json` from upstream:

```bash
node -e "import('node:fs/promises').then(async fs=>{const url='https://raw.githubusercontent.com/sickn33/antigravity-awesome-skills/main/skills_index.json';const res=await fetch(url);const text=await res.text();await fs.writeFile('data/skills_index.json',text,'utf8');console.log('updated',text.length);})"
```

## Tests (Deliverable #3)

Requires Node.js 18+.

```bash
npm test
```

The tests validate:

- Catalog loads (>= 1300 skills)
- Indexing covers >= 95% of the catalog
- Search can retrieve >= 95% of skills by exact id
- Selection latency stays under 200ms for 100 selections (warm index)

## Extend Agents Without Code Changes (Deliverable #4)

To modify recommendations:

- Edit `data/intent-map.json`
  - Add a new intent with `preferredSkillIds` and/or `fallbackQueryTokens`
  - Update priorities to control which intents “win” when capped by `maxSkills`
- Update `data/mcq.templates.json`
  - For any answer, add/remove intent ids under `intents`

No JavaScript changes are required for adding new intents or changing which skills are recommended.

## Deploy to GitHub Pages

1. Push this folder to a GitHub repository.
2. In GitHub: **Settings → Pages**
3. Set **Source** to:
   - Branch: `main`
   - Folder: `/ (root)`
4. Save, then open the Pages URL GitHub provides.

## Notes

- Copy buttons use `navigator.clipboard` when available and fall back to a legacy copy method when needed.
- Google Fonts are loaded from `fonts.googleapis.com`.
- Skill invocation syntax is standardized as `/skill` (the UI accepts older `@skill` input in search where applicable).

## Button Reference

- Tabs (Roles/Rapid/Assistant/P1–P6/EX): switch between sections without reload.
- Copy (per prompt): copies the prompt text.
- Copy all in this tab: copies all prompts in the currently active tab.
- Rapid → Continue: unlocks the ideation clarifying MCQs after the required 1-sentence description is filled.
- Rapid → Previous stage / Next stage: moves through the MCQ life-cycle stages while preserving answers per stage.
- Assistant → Build Assistant back button: returns from the embedded assistant to the prompt library (works in iframe via `target=_top`).
- Build Assistant → Copy (per skill): copies `/skill`.
- Build Assistant → + Bundle / ✓ In Bundle: adds/removes a skill from the bundle.
- Build Assistant → Copy Bundle: copies all bundled skills as `/skill /skill …`.

## Troubleshooting

- If copy doesn’t work, make sure you are using `http://` (local server) or `https://` (GitHub Pages), not a `file://` URL.
- If GitHub Pages shows a 404, confirm Pages is set to `main` and `/ (root)` and that `index.html` exists at the repository root.
