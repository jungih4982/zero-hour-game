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

  // 휘발성 데이터 (사망 시 초기화)
  currentTime: string;
  currentLocation: string;
  apRemaining: number;
  sanity: number;
  chips: number;
  inventory: string[];
  visitedLocations: string[]; // ⭐️ 방문한 맵 구역 기록 (지도 해금용)

  // 액션 함수
  setJob: (job: JobType) => void;
  consumeAp: (amount: number) => void;
  reduceSanity: (amount: number) => void;
  unlockClue: (clueId: string) => void;
  addItem: (item: string) => void;
  removeItem: (item: string) => void;
  visitLocation: (location: string) => void; // ⭐️ 지도 갱신 함수
  triggerDeath: (deathId: string, cause: string, traitId: string) => void;
  resetLoop: () => void;
}

const INITIAL_VOLATILE = {
  currentTime: '22:00',
  currentLocation: '1F 지상 로비 입구',
  apRemaining: 2,
  sanity: 100,
  chips: 2,
  inventory: ['여동생의 사진'],
  visitedLocations: ['1F 지상 로비 입구'], // ⭐️ 초기 맵 시작 지점
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

      addItem: (item: string) => {
        const currentInv = get().inventory;
        if (!currentInv.includes(item)) {
          set({ inventory: [...currentInv, item] });
        }
      },

      removeItem: (item: string) => {
        set({ inventory: get().inventory.filter((i) => i !== item) });
      },

      // ⭐️ 새로운 방에 들어갈 때마다 배열에 추가
      visitLocation: (location: string) => {
        const current = get().visitedLocations;
        if (!current.includes(location)) {
          set({ visitedLocations: [...current, location] });
        }
      },

      triggerDeath: (deathId: string, cause: string, traitId: string) => {
        const { loopCount, deathRecords, unlockedTraits } = get();
        const isNew = !deathRecords.some((d) => d.deathId === deathId);
        const updatedTraits = isNew && traitId && !unlockedTraits.includes(traitId) ? [...unlockedTraits, traitId] : unlockedTraits;

        set({
          deathRecords: [...deathRecords, { loopCount, deathId, cause, unlockedTrait: traitId }],
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