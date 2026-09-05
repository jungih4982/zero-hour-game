import type { NarrativeEffect } from '../engine';

export const INCIDENT_START_HOUR = 21;
export const INCIDENT_START_MINUTE = 23;
export const INCIDENT_WINDOW_MINUTES = 6 * 60;

export function formatIncidentTime(timeOffsetMinutes: number): string {
  const totalMinutes = INCIDENT_START_HOUR * 60
    + INCIDENT_START_MINUTE
    + Math.max(0, timeOffsetMinutes);
  const hours = Math.floor((totalMinutes % (24 * 60)) / 60);
  const minutes = totalMinutes % 60;
  return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}`;
}

export function getIncidentClockProgress(timeOffsetMinutes: number): number {
  return Math.min(1, Math.max(0, timeOffsetMinutes / INCIDENT_WINDOW_MINUTES));
}

export function getActionTimeCost(effects: readonly NarrativeEffect[], currentTime = 0): number {
  const nextTime = effects.reduce((time, effect) => {
    if (effect.type === 'advanceTime') return time + effect.minutes;
    if (effect.type === 'setTime') return effect.time;
    return time;
  }, currentTime);
  return Math.max(0, nextTime - currentTime);
}
