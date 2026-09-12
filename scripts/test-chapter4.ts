import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { chapter4Text, chapter4ProductionStops } from '../src/content/chapter4';
import { storyScenes } from '../src/content/story';
import { getAvailableChoices, applyEffects } from '../src/engine';
import type { NarrativeEngineState } from '../src/engine';
import { migrateSavedNarrativeState } from '../src/store/narrativeSave';
import { getDialogueBeats } from '../src/ui/dialogueBeats';
import { getActionTimeCost } from '../src/gameplay/gameClock';
const manuscript=readFileSync('docs/story/production/v02/scripts/CH04_BELOW_THE_WARD.md','utf8').replace(/\r/g,'');
for(const [key,value] of Object.entries(chapter4Text)) {
  const section=manuscript.match(new RegExp(`### SCENE ${key} — .+\n\n([\\s\\S]*?)(?=\n### |\n---|$)`))![1];
  const expected=section.split('\n획득:')[0].trim().replace(/^(유진|태준|주인공|세아|보안 직원): /gm,'').replace(/[“”]/g,'"').replace(/`/g,'');
  assert.equal(value.body,expected,`${key}: approved paragraphs preserved in order`);
  const scene=storyScenes[`SCENE_CH4_${key.replace('-','_')}`];
  assert.equal(getDialogueBeats(scene).length,value.speakers.length);
}
const fixture=JSON.parse(readFileSync('docs/qa/production/2026-09-12-f01-dual-art/EVIDENCE/fresh-loop3-memory-choice.json','utf8'))['zero-hour-narrative-save'];
const fresh=()=>migrateSavedNarrativeState(fixture.state,fixture.version)!;
function choose(state:NarrativeEngineState,id:string) {
  const choice=getAvailableChoices(storyScenes[state.volatile.currentSceneId],state).find(c=>c.id===id);
  if(!choice)return state;
  const moved=applyEffects(state,choice.effects);
  return applyEffects(moved,storyScenes[moved.volatile.currentSceneId].onEnter??[]);
}
let state=fresh();
for(const id of ['USE_MEMORY_0106_SEAL','CH4_SET_LOOP_GOAL'])state=choose(state,id);
assert.equal(storyScenes[state.volatile.currentSceneId].choices.length,3,'all approved route choices remain visible');
assert.equal(getActionTimeCost(storyScenes[state.volatile.currentSceneId].choices.find(c=>c.id==='CH4_ROUTE_SEA')!.effects,0),157,
  'the Sea choice must disclose both the 50-minute journey and the wait to midnight');
assert.deepEqual(choose(state,'CH4_ROUTE_YUJIN'),state,'production hold must be enforced by the engine');
for(const [id,time] of [['CH4_ROUTE_TAEJUN',50],['CH4_T_WATCH_SIGNAL',51],['CH4_T_PREVENT_TRANSFER',53]] as const){
  state=choose(state,id);assert.equal(state.volatile.time,time);
}
assert.equal(state.volatile.currentSceneId,'SCENE_CH4_T_03');
assert.equal(state.persistent.flags.TRUST_TAEJUN,true);
assert.equal(state.volatile.flags.CH4_WORKER_TRANSFER_CANCELED,true);
assert.deepEqual(state.volatile.itemIds,['B2_SECURITY_KEY']);
assert(state.persistent.clueIds.includes('CCTV_ORIGINAL_GAP' as never));
assert.deepEqual(state.volatile.clock?.events,{});
assert.equal(state.volatile.deathId,undefined);
assert.equal(state.persistent.memories.length,fresh().persistent.memories.length);
const loaded=migrateSavedNarrativeState({engineState:JSON.parse(JSON.stringify(state))},6)!;
assert.deepEqual(choose(loaded,'CH4_T_PREVENT_TRANSFER'),loaded,'load and stale input do not repeat rewards');
let sea=fresh();
for(const id of ['USE_MEMORY_0106_SEAL','CH4_SET_LOOP_GOAL','CH4_ROUTE_SEA'])sea=choose(sea,id);
assert.equal(sea.volatile.time,157);
assert.equal(sea.volatile.clock?.events.blackout,157);
assert.deepEqual(sea.volatile.itemIds,[],'never recreate the missing old-map photo');
assert(!sea.persistent.flags.TRUST_SEA);
assert(chapter4ProductionStops.includes(sea.volatile.currentSceneId));
console.log('CH4 PASS: 7 source sections and attribution, 3 visible routes, 2 playable entries, Taejun proof/reward/save idempotence; Sea stops before missing-photo usage.');
