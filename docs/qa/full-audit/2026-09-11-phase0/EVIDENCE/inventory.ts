import fs from 'node:fs';
import {storyScenes} from '../../../../../src/content/story';
import {sceneInvestigations} from '../../../../../src/gameplay/investigation';
import {deductions} from '../../../../../src/gameplay/deductions';
import {getDialogueBeats} from '../../../../../src/ui/dialogueBeats';
const out='docs/qa/full-audit/2026-09-11-phase0';
const scenes=Object.values(storyScenes);
const edges=scenes.flatMap(s=>s.choices.flatMap(c=>c.effects.filter(e=>e.type==='jumpScene').map(e=>({from:s.id,choice:c.id,text:c.text,conditions:c.conditions??[],effects:c.effects,to:(e as any).sceneId}))));
const seen=new Set<string>(['SCENE_ACT0_DRIVE']);let changed=true;
while(changed){changed=false; for(const e of edges)if(seen.has(e.from)&&!seen.has(e.to)){seen.add(e.to);changed=true;} if(seen.has('SCENE_FIRST_DEATH')&&!seen.has('SCENE_LOOP2_RESET_AWAKENING')){seen.add('SCENE_LOOP2_RESET_AWAKENING');changed=true;} if([...seen].some(x=>x.startsWith('SCENE_CH3_DEATH'))&&!seen.has('SCENE_CH3_RESET_2123')){seen.add('SCENE_CH3_RESET_2123');changed=true;}}
const csv=(rows:any[][])=>rows.map(r=>r.map(v=>'"'+String(v).replaceAll('"','""')+'"').join(',')).join('\n');
fs.writeFileSync(out+'/SCENE_GRAPH.json',JSON.stringify({note:'Structural reachability only. Conditions are not proven by this graph.',scenes:scenes.map(s=>({id:s.id,title:s.title,location:s.locationId,onEnter:s.onEnter,beats:getDialogueBeats(s).length,body:s.body,investigation:sceneInvestigations[s.id],choices:s.choices})),edges,structurallyUnreachable:scenes.filter(s=>!seen.has(s.id)).map(s=>s.id)},null,2));
fs.writeFileSync(out+'/COVERAGE.csv','\ufeff'+csv([['scene_id','location','dialogue_beats','choices','hotspots','structural_reachable','automatic','gui'],...scenes.map(s=>[s.id,s.locationId,getDialogueBeats(s).length,s.choices.length,sceneInvestigations[s.id]?.hotspots.length??0,seen.has(s.id),'beat-test; route coverage see baseline','NOT_PLAYED'])]));
const summary={sceneCount:scenes.length,edgeCount:edges.length,choiceCount:scenes.reduce((n,s)=>n+s.choices.length,0),beats:scenes.reduce((n,s)=>n+getDialogueBeats(s).length,0),locations:[...new Set(scenes.map(s=>s.locationId))],investigationScenes:Object.keys(sceneInvestigations).length,hotspots:Object.values(sceneInvestigations).reduce((n,s)=>n+s.hotspots.length,0),deductions:deductions.length,missingTargets:edges.filter(e=>!storyScenes[e.to]),structurallyReachable:seen.size,terminals:scenes.filter(s=>!s.choices.length).map(s=>s.id)};
fs.writeFileSync(out+'/EVIDENCE/inventory-summary.json',JSON.stringify(summary,null,2));console.log(JSON.stringify(summary,null,2));
