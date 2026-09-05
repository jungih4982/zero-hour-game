import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

const sourcePath = resolve('docs/story/LOOP2_SEOYUN_DID_NOT_KNOW.md');
const source = readFileSync(sourcePath, 'utf8');
const implementationPath = resolve('src/content/prologue.ts');
const implementation = readFileSync(implementationPath, 'utf8');

const requiredPassages = [
  '태준은 친절한 조사 파트너가 아니다.',
  '잠깐 비는 구간이 있습니다.',
  '1분 정도요.',
  '그건 거기 있으면 안 돼.',
  '내가 알던 거랑 달라.',
  '나도 헷갈려.',
  '나도 내가 기억하는 게 다 맞는 줄 알았어.',
  '내가 아는 것도 이제 다 믿지 마.',
  '오빠가 직접 본 거.',
  '그리고 여러 번 확인한 거.',
  '한 사람의 말만으로 결론 내리지 않는다.',
] as const;

for (const passage of requiredPassages) {
  if (!source.includes(passage)) {
    throw new Error(`Canonical dialogue source is missing: ${passage}`);
  }
}

for (let scene = 111; scene <= 152; scene += 1) {
  if (!source.includes(`SCENE 4-${scene}`)) {
    throw new Error(`Canonical dialogue source is missing SCENE 4-${scene}`);
  }
}

if (source.includes('서비스 출입문')) {
  throw new Error('Rejected term found in canonical dialogue source: 서비스 출입문');
}

const implementedPassages = [
  '잠깐 비는 구간이 있습니다.',
  '1분 정도요.',
  '그건 거기 있으면 안 돼. 내가 알던 거랑 달라.',
  '나도 내가 기억하는 게 다 맞는 줄 알았어.',
  '내가 아는 것도 이제 다 믿지 마.',
  '오빠가 직접 본 거. 그리고 여러 번 확인한 거.',
  '누구 한 사람의 말만으로 결론 내리지 않는다.',
] as const;

for (const passage of implementedPassages) {
  if (!implementation.includes(passage)) {
    throw new Error(`Implemented chapter is missing canonical line: ${passage}`);
  }
}

if (implementation.includes('서비스 출입문')) {
  throw new Error('Rejected term found in implemented chapter: 서비스 출입문');
}

if (implementation.includes('주인공')) {
  throw new Error('Player-facing narration must remain in first-person perspective.');
}

const transitionPassages = [
  '조회 결과를 믿지 않고 한 번 더 확인해 달라고 한다.',
  '태준이 대화를 끝내고 보안실로 돌아가려던 순간',
  '안내도 사진과 CCTV가 끊긴 시간을 겹쳐 보던 중',
] as const;

for (const passage of transitionPassages) {
  if (!implementation.includes(passage)) {
    throw new Error(`Narrative transition bridge is missing: ${passage}`);
  }
}

console.log('Canonical source and implemented chapter dialogue verified.');
