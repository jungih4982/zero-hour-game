import { prologueScenes } from '../src/content/prologue';
import {
  getChoiceGroupPresentation,
  getChoicePresentation,
} from '../src/gameplay/choicePresentation';

function assert(condition: boolean, message: string) {
  if (!condition) throw new Error(message);
}

const allChoices = Object.values(prologueScenes).flatMap((scene) => scene.choices);
const foreknowledgeChoices = allChoices
  .filter((choice) => choice.kind === 'foreknowledge');

assert(foreknowledgeChoices.length > 0, 'the slice must contain Foreknowledge choices');

for (const choice of foreknowledgeChoices) {
  const presentation = getChoicePresentation(choice);
  assert(
    presentation.meta !== '남아 있는 기억 사용',
    `Foreknowledge choice must communicate a concrete payoff: ${choice.id}`,
  );
  assert(
    presentation.outcome !== undefined,
    `Foreknowledge choice must provide result feedback: ${choice.id}`,
  );
}

const evidenceChoices = allChoices
  .filter((choice) => choice.kind === 'evidence');

assert(evidenceChoices.length > 0, 'the chapter must contain evidence presentation choices');

for (const choice of evidenceChoices) {
  const presentation = getChoicePresentation(choice);
  assert(
    presentation.meta !== '확보한 증거 제시',
    `Evidence choice must communicate a concrete payoff: ${choice.id}`,
  );
  assert(
    presentation.outcome?.tone === 'evidence',
    `Evidence choice must provide evidence result feedback: ${choice.id}`,
  );
}

const interventionChoiceIds = [
  'RECOGNIZE_RESET',
  'DO_NOT_EXPLAIN_LOOP_YET',
  'REVEAL_EXACT_FOREKNOWLEDGE',
  'WAIT_FOR_KNOWN_BLACKOUT',
] as const;

for (const choiceId of interventionChoiceIds) {
  const choice = foreknowledgeChoices.find((entry) => entry.id === choiceId);
  assert(choice !== undefined, `intervention choice must exist: ${choiceId}`);
  const intervention = getChoicePresentation(choice!).intervention;
  assert(intervention !== undefined, `major Foreknowledge action must show the changed timeline: ${choiceId}`);
  assert(Boolean(intervention?.known && intervention.changed && intervention.consequence), `timeline feedback must be concrete: ${choiceId}`);
}

const standardChoices = allChoices.filter((choice) => choice.kind === 'standard');
assert(standardChoices.length >= 2, 'standard choices are required to test decision hierarchy');

const continuationGroup = getChoiceGroupPresentation([standardChoices[0]]);
assert(continuationGroup.eyebrow === '다음 행동', 'a forced continuation must not masquerade as a decision');
assert(!continuationGroup.hint.includes('되돌릴 수 없다'), 'a forced continuation must not warn about irreversible choice');

const decisionGroup = getChoiceGroupPresentation(standardChoices.slice(0, 2));
assert(decisionGroup.eyebrow === '판단', 'multiple actions must retain the decision treatment');

const memoryGroup = getChoiceGroupPresentation([foreknowledgeChoices[0]]);
assert(memoryGroup.eyebrow === '기억 개입', 'a single Foreknowledge action must use the signature mechanic label');

const investigationGroup = getChoiceGroupPresentation([], '1/3 확인');
assert(investigationGroup.eyebrow === '현장 조사', 'investigation hierarchy must remain distinct');
assert(investigationGroup.hint === '1/3 확인', 'investigation progress must remain visible');

console.log('Choice presentation regression passed.');
