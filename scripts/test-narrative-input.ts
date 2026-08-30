import {
  createNarrativeInputState,
  updateNarrativeInput,
  type NarrativeInputEvent,
  type NarrativeInputState,
} from '../src/ui/narrativeInput';

function assert(condition: boolean, message: string) {
  if (!condition) throw new Error(message);
}

function send(state: NarrativeInputState, event: NarrativeInputEvent) {
  return updateNarrativeInput(state, event);
}

let state = createNarrativeInputState('scene-a:0');
let result = send(state, { type: 'tap', canAdvance: true });
assert(result.command === 'completeText', 'first tap must complete typing');
state = result.state;
result = send(state, { type: 'typingComplete', epoch: 'scene-a:0', canAdvance: true });
assert(result.state.phase === 'ready', 'slow completion must become ready');
result = send(result.state, { type: 'tap', canAdvance: true });
assert(result.command === 'advance', 'second slow tap must advance');

state = createNarrativeInputState('scene-a:1');
state = send(state, { type: 'tap', canAdvance: true }).state;
state = send(state, { type: 'tap', canAdvance: true }).state;
result = send(state, { type: 'typingComplete', epoch: 'scene-a:1', canAdvance: true });
assert(result.command === 'advance', 'rapid second tap must queue one advance');

state = send(result.state, { type: 'reset', epoch: 'scene-a:2' }).state;
assert(state.phase === 'typing', 'narration to dialogue must reset to typing');
result = send(state, { type: 'typingComplete', epoch: 'scene-a:1', canAdvance: true });
assert(result.state.phase === 'typing', 'stale completion must not unlock a new beat');

state = send(state, { type: 'typingComplete', epoch: 'scene-a:2', canAdvance: false }).state;
assert(state.phase === 'ready', 'last beat must become choice-ready');
result = send(state, { type: 'tap', canAdvance: false });
assert(result.command === 'none', 'generic tap must not advance while choices are visible');

state = send(state, { type: 'choiceSelected' }).state;
assert(state.phase === 'transitioning', 'choice must lock input during node change');
state = send(state, { type: 'reset', epoch: 'scene-b:0' }).state;
assert(state.phase === 'typing', 'next node must start with a clean typing state');

const beforeBackground = state;
result = send(state, { type: 'appStateChanged' });
assert(result.state === beforeBackground, 'app state changes must not mutate input state');

state = send(state, { type: 'typingComplete', epoch: 'scene-b:0', canAdvance: true }).state;
state = send(state, { type: 'tap', canAdvance: true }).state;
state = send(state, { type: 'reset', epoch: 'scene-b:1' }).state;
assert(state.phase === 'typing', 'dialogue to narration must reset to typing');

console.log('Narrative input lifecycle regression passed.');
