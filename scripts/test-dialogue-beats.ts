import { storyScenes as prologueScenes } from '../src/content/story';
import {
  getDialogueBeats,
  sceneParagraphSpeakers,
  type SpeakerId,
} from '../src/ui/dialogueBeats';

function assert(condition: unknown, message: string): asserts condition {
  if (!condition) throw new Error(message);
}

const mappedSceneIds = Object.keys(sceneParagraphSpeakers);
const representedSpeakers = new Set<SpeakerId>();

for (const scene of Object.values(prologueScenes)) {
  const dialogueBeats = getDialogueBeats(scene);
  const reconstructedBody = dialogueBeats.map((beat) => beat.text).join('\n\n');
  const hasQuotedDialogue = dialogueBeats.some((beat) => beat.text.trim().startsWith('"'));

  assert(
    reconstructedBody === scene.body,
    `${scene.id}: beat 분할 과정에서 원문이 달라졌습니다.`,
  );
  assert(
    !hasQuotedDialogue || sceneParagraphSpeakers[scene.id],
    `${scene.id}: 인용 대사가 있지만 화자 맵이 없습니다.`,
  );

  for (const beat of dialogueBeats) representedSpeakers.add(beat.speaker);
}

for (const sceneId of mappedSceneIds) {
  const scene = prologueScenes[sceneId];
  const speakers = sceneParagraphSpeakers[sceneId];

  assert(scene, `${sceneId}: 존재하지 않는 장면에 화자 정보가 연결되어 있습니다.`);
  assert(speakers, `${sceneId}: 화자 배열을 읽을 수 없습니다.`);

  const paragraphCount = scene.body.split(/\n\n+/).filter(Boolean).length;
  assert(
    speakers.length === paragraphCount,
    `${sceneId}: 원문 ${paragraphCount}문단과 화자 ${speakers.length}명이 일치하지 않습니다.`,
  );
}

for (const speaker of ['seoyun', 'yujin', 'taejun', 'sea'] as const) {
  assert(representedSpeakers.has(speaker), `${speaker}: 주요 인물의 대사 비트가 없습니다.`);
}

console.log(
  `대사 비트 검증 완료: ${Object.keys(prologueScenes).length}개 장면, ${mappedSceneIds.length}개 화자 맵, 원문 100% 보존`,
);
