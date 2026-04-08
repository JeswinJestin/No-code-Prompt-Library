# No-Code Prompt Library

A single-page, offline-friendly HTML prompt library for no-code product builds (roles + phased prompts). Designed for quick copy/paste workflows.

## Project Structure

- `index.html` — Entry point for GitHub Pages (redirects to the app file)
- `nocode-prompt-library.html` — The app (HTML + CSS + JS in one file)

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
