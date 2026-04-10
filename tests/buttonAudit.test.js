import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs/promises';

async function readText(relPath) {
  const raw = await fs.readFile(new URL(relPath, import.meta.url), 'utf8');
  return raw;
}

test('Build Assistant back button works in iframe (target=_top)', async () => {
  const html = await readText('../build-assistant.html');
  assert.ok(html.includes('href="nocode-prompt-library.html"'));
  assert.ok(html.includes('target="_top"'));
});

test('Build Assistant uses /skill for display + copy + bundle formatting', async () => {
  const html = await readText('../build-assistant.html');
  assert.ok(html.includes("copyText('/${s.id}',this)"));
  assert.ok(html.includes("const text=[...bundle].map(id=>`/${id}`)"));
  assert.ok(html.includes("<span class=\"tray-chip-name\">/${id}</span>"));
});

test('Prompt Library Rapid invocation UI does not advertise @skill syntax', async () => {
  const html = await readText('../nocode-prompt-library.html');
  assert.equal(/Use @skill/i.test(html), false);
});

