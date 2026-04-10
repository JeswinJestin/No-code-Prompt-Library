<div align="center">

# No-Code Prompt Library

**Offline-first, production-ready prompt system for building no-code MVPs with AI.**  
Stages + Rapid MCQs + Skill bundles + Optimizer + Export/Share — all in a single HTML app.

[![Live Demo](https://img.shields.io/badge/Live%20Demo-GitHub%20Pages-black?style=for-the-badge&logo=github)](https://jeswinjestin.github.io/No-code-Prompt-Library/)
[![Single File](https://img.shields.io/badge/Single%20File-HTML%20App-111111?style=for-the-badge&logo=html5)](./nocode-prompt-library.html)
[![Offline First](https://img.shields.io/badge/Offline-First-111111?style=for-the-badge&logo=googlechrome)](#offline-first)
[![Tests](https://img.shields.io/badge/Tests-Node%2018%2B-111111?style=for-the-badge&logo=nodedotjs)](#tests)

</div>

---

Build stable, repeatable no-code MVPs by using **structured prompts**, **validation rules**, and **minimal `/skill` bundles** optimized for Trae, Cursor, and Google Antigravity-style workflows.

## ✨ Features

- **🧭 Systematic stages** — Ideation → Prototyping → MVP Building → Deployment (+ Roles + examples)
- **⚡ Rapid Requirements** — <3-second MCQs that reduce scope drift and ambiguity
- **🧩 Assistant toolkit (inside the app)**  
  - Stage templates with parameters + preview  
  - Skills catalog (offline upload) + bundles  
  - Prompt optimizer for Trae/Cursor/Antigravity  
  - Export pack (JSON/Markdown) + import
- **📋 Copy-first UX** — copy per prompt, copy bundles, copy export items
- **🛡️ Error prevention** — built-in validation blocks, checklists, acceptance criteria scaffolds
- **📦 Offline-first** — no external dependencies required to run the main app

## 🚀 Live Demo

- https://jeswinjestin.github.io/No-code-Prompt-Library/

## 🧱 App Entry Points

- `index.html` — GitHub Pages entry point
- `nocode-prompt-library.html` — Main app (self-contained, offline-first)

## 🧠 Skill Invocation Syntax

- Standard: `/skill`
- Backward compatibility: search inputs accept `@skill` and normalize to `/skill`.

## 🏁 Quick Start (Fast Path)

1. Open **Rapid**
2. Enter the 1-sentence idea → answer MCQs → copy the recommended prompt + `/skills`
3. Open **Assistant**
   - Choose a template → fill parameters → copy or **Add to Export Pack**
   - Upload `skills_index.json` (optional) to browse 1300+ skills offline
   - Build a **bundle** → generate an optimized prompt for your tool
   - Export as **JSON/Markdown** to share or reuse later

## 📦 Offline-First

- The main app is designed to work without network access.
- To browse the full skills catalog offline, upload a local `skills_index.json` from Antigravity Awesome Skills (optional).

## 🛠️ Local Setup

Clipboard works best from `http://` (not `file://`).

```bash
python -m http.server 8000
```

Open: http://localhost:8000/

## 📤 Export / Share

Exports include:

- Current **bundle**
- Saved **prompt pack** (templates + optimized prompts)

Formats:

- JSON (re-importable)
- Markdown (easy to share)

## ✅ Tests

Requires Node.js 18+.

```bash
npm test
```

## 🌍 Deploy (GitHub Pages)

GitHub → **Settings → Pages**

- Source: Deploy from a branch
- Branch: `main`
- Folder: `/ (root)`

## 🧷 Suggested GitHub Topics

`no-code` `prompt-library` `ai-prompts` `github-pages` `html` `vanilla-javascript` `static-site` `product-management` `ux-design` `qa-testing` `security`
