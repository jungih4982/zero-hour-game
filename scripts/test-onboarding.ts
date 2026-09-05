import assert from 'node:assert/strict';
import {
  formatIncidentTime,
  getActionTimeCost,
  getIncidentClockProgress,
} from '../src/gameplay/gameClock';
import { getContextualTutorialGuide } from '../src/gameplay/tutorial';

assert.equal(formatIncidentTime(0), '21:23');
assert.equal(formatIncidentTime(157), '00:00');
assert.equal(formatIncidentTime(223), '01:06');
assert.equal(formatIncidentTime(407), '04:10');
assert.equal(getIncidentClockProgress(0), 0);
assert.equal(getIncidentClockProgress(180), 0.5);
assert.equal(getIncidentClockProgress(999), 1);
assert.equal(getActionTimeCost([
  { type: 'advanceTime', minutes: 3 },
  { type: 'setFlag', flag: 'TEST', value: true, scope: 'loop' },
  { type: 'advanceTime', minutes: 2 },
]), 5);

assert.equal(getContextualTutorialGuide({
  seenGuideIds: [],
  openingBeat: true,
  timedChoiceReady: false,
  recordsAvailable: false,
})?.id, 'dialogue');
assert.equal(getContextualTutorialGuide({
  seenGuideIds: ['dialogue'],
  openingBeat: false,
  timedChoiceReady: true,
  recordsAvailable: false,
})?.id, 'time');
assert.equal(getContextualTutorialGuide({
  seenGuideIds: ['dialogue', 'time'],
  openingBeat: false,
  timedChoiceReady: false,
  recordsAvailable: true,
})?.id, 'records');
assert.equal(getContextualTutorialGuide({
  seenGuideIds: ['dialogue', 'time', 'records'],
  openingBeat: true,
  timedChoiceReady: true,
  recordsAvailable: true,
}), undefined);

console.log('Onboarding and incident-clock checks passed.');
