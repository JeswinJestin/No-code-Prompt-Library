import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs/promises';

test('nocode-prompt-library.html is self-contained (no external fetch/fonts/iframes)', async () => {
  const html = await fs.readFile(new URL('../nocode-prompt-library.html', import.meta.url), 'utf8');
  assert.equal(/fonts\.googleapis\.com/i.test(html), false);
  assert.equal(/fonts\.gstatic\.com/i.test(html), false);
  assert.equal(/\bfetch\(/i.test(html), false);
  assert.equal(/<iframe\b/i.test(html), false);
});

