import test from 'node:test';
import assert from 'node:assert/strict';

import { skillInvocation } from '../src/skillCatalog.js';

test('skill invocation standard is /skill (accepts @ and / prefixes)', () => {
  assert.equal(skillInvocation('brainstorming'), '/brainstorming');
  assert.equal(skillInvocation('/brainstorming'), '/brainstorming');
  assert.equal(skillInvocation('@brainstorming'), '/brainstorming');
});

