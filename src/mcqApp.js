import { loadSkillCatalog, buildSkillIndex, skillInvocation } from './skillCatalog.js';
import { selectAgents } from './agentSelector.js';

function el(tag, attrs = {}, children = []) {
  const node = document.createElement(tag);
  for (const [k, v] of Object.entries(attrs)) {
    if (k === 'class') node.className = v;
    else if (k === 'text') node.textContent = v;
    else if (k.startsWith('on') && typeof v === 'function') node.addEventListener(k.slice(2), v);
    else if (v === false || v === null || v === undefined) continue;
    else node.setAttribute(k, String(v));
  }
  for (const child of children) node.appendChild(child);
  return node;
}

async function loadJson(path) {
  const res = await fetch(path, { cache: 'no-cache' });
  if (!res.ok) throw new Error(`Failed to load ${path}: ${res.status}`);
  return res.json();
}

function collectIntentsFromAnswers(stage, answersByQuestionId) {
  const intents = [];
  for (const q of stage.questions) {
    if (q.type !== 'mcq') continue;
    const answerId = answersByQuestionId[q.id];
    if (!answerId) continue;
    const a = q.answers.find(x => x.id === answerId);
    if (!a) continue;
    for (const intent of a.intents) intents.push(intent);
  }
  return Array.from(new Set(intents));
}

function tokenize(text) {
  return String(text ?? '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, ' ')
    .trim()
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 12);
}

function formatSkillList(skills) {
  return skills
    .map(s => `- ${s.id}${s.description ? ` — ${String(s.description).slice(0, 120)}` : ''}`)
    .join('\n');
}

function buildInvocationBlock(skillIds) {
  const hosts = [
    { id: 'antigravity', label: 'Antigravity', hint: 'Use @skill in Antigravity' },
    { id: 'cursor', label: 'Cursor', hint: 'Use @skill in Cursor chat' },
    { id: 'claude-code', label: 'Claude Code', hint: 'Use >> /skill in Claude Code' },
    { id: 'codex', label: 'Codex', hint: 'Use @skill in Codex' },
    { id: 'gemini', label: 'Gemini CLI', hint: 'Use the skill name as instruction' }
  ];

  const container = el('div', { class: 'mcq-invocations' });
  for (const host of hosts) {
    const lines = skillIds.map(id => skillInvocation(id, { host: host.id })).join('\n');
    container.appendChild(
      el('div', { class: 'mcq-invocation' }, [
        el('div', { class: 'mcq-invocation-title', text: host.label }),
        el('div', { class: 'mcq-invocation-hint', text: host.hint }),
        el('pre', { class: 'mcq-pre', text: lines })
      ])
    );
  }
  return container;
}

export async function mountMcqApp(rootEl) {
  const [templates, intentMap] = await Promise.all([
    loadJson('./data/mcq.templates.json'),
    loadJson('./data/intent-map.json')
  ]);

  const header = el('div', { class: 'mcq-header' }, [
    el('div', { class: 'phase-tag', text: 'Rapid Requirements — MCQ Flow' }),
    el('div', { class: 'phase-title', text: 'Answer in <3 seconds per step' }),
    el('div', {
      class: 'phase-desc',
      text:
        'Fast multiple-choice questions for ideation, design, front-end, back-end, testing, and deployment. Free-text remains optional.'
    })
  ]);

  const loading = el('div', { class: 'mcq-loading', text: 'Loading skills catalog…' });
  rootEl.appendChild(header);
  rootEl.appendChild(loading);

  let skills;
  try {
    skills = await loadSkillCatalog({ url: './data/skills_index.json' });
  } catch (e) {
    skills = await loadSkillCatalog();
  }
  const skillIndex = buildSkillIndex(skills);

  loading.textContent = `Loaded ${skillIndex.total} Antigravity skills.`;

  const stageSelect = el('select', { class: 'mcq-select' });
  for (const stage of templates.stages) {
    stageSelect.appendChild(el('option', { value: stage.id, text: `${stage.title}` }));
  }

  const state = {
    stageId: templates.stages[0].id,
    answersByQuestionId: {},
    freeTextByQuestionId: {},
    textByQuestionId: {},
    completedTextByQuestionId: {}
  };

  const questionsWrap = el('div', { class: 'mcq-questions' });
  const outputWrap = el('div', { class: 'mcq-output' });

  function render() {
    const stage = templates.stages.find(s => s.id === state.stageId);
    if (!stage) return;

    questionsWrap.replaceChildren();

    questionsWrap.appendChild(
      el('div', { class: 'info-block' }, [
        el('h3', { text: stage.title }),
        el('div', { class: 'meta-value', text: stage.description ?? '' })
      ])
    );

    // Ideation requirement capture: a gated text step that must be completed before showing clarifying MCQs.
    const gateText = stage.questions.find(q => q.type === 'text' && q.gatesFollowing);
    const gateTextValue = gateText ? (state.textByQuestionId[gateText.id] ?? '') : '';
    const gateSatisfied = !gateText
      ? true
      : !!state.completedTextByQuestionId[gateText.id] &&
        (!gateText.text?.required || gateTextValue.trim().length > 0);

    for (const q of stage.questions) {
      if (!gateSatisfied && gateText && q.id !== gateText.id) continue;

      const answerId = state.answersByQuestionId[q.id] ?? '';
      const card = el('div', { class: 'mcq-card' });
      card.appendChild(el('div', { class: 'mcq-q', text: q.prompt }));
      if (q.help) card.appendChild(el('div', { class: 'mcq-help', text: q.help }));

      if (q.type === 'text') {
        const value = state.textByQuestionId[q.id] ?? '';
        const input = el('input', {
          class: 'mcq-free',
          type: 'text',
          value,
          maxlength: q.text?.maxLength ?? 160,
          placeholder: q.text?.placeholder ?? '',
          oninput: e => {
            state.textByQuestionId[q.id] = e.target.value;
            renderOutput();
          }
        });

        card.appendChild(el('div', { class: 'mcq-free-label', text: q.text?.label ?? 'Required' }));
        card.appendChild(input);

        if (q.gatesFollowing) {
          const canContinue = !q.text?.required || String(value).trim().length > 0;
          card.appendChild(
            el(
              'button',
              {
                type: 'button',
                class: `copy-all-btn${canContinue ? '' : ''}`,
                style: canContinue ? '' : 'opacity:0.45;cursor:not-allowed;',
                onclick: () => {
                  if (!canContinue) return;
                  state.completedTextByQuestionId[q.id] = true;
                  renderOutput();
                  render();
                }
              },
              [el('span', { text: 'Continue' })]
            )
          );
        }
      } else {
        const optionsRow = el('div', { class: 'mcq-options' });
        for (const a of q.answers) {
          const isActive = a.id === answerId;
          optionsRow.appendChild(
            el(
              'button',
              {
                type: 'button',
                class: `mcq-option${isActive ? ' active' : ''}`,
                onclick: () => {
                  state.answersByQuestionId[q.id] = a.id;
                  renderOutput();
                  render();
                }
              },
              [el('span', { text: a.label })]
            )
          );
        }
        card.appendChild(optionsRow);

        if (q.optionalFreeText?.enabled) {
          const input = el('input', {
            class: 'mcq-free',
            type: 'text',
            value: state.freeTextByQuestionId[q.id] ?? '',
            placeholder: q.optionalFreeText.placeholder ?? '',
            oninput: e => {
              state.freeTextByQuestionId[q.id] = e.target.value;
              renderOutput();
            }
          });
          card.appendChild(el('div', { class: 'mcq-free-label', text: q.optionalFreeText.label }));
          card.appendChild(input);
        }
      }

      questionsWrap.appendChild(card);
    }

    renderOutput();
  }

  function renderOutput() {
    const stage = templates.stages.find(s => s.id === state.stageId);
    if (!stage) return;

    // Once the ideation description exists, always include core planning/brief intents so downstream steps reflect it.
    const baseIdeationIntents =
      stage.id === 'ideation' && (state.textByQuestionId.initial_description ?? '').trim().length > 0
        ? ['plan', 'product-brief']
        : [];

    const intentIds = Array.from(
      new Set([...baseIdeationIntents, ...collectIntentsFromAnswers(stage, state.answersByQuestionId)])
    );

    // Extra tokens help bias selection toward skills relevant to the original ideation description (kept small for speed).
    const contextTokens = tokenize(state.textByQuestionId.initial_description ?? '');
    const selection = selectAgents({
      stageId: stage.id,
      selectedIntentIds: intentIds,
      skillIndex,
      intentMap,
      contextTokens
    });

    const freeText = Object.entries(state.freeTextByQuestionId)
      .map(([k, v]) => (v ? `${k}: ${v}` : null))
      .filter(Boolean)
      .join(' | ');

    outputWrap.replaceChildren();
    outputWrap.appendChild(
      el('div', { class: 'info-block' }, [
        el('h3', { text: 'Recommended Minimal Agent Set' }),
        el('div', {
          class: 'meta-value',
          text: selection.skillIds.length
            ? 'Use these skills first (minimal set for the selected answers).'
            : 'Select answers to get agent recommendations.'
        })
      ])
    );

    if (selection.skillIds.length) {
      outputWrap.appendChild(el('pre', { class: 'mcq-pre', text: formatSkillList(selection.skills) }));
      outputWrap.appendChild(buildInvocationBlock(selection.skillIds));
    }

    outputWrap.appendChild(
      el('div', { class: 'info-block' }, [
        el('h3', { text: 'No-code Tool Handoff (Anti-Gravity Optimised)' }),
        el('div', {
          class: 'meta-value',
          text:
            'Paste the invocations into your tool chat, then paste the generated deliverables (brief/spec/checklist) back into your builder (Lovable, Bolt, Bubble, Webflow, etc.).'
        }),
        el('pre', {
          class: 'mcq-pre',
          text: JSON.stringify(
            {
              stage: stage.id,
              initialDescription: (state.textByQuestionId.initial_description ?? '').trim() || null,
              answers: state.answersByQuestionId,
              optionalNotes: freeText || null,
              intentIds,
              recommendedSkillIds: selection.skillIds
            },
            null,
            2
          )
        })
      ])
    );
  }

  const controls = el('div', { class: 'mcq-controls' }, [
    el('div', { class: 'meta-label', text: 'Stage' }),
    stageSelect
  ]);

  stageSelect.addEventListener('change', e => {
    state.stageId = e.target.value;
    state.answersByQuestionId = {};
    state.freeTextByQuestionId = {};
    state.textByQuestionId = {};
    state.completedTextByQuestionId = {};
    render();
  });

  rootEl.appendChild(controls);
  rootEl.appendChild(el('hr', { class: 'section-divider' }));
  rootEl.appendChild(questionsWrap);
  rootEl.appendChild(el('hr', { class: 'section-divider' }));
  rootEl.appendChild(outputWrap);

  render();
}
