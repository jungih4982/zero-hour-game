import assert from 'node:assert/strict';
import { applyEffects, resetLoop, getAvailableChoices, type GameTime, type NarrativeEngineState } from '../src/engine';
import { advanceClock } from '../src/engine/time';
import { BLACKOUT_TIME, CHAPTER3_START_TIME, SECOND_DEATH_TIME, createTimeContract } from '../src/content/timeContract';
import { storyScenes } from '../src/content/story';
import { blackoutMemory, SCENE_CH00_ENTRANCE, LOCATION_MOUNTAIN_ROAD } from '../src/content/prologue';
import { getActionTimeCost, formatIncidentTime } from '../src/gameplay/gameClock';
import { migrateSavedNarrativeState, SAVE_VERSION } from '../src/store/narrativeSave';
import { explore } from './lib/timeContractPaths';

const fresh = (): NarrativeEngineState => ({
  persistent: { loopCount: 1, clueIds: [], deductionIds: [], memories: [], deathIntel: [], deathRecords: [], flags: {} },
  volatile: { time: 0 as GameTime, clock: createTimeContract(), currentSceneId: SCENE_CH00_ENTRANCE, currentLocationId: LOCATION_MOUNTAIN_ROAD, visitedSceneIds: [SCENE_CH00_ENTRANCE], itemIds: [], flags: {} },
});
assert.deepEqual([0, BLACKOUT_TIME, CHAPTER3_START_TIME, SECOND_DEATH_TIME].map(formatIncidentTime), ['21:23','00:00','00:27','01:06']);
for (const anchor of [BLACKOUT_TIME, SECOND_DEATH_TIME]) {
  const id = anchor === BLACKOUT_TIME ? 'blackout' : 'seal0106';
  for (const elapsed of [1, 3]) {
    let state = { ...fresh(), volatile: { ...fresh().volatile, time: (anchor - 1) as GameTime } };
    state = advanceClock(state, elapsed);
    assert.equal(state.volatile.time, anchor - 1 + elapsed);
    assert.equal(state.volatile.clock?.events[id], anchor, 'Record the crossed event at its actual time, not the end of the action');
    const loaded = JSON.parse(JSON.stringify(state)) as NarrativeEngineState;
    const resumed = applyEffects(loaded, [{ type:'waitUntil',time:anchor },{type:'advanceTime',minutes:0}]);
    assert.deepEqual(resumed, loaded, 'Boundary retry/zero duration must not repeat or rewind');
  }
}
assert.throws(() => advanceClock(fresh(), -1));
assert.throws(() => advanceClock(fresh(), NaN));
assert.throws(() => advanceClock(fresh(), 0.5));
assert.equal(getActionTimeCost([{type:'advanceTime',minutes:3},{type:'waitUntil',time:BLACKOUT_TIME}],150),7);
assert.equal(getActionTimeCost([{type:'waitUntil',time:BLACKOUT_TIME}],160),0);
assert.equal(blackoutMemory.payoff?.usableFrom,0,'Foreknowledge can be used in advance');
assert.equal(blackoutMemory.payoff?.usableUntil,157);
assert.equal(blackoutMemory.payoff?.eventTime,157);

const legacy = fresh();
delete legacy.volatile.clock;
legacy.persistent.loopCount = 2;
legacy.volatile.time = 72 as GameTime;
legacy.volatile.currentSceneId = 'SCENE_LOOP2_SEOYUN_UNCERTAIN' as typeof SCENE_CH00_ENTRANCE;
legacy.volatile.flags = { FLAG_FIRST_DEATH_AVOIDED: true };
legacy.persistent.memories = [blackoutMemory];
legacy.volatile.itemIds = ['ITEM_SECOND_PHONE' as never];
const migrated = migrateSavedNarrativeState({engineState:legacy},4)!;
assert.equal(SAVE_VERSION,6);
const {clock, ...preservedVolatile} = migrated.volatile;
assert.deepEqual(preservedVolatile, legacy.volatile);
assert.deepEqual(migrated.persistent,legacy.persistent);
assert.equal(clock?.contractVersion,0);
assert.equal(clock?.events.blackout,'legacy');
assert.equal(advanceClock(migrated,100).volatile.clock?.events.blackout,'legacy');
assert.deepEqual(migrateSavedNarrativeState({engineState:migrated},5),migrated);
const reset = resetLoop(migrated, SCENE_CH00_ENTRANCE, LOCATION_MOUNTAIN_ROAD);
assert.equal(reset.volatile.time,0);
assert.equal(reset.volatile.clock?.contractVersion,1);
assert.deepEqual(reset.volatile.clock?.events,{});
assert.deepEqual(reset.volatile.itemIds,[]);
assert.deepEqual(reset.persistent.memories,migrated.persistent.memories);
assert.equal(advanceClock(reset,157).volatile.clock?.events.blackout,157);

const paths = explore(false);
assert.equal(Object.keys(paths.groups).length,12,'Keep both arrivals, all three disclosure options and both B1 routes');
for(const [name,group] of Object.entries(paths.groups)) {
  assert(group.max <=184,`${name}: maximum legal investigation must reach CH3 without a rewind`);
  for(const trace of [group.minTrace,group.maxTrace]) {
    assert(trace.every(step=>!step.backwards));
    assert.equal(trace.at(-1)?.after,184);
    for(const step of trace.filter(s=>['STAY_UNTIL_BLACKOUT','WAIT_FOR_KNOWN_BLACKOUT'].includes(s.action))) assert.equal(step.after,157);
    const arrival = trace.find(s=>s.action==='ENTER_HOSPITAL_GROUNDS')!;
    assert(arrival.after>=50 && arrival.after<=52,'First-night journey is about 50 minutes');
    const early=trace.find(s=>s.action==='DO_NOT_EXPLAIN_LOOP_YET'||s.action==='LEAVE_AFTER_MESSAGE_TEST')!;
    assert(early.after<arrival.after,'Memory must retain a real arrival advantage');
  }
}
const late = { ...fresh(), volatile: { ...fresh().volatile,time:206 as GameTime,currentSceneId:'SCENE_CHAPTER02_END' as typeof SCENE_CH00_ENTRANCE } };
const begin = getAvailableChoices(storyScenes[late.volatile.currentSceneId],late)[0];
const after = applyEffects(late,begin.effects);
assert.equal(applyEffects(after,storyScenes[after.volatile.currentSceneId].onEnter??[]).volatile.time,206,'Legacy 00:49 must not become 00:27');
for(const scene of Object.values(storyScenes)) for(const effect of [...scene.onEnter??[],...scene.choices.flatMap(c=>c.effects)]) assert.notEqual(effect.type,'setTime','Runtime story cannot force the clock');
console.log(`Time contract PASS: ${paths.stateCount} reachable states, ${paths.endCount} equivalent CH2 end states, 12 branch groups; boundaries, early memory, legacy saves, reset and no rewinds.`);
