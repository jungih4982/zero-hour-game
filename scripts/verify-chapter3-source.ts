import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { chapter3Scenes } from '../src/content/chapter3';

const source = readFileSync('docs/story/production/v02/scripts/CH03_THREE_TESTIMONIES.md', 'utf8');
const bodies = Object.values(chapter3Scenes).map((scene) => scene.body).join('\n');
const spokenLines = [...source.matchAll(/^[^\n]+: “([^”]+)”/gm)].map((match) => match[1]);
assert(spokenLines.length > 60, 'the source dialogue extraction must not silently become empty');
for (const line of spokenLines) {
  assert(bodies.includes(`"${line}"`), `Missing or rewritten CH3 dialogue: ${line}`);
}
for (const forbidden of ['결과:', '획득:', '동행 조건:', '주인공 보관:', 'TRUST_', 'BAND_CUSTODY_']) {
  assert(!bodies.includes(forbidden), `Production metadata must not appear in game prose: ${forbidden}`);
}
console.log(`CH3 canonical dialogue verified: ${spokenLines.length} source lines, no production metadata.`);
