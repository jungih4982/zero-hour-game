// Read-only simulation. Hypothetical anchors live only in this probe, never in the app.
import fs from 'node:fs';
import { storyScenes, getLoopResetTarget } from '../../../../../src/content/story';
import { applyEffects, getAvailableChoices, resetLoop, LOOP_START_TIME } from '../../../../../src/engine';
import type { NarrativeEngineState, GameTime } from '../../../../../src/engine';
import { SCENE_CH00_ENTRANCE, LOCATION_MOUNTAIN_ROAD } from '../../../../../src/content/prologue';
import { sceneInvestigations, canInspectHotspot, investigationFlag } from '../../../../../src/gameplay/investigation';
import { deductions, canFormDeduction } from '../../../../../src/gameplay/deductions';
import { formatIncidentTime } from '../../../../../src/gameplay/gameClock';

function run(anchor: boolean) {
  let state: NarrativeEngineState = {
    persistent: { loopCount: 1, clueIds: [], deductionIds: [], memories: [], deathIntel: [], deathRecords: [], flags: {} },
    volatile: { time: LOOP_START_TIME, currentSceneId: SCENE_CH00_ENTRANCE, currentLocationId: LOCATION_MOUNTAIN_ROAD,
      visitedSceneIds: [], itemIds: [], flags: {} },
  };
  const log = [];
  const prefer = ['PRESERVE_MESSAGE_SEQUENCE', 'DO_NOT_EXPLAIN_LOOP_YET', 'TELL_YUJIN_ONLY_PHONE_FACT', 'SHOW_SECOND_PHONE_TO_TAEJUN', 'CH3_BAND_SHOW_TAEJUN'];
  for (let n = 0; n < 100; n++) {
    const scene = storyScenes[state.volatile.currentSceneId];
    const before = state.volatile.time;
    const inv = sceneInvestigations[scene.id];
    if (inv) for (const h of inv.hotspots) if (canInspectHotspot(state, inv, h)) {
      state = applyEffects(state, [...h.effects, { type: 'setFlag', flag: investigationFlag(scene.id, h.id), value: true, scope: 'loop' }]);
    }
    for (const d of deductions) if (canFormDeduction(state, d)) state = applyEffects(state, [{ type: 'gainDeduction', deductionId: d.id }]);
    if (state.volatile.deathId) {
      const target = getLoopResetTarget(state);
      state = resetLoop(state, target.sceneId, target.locationId);
      continue;
    }
    const choices = getAvailableChoices(scene, state);
    const choice = choices.find(c => prefer.includes(c.id)) ?? choices[0];
    if (!choice) break;
    state = applyEffects(state, choice.effects);
    const next = storyScenes[state.volatile.currentSceneId];
    state = applyEffects(state, next.onEnter ?? []);
    if (anchor && ['SCENE_ACT3_BLACKOUT', 'SCENE_LOOP2_BLACKOUT_INTERVENTION'].includes(next.id)) {
      state = applyEffects(state, [{ type: 'setTime', time: 157 as GameTime }]);
    }
    log.push({ scene: scene.id, choice: choice.id, before, beforeClock: formatIncidentTime(before),
      nextScene: next.id, after: state.volatile.time, afterClock: formatIncidentTime(state.volatile.time),
      backwardsWithoutReset: state.volatile.time < before });
  }
  return log;
}
const current = run(false);
const hypothetical = run(true);
const result = { method: 'Pure simulation, not GUI. Existing conditions, all available investigations, minimal disclosure, security custody.',
  current, hypotheticalMidnightAnchorsOnly: hypothetical };
fs.writeFileSync('docs/qa/production/2026-09-11-safe-a/EVIDENCE/timing-probe.json', JSON.stringify(result, null, 2));
console.log(JSON.stringify({ currentBackwards: current.filter(x => x.backwardsWithoutReset),
  anchorOnlyBackwards: hypothetical.filter(x => x.backwardsWithoutReset) }, null, 2));
