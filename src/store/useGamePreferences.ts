import AsyncStorage from '@react-native-async-storage/async-storage';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import { chapter3QaVariant, isChapter3Qa } from '../debug/chapter3Checkpoint';
import {
  tutorialGuideIds,
  type TutorialGuideId,
} from '../gameplay/tutorial';

export type DialogueSpeed = 'relaxed' | 'standard' | 'fast';

const dialogueSpeedMilliseconds: Readonly<Record<DialogueSpeed, number>> = {
  relaxed: 24,
  standard: 14,
  fast: 5,
};

type GamePreferences = {
  dialogueSpeed: DialogueSpeed;
  lastSceneId?: string;
  lastBeatIndex: number;
  seenTutorialGuideIds: readonly TutorialGuideId[];
  setDialogueSpeed: (speed: DialogueSpeed) => void;
  setPresentationProgress: (sceneId: string, beatIndex: number) => void;
  markTutorialGuideSeen: (guideId: TutorialGuideId) => void;
  resetTutorialGuides: () => void;
};

export function getDialogueSpeedMilliseconds(speed: DialogueSpeed): number {
  return dialogueSpeedMilliseconds[speed];
}

export const useGamePreferences = create<GamePreferences>()(
  persist(
    (set) => ({
      dialogueSpeed: isChapter3Qa ? 'fast' : 'standard',
      lastBeatIndex: 0,
      seenTutorialGuideIds: isChapter3Qa ? tutorialGuideIds : [],
      setDialogueSpeed: (dialogueSpeed) => set({ dialogueSpeed }),
      setPresentationProgress: (lastSceneId, lastBeatIndex) => set({
        lastSceneId,
        lastBeatIndex,
      }),
      markTutorialGuideSeen: (guideId) => set((state) => ({
        seenTutorialGuideIds: state.seenTutorialGuideIds.includes(guideId)
          ? state.seenTutorialGuideIds
          : [...state.seenTutorialGuideIds, guideId],
      })),
      resetTutorialGuides: () => set({ seenTutorialGuideIds: [] }),
    }),
    {
      name: isChapter3Qa ? `zero-hour-qa-ch3-preferences-${chapter3QaVariant}` : 'zero-hour-game-preferences',
      storage: createJSONStorage(() => AsyncStorage),
      partialize: ({ dialogueSpeed, lastSceneId, lastBeatIndex, seenTutorialGuideIds }) => ({
        dialogueSpeed,
        lastSceneId,
        lastBeatIndex,
        seenTutorialGuideIds,
      }),
      merge: (persisted, current) => ({
        ...current,
        ...(persisted as Partial<GamePreferences>),
        seenTutorialGuideIds: (persisted as Partial<GamePreferences>)
          ?.seenTutorialGuideIds
          ?.filter((guideId): guideId is TutorialGuideId =>
            tutorialGuideIds.includes(guideId as TutorialGuideId)) ?? current.seenTutorialGuideIds,
      }),
    },
  ),
);
