// store/useGameStore.ts
import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';

export type JobType = 'JOURNALIST' | 'GAMBLER' | 'RESEARCHER';

export interface DeathRecord {
  loopCount: number;
  deathId: string;
  cause: string;
  unlockedTrait: string;
}

export interface GameState {
  // 영구 계승 메타 데이터 (사망해도 보존)
  loopCount: number;
  selectedJob: JobType;
  metaClues: string[];
  deathRecords: DeathRecord[];
  unlockedTraits: string[];

  // 휘발성 데이터 (사망 시 22:00 로비로 초기화)
  currentTime: string;
  currentLocation: string;
  apRemaining: number;
  sanity: number;
  chips: number;
  inventory: string[];

  // 액션 함수
  setJob: (job: JobType) => void;
  consumeAp: (amount: number) => void;
  reduceSanity: (amount: number) => void;
  unlockClue: (clueId: string) => void;
  triggerDeath: (deathId: string, cause: string, traitId: string) => void;
  resetLoop: () => void;
}

const INITIAL_VOLATILE = {
  currentTime: '22:00',
  currentLocation: '1F 지상 로비',
  apRemaining: 2,
  sanity: 100,
  chips: 2,
  inventory: ['여동생의 사진'],
};

export const useGameStore = create<GameState>()(
  persist(
    (set, get) => ({
      loopCount: 1,
      selectedJob: 'JOURNALIST',
      metaClues: [],
      deathRecords: [],
      unlockedTraits: [],
      ...INITIAL_VOLATILE,

      setJob: (job: JobType) => set({ selectedJob: job }),

      consumeAp: (amount: number) => {
        const current = get().apRemaining;
        set({ apRemaining: Math.max(0, current - amount) });
      },

      reduceSanity: (amount: number) => {
        const current = get().sanity;
        set({ sanity: Math.max(0, current - amount) });
      },

      unlockClue: (clueId: string) => {
        const currentClues = get().metaClues;
        if (!currentClues.includes(clueId)) {
          set({ metaClues: [...currentClues, clueId] });
        }
      },

      triggerDeath: (deathId: string, cause: string, traitId: string) => {
        const { loopCount, deathRecords, unlockedTraits } = get();
        const isNew = !deathRecords.some((d) => d.deathId === deathId);

        const updatedTraits =
          isNew && traitId && !unlockedTraits.includes(traitId)
            ? [...unlockedTraits, traitId]
            : unlockedTraits;

        set({
          deathRecords: [
            ...deathRecords,
            { loopCount, deathId, cause, unlockedTrait: traitId },
          ],
          unlockedTraits: updatedTraits,
        });

        get().resetLoop();
      },

      resetLoop: () => {
        set((state) => ({
          loopCount: state.loopCount + 1,
          ...INITIAL_VOLATILE,
        }));
      },
    }),
    {
      name: 'zero-hour-storage',
      storage: createJSONStorage(() => AsyncStorage),
      partialize: (state) => ({
        loopCount: state.loopCount,
        selectedJob: state.selectedJob,
        metaClues: state.metaClues,
        deathRecords: state.deathRecords,
        unlockedTraits: state.unlockedTraits,
      }),
    }
  )
);

export default useGameStore;