import fs from 'node:fs';
import {storyScenes,getLoopResetTarget} from '../../../../../src/content/story';
import {applyEffects,getAvailableChoices,resetLoop} from '../../../../../src/engine';
import {sceneInvestigations,canInspectHotspot,investigationFlag} from '../../../../../src/gameplay/investigation';
import {deductions,canFormDeduction} from '../../../../../src/gameplay/deductions';
import {formatIncidentTime} from '../../../../../src/gameplay/gameClock';
import type {NarrativeEngineState} from '../../../../../src/engine';
let state:NarrativeEngineState={persistent:{loopCount:1,clueIds:[],deductionIds:[],memories:[],deathIntel:[],deathRecords:[],flags:{}},volatile:{time:0 as any,currentSceneId:'SCENE_ACT0_DRIVE' as any,currentLocationId:'MOUNTAIN_ROAD' as any,visitedSceneIds:[],itemIds:[],flags:{}}};
const log:any[]=[];
const prefer=['PRESERVE_MESSAGE_SEQUENCE','DO_NOT_EXPLAIN_LOOP_YET','TELL_YUJIN_ONLY_PHONE_FACT','SHOW_SECOND_PHONE_TO_TAEJUN','CH3_BAND_SHOW_TAEJUN'];
for(let n=0;n<100;n++){
 const scene=storyScenes[state.volatile.currentSceneId];
 log.push({scene:scene.id,loop:state.persistent.loopCount,time:formatIncidentTime(state.volatile.time),offset:state.volatile.time,items:state.volatile.itemIds,flags:state.volatile.flags});
 const inv=sceneInvestigations[scene.id];
 if(inv)for(const h of inv.hotspots){if(canInspectHotspot(state,inv,h))state=applyEffects(state,[...h.effects,{type:'setFlag',flag:investigationFlag(scene.id,h.id),value:true,scope:'loop'}]);}
 for(const d of deductions)if(canFormDeduction(state,d))state=applyEffects(state,[{type:'gainDeduction',deductionId:d.id}]);
 if(state.volatile.deathId){const target=getLoopResetTarget(state);state=resetLoop(state,target.sceneId,target.locationId);state=applyEffects(state,storyScenes[target.sceneId].onEnter??[]);continue;}
 const choices=getAvailableChoices(scene,state);const choice=choices.find(c=>prefer.includes(c.id))??choices[0];if(!choice)break;
 const before=state.volatile.time;state=applyEffects(state,choice.effects);const next=storyScenes[state.volatile.currentSceneId];state=applyEffects(state,next.onEnter??[]);
 log[log.length-1].choice=choice.id;log[log.length-1].nextTime=state.volatile.time;
 if(state.volatile.time<before)log[log.length-1].BACKWARDS_WITHOUT_RESET=true;
}
fs.writeFileSync('docs/qa/full-audit/2026-09-11-phase0/EVIDENCE/normal-state-simulation.json',JSON.stringify({method:'Pure state simulation; normal conditions, available hotspots and deductions; NOT GUI play.',log},null,2));
console.log(JSON.stringify(log.filter(x=>/BLACKOUT|DEATH|BAND|MISSING_CARD|CH4|ARRIVAL|CHAPTER02/.test(x.scene)),null,2));
