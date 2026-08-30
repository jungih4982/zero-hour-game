import {
  SCENE_ACT0_LAST_CALL,
  SCENE_ACT0_MESSAGES,
  SCENE_ACT0_WATCH_CALL,
  SCENE_ACT1_YUJIN_SEARCH,
  SCENE_ACT1_YUJIN_WARNING,
  SCENE_ACT2_NURSE_AT_302,
  SCENE_ACT2_REMOTE_KNOWLEDGE,
  SCENE_ACT2_ROOM_CONTRADICTION,
  SCENE_ACT2_THIRD_FLOOR,
  SCENE_ACT2_WRISTBAND,
  SCENE_ACT3_MAP_AND_TAEJUN,
  SCENE_BLACKOUT_0000,
  SCENE_CH00_ENTRANCE,
  SCENE_CH00_YUJIN_DENIAL,
  SCENE_CH00_YUJIN_FIRST,
  SCENE_FIRST_DEATH,
  SCENE_LOOP2_EARLY_ARRIVAL,
  SCENE_LOOP2_FIRST_CALL_TEST,
  SCENE_LOOP2_FIRST_PHONE,
  SCENE_LOOP2_OPERATIONS_CORRIDOR,
  SCENE_LOOP2_PHONE_PARADOX,
  SCENE_LOOP2_SEA_FIRST_MEETING,
  SCENE_LOOP2_SECOND_PHONE,
  SCENE_LOOP2_SEOYUN_RECHECK,
  SCENE_LOOP2_TAEJUN_REJECTION,
  SCENE_LOOP2_YUJIN_FOREKNOWLEDGE,
  SCENE_LOOP2_YUJIN_MINIMAL,
} from '../content/prologue';
import type { NarrativeScene } from '../engine';

export type SpeakerId =
  | 'narrator'
  | 'player'
  | 'seoyun'
  | 'yujin'
  | 'taejun'
  | 'sea'
  | 'nurse'
  | 'unknown'
  | 'message'
  | 'system';

export type DialogueBeat = {
  text: string;
  speaker: SpeakerId;
  kind: 'narration' | 'dialogue' | 'message';
};

export const speakerLabels: Readonly<
  Record<SpeakerId, { name: string }>
> = {
  narrator: { name: '' },
  player: { name: '나' },
  seoyun: { name: '서윤' },
  yujin: { name: '한유진' },
  taejun: { name: '강태준' },
  sea: { name: '윤세아' },
  nurse: { name: '병동 간호사' },
  unknown: { name: '목소리' },
  message: { name: '서윤' },
  system: { name: '휴대전화' },
};

const beats = (...speakers: SpeakerId[]) => speakers;

/**
 * One entry per blank-line-delimited source paragraph. This presentation map
 * never rewrites dialogue; it only attributes the existing text to a speaker.
 */
export const sceneParagraphSpeakers: Readonly<
  Partial<Record<string, readonly SpeakerId[]>>
> = {
  [SCENE_CH00_ENTRANCE]: beats(
    'narrator', 'narrator', 'player', 'seoyun', 'player', 'seoyun', 'player',
    'seoyun', 'player', 'narrator', 'seoyun', 'player', 'seoyun', 'player',
    'narrator', 'seoyun', 'player', 'narrator', 'seoyun', 'player', 'seoyun',
    'player', 'seoyun',
  ),
  [SCENE_ACT0_WATCH_CALL]: beats(
    'narrator', 'player', 'seoyun', 'player', 'seoyun', 'player', 'seoyun',
    'player', 'seoyun', 'player', 'seoyun', 'narrator', 'player', 'seoyun',
    'player', 'seoyun', 'narrator', 'seoyun', 'player', 'seoyun', 'player',
    'seoyun', 'narrator',
  ),
  [SCENE_ACT0_MESSAGES]: beats(
    'narrator', 'seoyun', 'narrator', 'seoyun', 'player', 'seoyun', 'player',
    'narrator', 'narrator', 'message', 'narrator', 'message', 'narrator',
    'narrator',
  ),
  [SCENE_ACT0_LAST_CALL]: beats(
    'narrator', 'player', 'narrator', 'player', 'seoyun', 'player', 'narrator',
    'seoyun', 'player', 'seoyun', 'player', 'seoyun', 'narrator', 'player',
    'seoyun', 'player', 'narrator', 'seoyun', 'player', 'seoyun', 'player',
    'narrator', 'seoyun', 'narrator',
  ),
  [SCENE_CH00_YUJIN_FIRST]: beats(
    'yujin', 'player', 'yujin', 'player', 'yujin', 'narrator', 'narrator',
    'yujin', 'narrator', 'yujin', 'narrator', 'seoyun', 'seoyun',
  ),
  [SCENE_ACT1_YUJIN_SEARCH]: beats(
    'player', 'player', 'narrator', 'yujin', 'narrator', 'player', 'narrator',
    'yujin', 'player', 'yujin', 'player', 'narrator', 'yujin',
  ),
  [SCENE_CH00_YUJIN_DENIAL]: beats(
    'narrator', 'narrator', 'player', 'narrator', 'nurse', 'narrator', 'yujin',
    'player', 'narrator', 'seoyun', 'narrator',
  ),
  [SCENE_ACT1_YUJIN_WARNING]: beats(
    'narrator', 'seoyun', 'yujin', 'narrator', 'player', 'yujin', 'narrator',
    'narrator', 'narrator',
  ),
  [SCENE_ACT2_THIRD_FLOOR]: beats(
    'narrator', 'narrator', 'narrator', 'narrator', 'narrator', 'narrator',
    'nurse', 'player', 'narrator',
  ),
  [SCENE_ACT2_NURSE_AT_302]: beats(
    'nurse', 'player', 'yujin', 'narrator', 'yujin', 'narrator', 'nurse',
    'yujin', 'narrator', 'narrator',
  ),
  [SCENE_ACT2_ROOM_CONTRADICTION]: beats(
    'narrator', 'narrator', 'narrator', 'narrator', 'yujin', 'narrator',
    'narrator',
  ),
  [SCENE_ACT2_WRISTBAND]: beats(
    'narrator', 'narrator', 'narrator', 'narrator', 'yujin', 'player',
    'narrator', 'narrator', 'seoyun', 'narrator', 'seoyun',
  ),
  [SCENE_ACT2_REMOTE_KNOWLEDGE]: beats(
    'player', 'narrator', 'narrator', 'narrator', 'narrator', 'yujin',
    'player', 'yujin', 'narrator',
  ),
  [SCENE_ACT3_MAP_AND_TAEJUN]: beats(
    'narrator', 'narrator', 'taejun', 'narrator', 'player', 'taejun',
    'player', 'narrator', 'narrator',
  ),
  [SCENE_BLACKOUT_0000]: beats(
    'narrator', 'narrator', 'narrator', 'narrator', 'narrator', 'system',
    'narrator', 'unknown', 'narrator',
  ),
  [SCENE_FIRST_DEATH]: beats(
    'narrator', 'narrator', 'narrator', 'unknown', 'narrator', 'narrator',
    'narrator', 'narrator',
  ),
  [SCENE_LOOP2_FIRST_CALL_TEST]: beats(
    'seoyun', 'narrator', 'seoyun', 'narrator', 'player', 'seoyun', 'player',
    'seoyun', 'player', 'narrator', 'seoyun', 'player', 'narrator', 'seoyun',
    'narrator', 'player', 'narrator', 'seoyun', 'player', 'seoyun', 'narrator',
    'seoyun', 'player', 'narrator',
  ),
  [SCENE_LOOP2_EARLY_ARRIVAL]: beats(
    'narrator', 'narrator', 'nurse', 'narrator', 'narrator', 'nurse',
    'narrator', 'narrator', 'narrator', 'narrator',
  ),
  [SCENE_LOOP2_FIRST_PHONE]: beats(
    'narrator', 'player', 'nurse', 'player', 'narrator', 'narrator',
    'narrator', 'system', 'narrator', 'narrator', 'narrator',
  ),
  [SCENE_LOOP2_PHONE_PARADOX]: beats(
    'seoyun', 'narrator', 'narrator', 'player', 'seoyun', 'player', 'seoyun',
    'narrator', 'narrator', 'narrator',
  ),
  [SCENE_LOOP2_YUJIN_FOREKNOWLEDGE]: beats(
    'player', 'narrator', 'yujin', 'player', 'yujin', 'narrator', 'yujin',
    'narrator', 'narrator',
  ),
  [SCENE_LOOP2_YUJIN_MINIMAL]: beats(
    'player', 'narrator', 'yujin', 'player', 'yujin', 'narrator', 'narrator',
    'narrator',
  ),
  [SCENE_LOOP2_OPERATIONS_CORRIDOR]: beats(
    'narrator', 'narrator', 'narrator', 'narrator', 'narrator',
  ),
  [SCENE_LOOP2_SEA_FIRST_MEETING]: beats(
    'player', 'narrator', 'sea', 'player', 'sea', 'narrator', 'sea', 'player',
    'sea', 'narrator', 'taejun',
  ),
  [SCENE_LOOP2_TAEJUN_REJECTION]: beats(
    'narrator', 'taejun', 'player', 'taejun', 'player', 'narrator', 'narrator',
    'taejun', 'player', 'taejun', 'narrator',
  ),
  [SCENE_LOOP2_SEOYUN_RECHECK]: beats(
    'narrator', 'narrator', 'seoyun', 'player', 'seoyun', 'player', 'seoyun',
    'player', 'narrator', 'seoyun', 'player', 'seoyun', 'player', 'seoyun',
    'player', 'narrator', 'seoyun', 'player', 'narrator',
  ),
  [SCENE_LOOP2_SECOND_PHONE]: beats(
    'narrator', 'narrator', 'narrator', 'narrator', 'system', 'narrator',
    'seoyun', 'player', 'narrator', 'player', 'narrator', 'seoyun', 'narrator',
    'narrator',
  ),
};

export function getDialogueBeats(scene: NarrativeScene): readonly DialogueBeat[] {
  const paragraphs = scene.body.split(/\n\n+/).filter(Boolean);
  const mappedSpeakers = sceneParagraphSpeakers[scene.id];

  return paragraphs.map((text, index) => {
    const trimmed = text.trim();
    const speaker =
      mappedSpeakers?.[index] ?? (trimmed.startsWith('"') ? 'unknown' : 'narrator');
    const kind: DialogueBeat['kind'] = trimmed.startsWith('"')
      ? 'dialogue'
      : speaker === 'seoyun' || speaker === 'message' || speaker === 'system'
        ? 'message'
        : 'narration';
    return { text, speaker, kind };
  });
}
