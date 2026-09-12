// Current content exploration. No game/save mutations; hypothetical anchors are labelled.
import fs from 'node:fs';
import { storyScenes, getLoopResetTarget } from '../../../../../src/content/story';
import { SCENE_CH00_ENTRANCE, LOCATION_MOUNTAIN_ROAD, SCENE_CHAPTER02_END } from '../../../../../src/content/prologue';
import { applyEffects, getAvailableChoices, resetLoop, type NarrativeEngineState, type GameTime } from '../../../../../src/engine';
import { sceneInvestigations, canInspectHotspot, investigationFlag } from '../../../../../src/gameplay/investigation';
import { deductions, canFormDeduction } from '../../../../../src/gameplay/deductions';
import { formatIncidentTime, getActionTimeCost } from '../../../../../src/gameplay/gameClock';

const out = 'docs/qa/production/2026-09-12-f01-dual-art/EVIDENCE';
const suffix = process.argv[2] ?? 'before';
type State = NarrativeEngineState;
type Step = { scene: string; action: string; before: number; after: number; nextScene: string; cost: number; entryEffects: unknown; conditions: unknown; beforeClock: string; afterClock: string; loop: number; backwards: boolean };
const fresh = (): State => ({persistent:{loopCount:1,clueIds:[],deductionIds:[],memories:[],deathIntel:[],deathRecords:[],flags:{}},volatile:{time:0 as GameTime,currentSceneId:SCENE_CH00_ENTRANCE,currentLocationId:LOCATION_MOUNTAIN_ROAD,visitedSceneIds:[SCENE_CH00_ENTRANCE],itemIds:[],flags:{}}});
function closure(state: State): State {
  for (const d of deductions) if (canFormDeduction(state,d)) state=applyEffects(state,[{type:'gainDeduction',deductionId:d.id}]);
  return state;
}
function entry(state: State): State {
  const scene=storyScenes[state.volatile.currentSceneId];
  const entered=applyEffects(state,scene.onEnter??[]);
  return {...entered,volatile:{...entered.volatile,visitedSceneIds:[...new Set([...entered.volatile.visitedSceneIds,scene.id])]}};
}
function choiceStep(state: State, id: string, anchorOnly: boolean): [State,Step] {
  const scene=storyScenes[state.volatile.currentSceneId];
  const c=getAvailableChoices(scene,state).find(c=>c.id===id)!;
  let next=entry(applyEffects(state,c.effects));
  if (anchorOnly && ['SCENE_ACT3_BLACKOUT','SCENE_LOOP2_BLACKOUT_INTERVENTION'].includes(next.volatile.currentSceneId)) next=applyEffects(next,[{type:'setTime',time:157 as GameTime}]);
  const before=state.volatile.time, after=next.volatile.time;
  return [next,{scene:scene.id,action:id,before,after,nextScene:next.volatile.currentSceneId,cost:getActionTimeCost(c.effects,before),entryEffects:storyScenes[next.volatile.currentSceneId].onEnter??[],conditions:c.conditions??[],beforeClock:formatIncidentTime(before),afterClock:formatIncidentTime(after),loop:state.persistent.loopCount,backwards:after<before}];
}
function inspect(state: State, id: string): [State,Step] {
  const scene=state.volatile.currentSceneId, inv=sceneInvestigations[scene], h=inv.hotspots.find(h=>h.id===id)!;
  const next=applyEffects(state,[...h.effects,{type:'setFlag',flag:investigationFlag(scene,id),value:true,scope:'loop'}]);
  return [next,{scene,action:`inspect:${id}`,before:state.volatile.time,after:next.volatile.time,nextScene:scene,cost:next.volatile.time-state.volatile.time,entryEffects:[],conditions:{usesSearchOpportunity:h.usesSearchOpportunity??false,optionalInspectionLimit:inv.optionalInspectionLimit},beforeClock:formatIncidentTime(state.volatile.time),afterClock:formatIncidentTime(next.volatile.time),loop:state.persistent.loopCount,backwards:false}];
}
function previousCounterexample(anchorOnly: boolean) {
  let state=fresh();const trace: Step[]=[];
  const prefer=['PRESERVE_MESSAGE_SEQUENCE','DO_NOT_EXPLAIN_LOOP_YET','TELL_YUJIN_ONLY_PHONE_FACT','SHOW_SECOND_PHONE_TO_TAEJUN','CH3_BAND_SHOW_TAEJUN'];
  for(let n=0;n<100;n++) {
    const scene=storyScenes[state.volatile.currentSceneId];
    const inv=sceneInvestigations[scene.id];
    if(inv) for(const h of inv.hotspots) if(canInspectHotspot(state,inv,h)) {const [next,step]=inspect(state,h.id);state=next;trace.push(step);}
    state=closure(state);
    if(state.volatile.deathId) { const target=getLoopResetTarget(state);state=entry(resetLoop(state,target.sceneId,target.locationId));continue; }
    const choices=getAvailableChoices(scene,state), c=choices.find(c=>prefer.includes(c.id))??choices[0];if(!c)break;
    const [next,step]=choiceStep(state,c.id,anchorOnly);state=next;trace.push(step);
    if(c.id==='BEGIN_CHAPTER_3')break;
  }
  return trace;
}
function key(state: State, trace: Step[]) {
  const p=state.persistent,v=state.volatile;
  // Investigation order and visited order have no gate semantics in this content.
  return JSON.stringify([p.loopCount,v.currentSceneId,v.time,[...p.clueIds].sort(),[...p.deductionIds].sort(),p.memories.map(m=>m.id).sort(),p.deathRecords.map(d=>[d.deathId,d.loopCount,d.time]),Object.entries(p.flags).sort(),[...v.itemIds].sort(),Object.entries(v.flags).sort(),v.deathId]);
}
function explore(anchorOnly:boolean) {
  const seen=new Set<string>();let stateCount=0, endCount=0;
  const groups: Record<string,{count:number;min:number;max:number;minTrace:Step[];maxTrace:Step[]}>={};
  const stack:[State,Step[]][]=[[fresh(),[]]];
  while(stack.length) {
    let [state,trace]=stack.pop()!;state=closure(state);
    const route = trace.filter(s => ['TEST_MESSAGE_ANOMALY','DO_NOT_EXPLAIN_LOOP_YET','DOCUMENT_PHONE_PARADOX','REVEAL_EXACT_FOREKNOWLEDGE','TELL_YUJIN_ONLY_PHONE_FACT','USE_B1_TRANSFER_ROUTE','FACE_TAEJUN_IN_B1'].includes(s.action)).map(s => s.action).join('/');
    const k=key(state,trace)+route;if(seen.has(k))continue;seen.add(k);stateCount++;
    if(stateCount>250000)throw new Error('State limit exceeded; do not claim full coverage.');
    if(state.volatile.currentSceneId===SCENE_CHAPTER02_END) {
      const mode=['TEST_MESSAGE_ANOMALY','DO_NOT_EXPLAIN_LOOP_YET'].find(id=>trace.some(s=>s.action===id));
      const disclosure=['DOCUMENT_PHONE_PARADOX','REVEAL_EXACT_FOREKNOWLEDGE','TELL_YUJIN_ONLY_PHONE_FACT'].find(id=>trace.some(s=>s.action===id));
      const route=trace.some(s=>s.action==='USE_B1_TRANSFER_ROUTE')?'cart':'taejun';
      const gk=`${mode}/${disclosure}/${route}`;
      const [,ch3]=choiceStep(state,'BEGIN_CHAPTER_3',anchorOnly); const full=[...trace,ch3];
      const t=state.volatile.time;const g=groups[gk]??={count:0,min:t,max:t,minTrace:full,maxTrace:full};g.count++;endCount++;
      if(t<g.min){g.min=t;g.minTrace=full;}if(t>g.max){g.max=t;g.maxTrace=full;}groups[gk]=g;continue;
    }
    if(state.volatile.deathId) { if(state.persistent.loopCount===1){const target=getLoopResetTarget(state);stack.push([entry(resetLoop(state,target.sceneId,target.locationId)),trace]);}continue; }
    const inv=sceneInvestigations[state.volatile.currentSceneId];
    if(inv)for(const h of inv.hotspots)if(canInspectHotspot(state,inv,h)){const [next,step]=inspect(state,h.id);stack.push([next,[...trace,step]]);}
    for(const c of getAvailableChoices(storyScenes[state.volatile.currentSceneId],state)){const [next,step]=choiceStep(state,c.id,anchorOnly);stack.push([next,[...trace,step]]);}
  }
  return {stateCount,endCount,groups};
}
const current=previousCounterexample(false), hypothetical=previousCounterexample(true);
const currentExplore=explore(false), midnightOnlyExplore=suffix==='before'?explore(true):undefined;
const result={method:'Pure reachable-state exploration; automatic zero-cost deduction closure; all legal hotspot subsets/orders quotient by identical state; Loop1 through CH3 entry only. Not GUI.',currentCounterexample:current,hypotheticalMidnightOnly:hypothetical,currentExplore,midnightOnlyExplore};
fs.writeFileSync(`${out}/time-ledger-${suffix}.json`,JSON.stringify(result,null,2));
console.log(JSON.stringify({currentBackwards:current.filter(x=>x.backwards),anchorOnlyBackwards:hypothetical.filter(x=>x.backwards),currentStates:currentExplore.stateCount,endStates:currentExplore.endCount,groups:Object.fromEntries(Object.entries(currentExplore.groups).map(([k,g])=>[k,{min:g.min,max:g.max,count:g.count}])),midnightOnlyStates:midnightOnlyExplore?.stateCount},null,2));
