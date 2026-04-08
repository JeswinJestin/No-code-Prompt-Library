import test from 'node:test';
import assert from 'node:assert/strict';
import { performance } from 'node:perf_hooks';

import { loadSkillCatalog, buildSkillIndex, searchSkills } from '../src/skillCatalog.js';
import { selectAgents } from '../src/agentSelector.js';

async function loadJson(path) {
  const url = new URL(path, import.meta.url);
  const fs = await import('node:fs/promises');
  const raw = await fs.readFile(url, 'utf8');
  return JSON.parse(raw);
}

test('loads Antigravity skills catalog (>= 1300)', async () => {
  const skills = await loadSkillCatalog();
  assert.ok(Array.isArray(skills));
  assert.ok(skills.length >= 1300);
});

test('builds an index with >= 95% skill coverage', async () => {
  const skills = await loadSkillCatalog();
  const index = buildSkillIndex(skills);
  const coverage = index.idToSkill.size / index.total;
  assert.ok(coverage >= 0.95);
});

test('search can retrieve a skill by exact id for >= 95% of the catalog', async () => {
  const skills = await loadSkillCatalog();
  const index = buildSkillIndex(skills);

  let ok = 0;
  for (const s of skills) {
    const results = searchSkills(index, [s.id], { riskAllowlist: null });
    if (results.length && results[0].id === s.id) ok += 1;
  }

  const coverage = ok / skills.length;
  assert.ok(coverage >= 0.95);
});

test('MCQ templates produce valid skill recommendations for each stage', async () => {
  const skills = await loadSkillCatalog();
  const index = buildSkillIndex(skills);
  const templates = await loadJson('../data/mcq.templates.json');
  const intentMap = await loadJson('../data/intent-map.json');

  for (const stage of templates.stages) {
    const selectedIntentIds = new Set();
    for (const q of stage.questions) {
      if (q.type !== 'mcq') continue;
      const a = q.answers[0];
      for (const intentId of a.intents) selectedIntentIds.add(intentId);
    }

    const selection = selectAgents({
      stageId: stage.id,
      selectedIntentIds: Array.from(selectedIntentIds),
      skillIndex: index,
      intentMap
    });

    assert.ok(selection.skillIds.length > 0);
    for (const id of selection.skillIds) {
      assert.ok(index.idToSkill.has(id));
    }
  }
});

test('agent selection stays under 200ms (warm index, 100 selections)', async () => {
  const skills = await loadSkillCatalog();
  const index = buildSkillIndex(skills);
  const intentMap = await loadJson('../data/intent-map.json');

  const allIntentIds = intentMap.intents.map(i => i.id);
  const stageIds = ['ideation', 'design', 'frontend', 'backend', 'testing', 'deployment'];

  for (let i = 0; i < 10; i++) {
    selectAgents({
      stageId: stageIds[i % stageIds.length],
      selectedIntentIds: allIntentIds.slice(0, 6),
      skillIndex: index,
      intentMap
    });
  }

  const start = performance.now();
  for (let i = 0; i < 100; i++) {
    const stageId = stageIds[i % stageIds.length];
    const selectedIntentIds = allIntentIds.slice(i % 5, (i % 5) + 7);
    selectAgents({ stageId, selectedIntentIds, skillIndex: index, intentMap });
  }
  const elapsed = performance.now() - start;
  assert.ok(elapsed < 200);
});
