import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs/promises';

test('local Antigravity skills index contains >= 1300 skills', async () => {
  const raw = await fs.readFile(new URL('../data/skills_index.json', import.meta.url), 'utf8');
  const data = JSON.parse(raw);
  assert.ok(Array.isArray(data));
  assert.ok(data.length >= 1300);
});

