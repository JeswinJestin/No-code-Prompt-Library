const DEFAULT_SKILLS_INDEX_URL =
  'https://raw.githubusercontent.com/sickn33/antigravity-awesome-skills/main/skills_index.json';

export async function loadSkillCatalog({ url = DEFAULT_SKILLS_INDEX_URL } = {}) {
  const res = await fetch(url, { cache: 'force-cache' });
  if (!res.ok) {
    throw new Error(`Failed to load skills catalog: ${res.status}`);
  }
  const skills = await res.json();
  if (!Array.isArray(skills)) {
    throw new Error('Skills catalog is not an array');
  }
  return skills;
}

function tokenize(text) {
  if (!text) return [];
  return String(text)
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, ' ')
    .trim()
    .split(/\s+/)
    .filter(Boolean);
}

export function buildSkillIndex(skills) {
  const idToSkill = new Map();
  const tokenToIds = new Map();

  for (const skill of skills) {
    if (!skill || typeof skill !== 'object') continue;
    if (!skill.id || typeof skill.id !== 'string') continue;

    idToSkill.set(skill.id, skill);

    const tokens = new Set([
      ...tokenize(skill.id),
      ...tokenize(skill.name),
      ...tokenize(skill.category),
      ...tokenize(skill.description),
      ...tokenize(skill.path)
    ]);

    for (const token of tokens) {
      const existing = tokenToIds.get(token);
      if (existing) existing.push(skill.id);
      else tokenToIds.set(token, [skill.id]);
    }
  }

  return { idToSkill, tokenToIds, total: skills.length };
}

export function searchSkills(index, queryTokens, { riskAllowlist } = {}) {
  const tokens = Array.isArray(queryTokens) ? queryTokens : tokenize(queryTokens);
  const scores = new Map();

  for (const token of tokens) {
    const normalized = String(token).toLowerCase();
    if (index.idToSkill.has(normalized)) {
      scores.set(normalized, (scores.get(normalized) ?? 0) + 1000);
    }

    const ids = index.tokenToIds.get(normalized);
    if (!ids) continue;
    for (const id of ids) {
      scores.set(id, (scores.get(id) ?? 0) + 1);
    }
  }

  const ranked = Array.from(scores.entries())
    .map(([id, score]) => ({ id, score, skill: index.idToSkill.get(id) }))
    .filter(x => x.skill)
    .filter(x => {
      if (!riskAllowlist || riskAllowlist.length === 0) return true;
      return riskAllowlist.includes(x.skill.risk);
    })
    .sort((a, b) => b.score - a.score || a.id.localeCompare(b.id));

  return ranked;
}

export function skillInvocation(id, { host = 'antigravity' } = {}) {
  const normalized = String(id ?? '').trim().replace(/^[@/]+/, '');
  if (!normalized) return '';
  return `/${normalized}`;
}
