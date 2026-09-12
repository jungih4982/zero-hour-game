from pathlib import Path
p=Path('src/store/useNarrativeStore.ts'); s=p.read_text(encoding='utf-8')
start=s.index('const SAVE_VERSION = 4;'); end=s.index('export function createInitialNarrativeState')
names=s[start:end].replace('const SAVE_VERSION = 4;', 'export const SAVE_VERSION = 5;')
module="""import type { LocationId, NarrativeEngineState, SceneId } from '../engine';
import { storyScenes } from '../content/story';
import { createTimeContract } from '../content/timeContract';

"""+names+"""/** Preserve legacy time and all knowledge/inventory. Never infer elapsed time from a scene id. */
export function migrateSavedNarrativeState(persisted: unknown, version: number): NarrativeEngineState | undefined {
  const saved = (persisted as { engineState?: NarrativeEngineState } | undefined)?.engineState;
  if (!saved?.persistent || !saved.volatile || version < 3) return undefined;
  const state = version === 3 ? migrateVersion3OperationsNames(saved) : saved;
  if (!storyScenes[state.volatile.currentSceneId]) return undefined;
  if (version >= SAVE_VERSION && state.volatile.clock) return state;
  const clock = createTimeContract();
  const visited = state.volatile.visitedSceneIds;
  const events: Record<string, 'legacy'> = {};
  if (state.volatile.flags.FLAG_FIRST_DEATH_AVOIDED
    || visited.includes('SCENE_ACT3_BLACKOUT' as SceneId)
    || visited.includes('SCENE_LOOP2_BLACKOUT_INTERVENTION' as SceneId)) events.blackout = 'legacy';
  if (visited.some(id => id.startsWith('SCENE_CH3_0106_'))) events.seal0106 = 'legacy';
  return { ...state, volatile: { ...state.volatile, clock: { ...clock, contractVersion: 0, events } } };
}
"""
Path('src/store/narrativeSave.ts').write_text(module,encoding='utf-8')
s=s[:start]+s[end:]
start=s.index('  const candidate = persisted as Partial<NarrativeStore>');end=s.index('\n}\n',start)
s=s[:start]+"  return migrateSavedNarrativeState(persisted, storedVersion) ?? createInitialNarrativeState();"+s[end:]
s="import { createTimeContract } from '../content/timeContract';\nimport { migrateSavedNarrativeState, SAVE_VERSION } from './narrativeSave';\n"+s
s=s.replace('DeductionId, LocationId, NarrativeEngineState','DeductionId, NarrativeEngineState')
s=s.replace('      time: LOOP_START_TIME,','      time: LOOP_START_TIME,\n      clock: createTimeContract(),')
s=s.replace('          const target = getLoopResetTarget(engineState);','          if (!engineState.volatile.deathId) return { engineState };\n          const target = getLoopResetTarget(engineState);')
p.write_text(s,encoding='utf-8')
for name in ['src/content/prologue.ts','src/content/story.ts','src/content/chapter3.ts','src/gameplay/choicePresentation.ts','src/store/useNarrativeStore.ts']:
 p=Path(name); data=p.read_bytes().replace(b'\r\n',b'\n');p.write_bytes(data.replace(b'\n',b'\r\n'))
