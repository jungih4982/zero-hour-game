import { prologueScenes } from '../src/content/prologue';
import { getChoicePresentation } from '../src/gameplay/choicePresentation';

function assert(condition: boolean, message: string) {
  if (!condition) throw new Error(message);
}

const foreknowledgeChoices = Object.values(prologueScenes)
  .flatMap((scene) => scene.choices)
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

console.log('Choice presentation regression passed.');
