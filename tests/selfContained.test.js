import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs/promises';

test('nocode-prompt-library.html avoids external dependencies (no external fonts/iframes/remote skill index)', async () => {
  const html = await fs.readFile(new URL('../nocode-prompt-library.html', import.meta.url), 'utf8');
  assert.equal(/fonts\.googleapis\.com/i.test(html), false);
  assert.equal(/fonts\.gstatic\.com/i.test(html), false);
  assert.equal(/<iframe\b/i.test(html), false);
  assert.equal(/raw\.githubusercontent\.com/i.test(html), false);
  assert.equal(/https:\/\/sickn33\.github\.io/i.test(html), false);
});
