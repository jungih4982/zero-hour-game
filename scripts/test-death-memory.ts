import { SCENE_BLACKOUT_0000, prologueScenes } from '../src/content/prologue';
import {
  createDeathMemoryState,
  firstDeathMemoryFragments,
  firstDeathMemorySequence,
  isDeathMemoryComplete,
  selectDeathMemoryFragment,
} from '../src/gameplay/deathMemory';

function assert(condition: boolean, message: string) {
  if (!condition) throw new Error(message);
}

const blackoutSource = prologueScenes[SCENE_BLACKOUT_0000].body;
for (const fragment of firstDeathMemoryFragments) {
  assert(
    blackoutSource.includes(fragment.text),
    `memory fragment must preserve scenario text: ${fragment.id}`,
  );
}

let state = createDeathMemoryState();
state = selectDeathMemoryFragment(state, 'unlocked-door');
assert(state.acceptedIds.length === 0, 'an out-of-order fragment must reset progress');
assert(state.mistakeId === 'unlocked-door', 'the mistaken fragment must be exposed for feedback');

for (const fragmentId of firstDeathMemorySequence) {
  state = selectDeathMemoryFragment(state, fragmentId);
}
assert(isDeathMemoryComplete(state), 'the canonical sequence must complete the memory');

const completedState = selectDeathMemoryFragment(state, 'blackout');
assert(completedState === state, 'a completed memory must remain stable');

console.log('Death-memory reconstruction regression passed.');
