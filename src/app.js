import { mountMcqApp } from './mcqApp.js';

function safeMount() {
  const root = document.getElementById('mcqApp');
  if (!root) return;
  mountMcqApp(root).catch(err => {
    root.innerHTML = '';
    const pre = document.createElement('pre');
    pre.style.whiteSpace = 'pre-wrap';
    pre.textContent = `Failed to load MCQ flow.\n\n${err?.message ?? err}`;
    root.appendChild(pre);
  });
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', safeMount);
} else {
  safeMount();
}

