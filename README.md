# No-Code Prompt Library

Production-ready, offline-first prompt library for building no-code MVPs with AI. A single self-contained HTML app with stage-based templates, a rapid MCQ requirements flow, skills/bundles, and export/share.

Live: https://jeswinjestin.github.io/No-code-Prompt-Library/

## What You Get

- **Stages:** Ideation → Prototyping → MVP Build → Deployment (plus Roles and examples)
- **Rapid Requirements:** <3-second MCQs per step to clarify scope and reduce ambiguity
- **Assistant Tools:** Structured templates, skills catalog (offline upload), bundles, optimizer, export pack
- **Copy-first UX:** Copy per prompt + copy bundles using standardized `/skill` syntax
- **Offline-first:** No external dependencies required to run the app

## App Entry Points

- `index.html` — GitHub Pages entry point
- `nocode-prompt-library.html` — Main app (self-contained)

## Run Locally

Clipboard works best from `http://` (not `file://`).

```bash
python -m http.server 8000
```

Open http://localhost:8000/

## How To Use (Fast Path)

- Open **Rapid** → enter the 1-sentence idea → answer MCQs → copy the recommended prompt + `/skills`.
- Open **Assistant**:
  - Pick a **template**, fill parameters, and copy/add to export pack.
  - Upload `skills_index.json` (optional) to browse 1300+ skills offline.
  - Build a **bundle**, then generate an optimized prompt for Trae/Cursor/Antigravity.
  - Export as **JSON/Markdown** to share or reuse later.

## Skill Invocation Syntax

- Standard: `/skill`
- Backward-compatible input: the UI accepts `@skill` in search fields and normalizes it to `/skill`.

## Export / Share

The app can export:

- Current **bundle**
- Saved **prompt pack** (templates + optimized prompts)

Formats:

- JSON (re-importable)
- Markdown (easy to share)

## Tests

Requires Node.js 18+.

```bash
npm test
```

## Deploy (GitHub Pages)

GitHub → **Settings → Pages**

- Source: Deploy from a branch
- Branch: `main`
- Folder: `/ (root)`

## Suggested GitHub Topics

no-code, prompt-library, ai-prompts, github-pages, html, vanilla-javascript, static-site, product-management, ux-design, qa-testing, security
