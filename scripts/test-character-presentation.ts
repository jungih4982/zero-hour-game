import { existsSync, readFileSync } from 'node:fs';
import { resolve } from 'node:path';

function assert(condition: unknown, message: string): asserts condition {
  if (!condition) throw new Error(message);
}

const root = resolve(import.meta.dirname, '..');
const playerSource = readFileSync(resolve(root, 'src/ui/NarrativePlayer.tsx'), 'utf8');
const manifest = JSON.parse(
  readFileSync(resolve(root, 'assets/ASSET_MANIFEST.json'), 'utf8'),
) as {
  verticalSlice: { integrated: string[] };
};

const rejectedNeutral = 'characters/seoyun/sprites/CHAR_Seoyun_Phone_Neutral_Bust_v01.png';
assert(
  !playerSource.includes(rejectedNeutral),
  '밝은 매트와 다른 얼굴이 남은 서윤 중립 스프라이트를 다시 사용하면 안 됩니다.',
);
assert(
  !manifest.verticalSlice.integrated.includes(rejectedNeutral),
  '서윤의 폐기된 중립 스프라이트를 통합 에셋으로 표시하면 안 됩니다.',
);

const integratedSeoyunSprites = manifest.verticalSlice.integrated.filter((path) =>
  path.startsWith('characters/seoyun/sprites/'),
);
assert(
  integratedSeoyunSprites.length === 3,
  `서윤의 얼굴 고정 통화 표정은 3종이어야 합니다: ${integratedSeoyunSprites.join(', ')}`,
);
for (const path of integratedSeoyunSprites) {
  assert(existsSync(resolve(root, 'assets', path)), `통합 캐릭터 에셋이 없습니다: ${path}`);
}

for (const visual of ['seoyunTenseVisual', 'seoyunGuardedVisual', 'seoyunFrightenedVisual']) {
  const occurrences = playerSource.split(visual).length - 1;
  assert(occurrences >= 3, `${visual}: 여러 감정 구간에서 실제로 사용되어야 합니다.`);
}

assert(
  playerSource.includes('key={`${stagedCharacter.id}:${stagedCharacter.expression}`}'),
  '표정이 바뀔 때 캐릭터 레이어가 교차 진입하도록 expression key를 유지해야 합니다.',
);
assert(
  playerSource.includes('styles.fieldKitFloatingButton'),
  '현장 기록 진입 버튼은 캐릭터와 대사에서 떨어진 상단 안전영역에 있어야 합니다.',
);
assert(
  !playerSource.includes('styles.toolButton,'),
  '현장 기록 진입 버튼을 대사 헤더에 다시 배치하면 캐릭터와 충돌합니다.',
);

console.log('Character presentation regression passed.');
