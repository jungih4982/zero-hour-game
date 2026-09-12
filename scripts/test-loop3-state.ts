import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { applyEffects, getAvailableChoices, resetLoop } from '../src/engine';
import type { GameTime, NarrativeEngineState, SceneId } from '../src/engine';
import { storyScenes } from '../src/content/story';
import { MEMORY_0106_SEAL, seal0106Memory } from '../src/content/chapter3';
import { migrateSavedNarrativeState, SAVE_VERSION } from '../src/store/narrativeSave';
import { describeBandState, transferRoomDetail } from '../src/gameplay/fieldKnowledge';

const original = JSON.parse(readFileSync('docs/qa/production/2026-09-12-f01-dual-art/EVIDENCE/fresh-loop3-memory-choice.json', 'utf8'));
const before: NarrativeEngineState = original['zero-hour-narrative-save'].state.engineState;
const originalBytes = JSON.stringify(before);
const migrated = migrateSavedNarrativeState({ engineState: before }, 5)!;
assert.equal(SAVE_VERSION, 6);
assert.equal(JSON.stringify(before), originalBytes, 'never mutate the input save');
assert.deepEqual(migrated.volatile, before.volatile, 'v5 time/clock/items/route must survive exactly');
assert.deepEqual(migrated.persistent.flags, before.persistent.flags, 'trust and custody history survive');
for (const key of ['clueIds', 'deductionIds', 'deathIntel', 'deathRecords'] as const)
  assert.deepEqual(migrated.persistent[key], before.persistent[key]);
assert.deepEqual(migrateSavedNarrativeState({engineState:migrated},6),migrated);
assert.deepEqual(migrateSavedNarrativeState({engineState:migrated},5),migrated);
assert.equal(seal0106Memory.payoff?.usableFrom,undefined,'no invented lower bound on acquired knowledge');
assert.equal(seal0106Memory.payoff?.eventTime,223);
assert.equal(migrated.persistent.memories.find(m=>m.id===MEMORY_0106_SEAL)?.payoff?.eventTime,223);
assert.deepEqual(migrated.persistent.memories.filter(m=>m.id!==MEMORY_0106_SEAL), before.persistent.memories.filter(m=>m.id!==MEMORY_0106_SEAL));
const scene = storyScenes[migrated.volatile.currentSceneId];
const choice = getAvailableChoices(scene,migrated).find(c=>c.id==='USE_MEMORY_0106_SEAL')!;
assert(choice,'memory can be used at 21:23');
const missing = {...migrated,persistent:{...migrated.persistent,memories:[]}};
assert(!getAvailableChoices(scene,missing).some(c=>c.id===choice.id),'no unearned knowledge');
let after = applyEffects(migrated,choice.effects);
assert.equal(after.volatile.time,0);
assert.equal(after.volatile.currentSceneId,'SCENE_CH4_OPENING');
assert.equal(after.volatile.flags.FLAG_0106_AVOIDANCE_PLANNED,true);
assert.deepEqual(after.volatile.clock?.events,{});
assert.equal(after.volatile.deathId,undefined);
assert.deepEqual(after.volatile.itemIds,[]);
after = migrateSavedNarrativeState({engineState:JSON.parse(JSON.stringify(after))},6)!;
assert(!getAvailableChoices(storyScenes[after.volatile.currentSceneId],after).some(c=>c.id===choice.id),'stale input cannot execute twice');
assert.match(describeBandState(migrated)!,/이전 밤.*현재 원본 소지 없음/);
assert.match(describeBandState({...migrated,persistent:{...migrated.persistent,
  flags:{...migrated.persistent.flags,BAND_CUSTODY_PLAYER:true}}})!,/이전 밤들의/,
  'multiple retained histories cannot be interpreted as the latest physical owner');
assert.match(transferRoomDetail(migrated),/01시 06분/);
assert(!transferRoomDetail(missing).includes('06'),'map must not reveal a future seal before learning it');

// Legacy persistent custody must never select the current-loop companion.
const worker = {...migrated,volatile:{...migrated.volatile,time:193 as GameTime,currentSceneId:'SCENE_CH3_MISSING_WORKER' as SceneId}};
const available = getAvailableChoices(storyScenes[worker.volatile.currentSceneId],worker);
assert(!available.some(c=>c.effects.some(e=>e.type==='jumpScene'&&e.sceneId==='SCENE_CH3_APPROACH_YUJIN')));
const current = {...worker,volatile:{...worker.volatile,flags:{CH3_BAND_OWNER:'yujin'}}};
assert(getAvailableChoices(storyScenes[current.volatile.currentSceneId],current).some(c=>c.effects.some(e=>e.type==='jumpScene'&&e.sceneId==='SCENE_CH3_APPROACH_YUJIN')));
const reset = resetLoop(current, migrated.volatile.currentSceneId, migrated.volatile.currentLocationId);
assert.deepEqual(reset.volatile.itemIds,[]);
assert.deepEqual(reset.volatile.flags,{});
assert.deepEqual(reset.persistent.flags,migrated.persistent.flags);
assert.match(describeBandState(reset)!,/이전 밤/);
console.log('Loop3 state PASS: v5/v6 idempotence, original preservation, acquired anticipation, no early event, scoped custody and no map knowledge leak.');
