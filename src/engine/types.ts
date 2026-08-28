/** Minute offset from the start of a loop (22:00). */
export type GameTime = number & { readonly __brand: 'GameTime' };

export type SceneId = string & { readonly __brand: 'SceneId' };
export type LocationId = string & { readonly __brand: 'LocationId' };
export type ClueId = string & { readonly __brand: 'ClueId' };
export type DeductionId = string & { readonly __brand: 'DeductionId' };
export type MemoryId = string & { readonly __brand: 'MemoryId' };
export type ItemId = string & { readonly __brand: 'ItemId' };

export type NarrativeScene = {
  id: SceneId;
  locationId: LocationId;
  title?: string;
  body: string;
  choices: readonly NarrativeChoice[];
  onEnter?: readonly NarrativeEffect[];
};

export type NarrativeChoice = {
  id: string;
  text: string;
  kind: 'standard' | 'foreknowledge';
  conditions?: readonly ChoiceCondition[];
  effects: readonly NarrativeEffect[];
};

export type ChoiceCondition =
  | { type: 'hasMemory'; memoryId: MemoryId }
  | { type: 'hasClue'; clueId: ClueId }
  | { type: 'lacksClue'; clueId: ClueId }
  | { type: 'hasItem'; itemId: ItemId }
  | { type: 'hasDeduction'; deductionId: DeductionId }
  | { type: 'minimumLoopCount'; count: number }
  | { type: 'maximumLoopCount'; count: number }
  | { type: 'timeBefore'; time: GameTime }
  | { type: 'timeAfter'; time: GameTime }
  | { type: 'timeRange'; start: GameTime; end: GameTime }
  | { type: 'knowsPreviousDeath'; deathId: string }
  | { type: 'knowsDeathIntel'; memoryId: MemoryId }
  | { type: 'flagEquals'; flag: string; value: boolean | number | string };

export type NarrativeEffect =
  | { type: 'gainClue'; clueId: ClueId }
  | { type: 'gainMemory'; memory: MemoryRecord }
  | { type: 'gainItem'; itemId: ItemId }
  | { type: 'removeItem'; itemId: ItemId }
  | { type: 'gainDeathIntel'; intel: DeathIntel }
  | { type: 'advanceTime'; minutes: number }
  | { type: 'moveLocation'; locationId: LocationId }
  | {
      type: 'setFlag';
      flag: string;
      value: boolean | number | string;
      scope: 'persistent' | 'loop';
    }
  | { type: 'triggerDeath'; deathId: string; intel?: DeathIntel }
  | { type: 'jumpScene'; sceneId: SceneId };

/** A fixed point on the loop clock, also called an anchor event. */
export type FixedEvent = {
  id: string;
  time: GameTime;
  sceneId: SceneId;
  locationId: LocationId;
  conditions?: readonly ChoiceCondition[];
  effects: readonly NarrativeEffect[];
};

export type DeathIntel = {
  memoryId: MemoryId;
  deathId: string;
  title: string;
  description: string;
  learnedClueIds?: readonly ClueId[];
};

export type MemoryRecord = {
  id: MemoryId;
  title: string;
  description: string;
  acquiredOnLoop: number;
  sourceSceneId?: SceneId;
  relatedClueIds?: readonly ClueId[];
  payoff?: KnowledgePayoff;
};

export type KnowledgePayoff = {
  predictsEvent: string;
  usableFrom?: GameTime;
  usableUntil?: GameTime;
  changes: readonly (
    | 'timeSaved'
    | 'riskAvoided'
    | 'routeUnlocked'
    | 'eventPreempted'
    | 'npcBehaviorChanged'
    | 'informationCombined'
  )[];
  timeSavedMinutes?: number;
  avoidsRisk?: string;
  unlocksLocationId?: LocationId;
};

export type DeathRecord = {
  deathId: string;
  loopCount: number;
  time: GameTime;
  sceneId: SceneId;
};

/** Knowledge and progression retained when a loop resets. */
export type LoopPersistentState = {
  loopCount: number;
  clueIds: readonly ClueId[];
  deductionIds: readonly DeductionId[];
  memories: readonly MemoryRecord[];
  deathIntel: readonly DeathIntel[];
  deathRecords: readonly DeathRecord[];
  flags: Readonly<Record<string, boolean | number | string>>;
};

/** State discarded and recreated at the beginning of every loop. */
export type LoopVolatileState = {
  time: GameTime;
  currentSceneId: SceneId;
  currentLocationId: LocationId;
  visitedSceneIds: readonly SceneId[];
  itemIds: readonly ItemId[];
  flags: Readonly<Record<string, boolean | number | string>>;
  deathId?: string;
};

export type NarrativeEngineState = {
  persistent: LoopPersistentState;
  volatile: LoopVolatileState;
};
