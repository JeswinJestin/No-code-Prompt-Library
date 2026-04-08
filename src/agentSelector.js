import { searchSkills } from './skillCatalog.js';

function unique(items) {
  const out = [];
  const seen = new Set();
  for (const item of items) {
    if (!item) continue;
    if (seen.has(item)) continue;
    seen.add(item);
    out.push(item);
  }
  return out;
}

function byPriorityDesc(a, b) {
  return (b.priority ?? 0) - (a.priority ?? 0) || String(a.id).localeCompare(String(b.id));
}

export function selectAgents({
  stageId,
  selectedIntentIds,
  skillIndex,
  intentMap,
  overrides,
  contextTokens
}) {
  const defaults = intentMap?.defaults ?? {};
  const riskAllowlist = overrides?.riskAllowlist ?? defaults.riskAllowlist ?? ['safe', 'none'];
  const maxSkills = overrides?.maxSkills ?? defaults.maxSkills ?? 8;
  const perIntentMaxSkills = overrides?.perIntentMaxSkills ?? defaults.perIntentMaxSkills ?? 2;
  // Small context token list keeps selection fast while still reflecting the original ideation description.
  const extraTokens = Array.isArray(contextTokens) ? contextTokens.slice(0, 12) : [];

  const intents = (intentMap?.intents ?? [])
    .filter(i => selectedIntentIds.includes(i.id))
    .sort(byPriorityDesc);

  const selected = [];
  const reasons = [];

  for (const intent of intents) {
    const pickedForIntent = [];

    for (const id of intent.preferredSkillIds ?? []) {
      if (skillIndex.idToSkill.has(id)) pickedForIntent.push(id);
    }

    if (pickedForIntent.length < perIntentMaxSkills) {
      const need = perIntentMaxSkills - pickedForIntent.length;
      const ranked = searchSkills(
        skillIndex,
        [...(intent.fallbackQueryTokens ?? []), ...extraTokens],
        { riskAllowlist }
      );
      for (const r of ranked) {
        if (pickedForIntent.length >= perIntentMaxSkills) break;
        if (!pickedForIntent.includes(r.id)) pickedForIntent.push(r.id);
      }
    }

    const finalForIntent = pickedForIntent.slice(0, perIntentMaxSkills);
    for (const id of finalForIntent) {
      selected.push(id);
      reasons.push({
        stageId,
        intentId: intent.id,
        skillId: id
      });
    }

    if (selected.length >= maxSkills) break;
  }

  const uniqueSelected = unique(selected).slice(0, maxSkills);
  return {
    stageId,
    skills: uniqueSelected.map(id => skillIndex.idToSkill.get(id)),
    skillIds: uniqueSelected,
    reasons
  };
}
