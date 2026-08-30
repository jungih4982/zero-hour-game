export type NarrativeInputPhase =
  | 'typing'
  | 'completing'
  | 'ready'
  | 'transitioning';

export type NarrativeInputState = {
  epoch: string;
  phase: NarrativeInputPhase;
  completionRequest: number;
  pendingAdvance: boolean;
};

export type NarrativeInputEvent =
  | { type: 'reset'; epoch: string }
  | { type: 'tap'; canAdvance: boolean }
  | { type: 'typingComplete'; epoch: string; canAdvance: boolean }
  | { type: 'choiceSelected' }
  | { type: 'appStateChanged' };

export type NarrativeInputCommand = 'none' | 'completeText' | 'advance';

export type NarrativeInputResult = {
  state: NarrativeInputState;
  command: NarrativeInputCommand;
};

export function createNarrativeInputState(epoch: string): NarrativeInputState {
  return {
    epoch,
    phase: 'typing',
    completionRequest: 0,
    pendingAdvance: false,
  };
}

export function updateNarrativeInput(
  state: NarrativeInputState,
  event: NarrativeInputEvent,
): NarrativeInputResult {
  switch (event.type) {
    case 'reset':
      return {
        state: {
          epoch: event.epoch,
          phase: 'typing',
          completionRequest: state.completionRequest,
          pendingAdvance: false,
        },
        command: 'none',
      };
    case 'tap':
      if (state.phase === 'typing') {
        return {
          state: {
            ...state,
            phase: 'completing',
            completionRequest: state.completionRequest + 1,
          },
          command: 'completeText',
        };
      }
      if (state.phase === 'completing') {
        return {
          state: { ...state, pendingAdvance: event.canAdvance },
          command: 'none',
        };
      }
      if (state.phase === 'ready' && event.canAdvance) {
        return {
          state: { ...state, phase: 'transitioning', pendingAdvance: false },
          command: 'advance',
        };
      }
      return { state, command: 'none' };
    case 'typingComplete':
      if (event.epoch !== state.epoch || state.phase === 'transitioning') {
        return { state, command: 'none' };
      }
      if (state.pendingAdvance && event.canAdvance) {
        return {
          state: { ...state, phase: 'transitioning', pendingAdvance: false },
          command: 'advance',
        };
      }
      return {
        state: { ...state, phase: 'ready', pendingAdvance: false },
        command: 'none',
      };
    case 'choiceSelected':
      return {
        state: { ...state, phase: 'transitioning', pendingAdvance: false },
        command: 'none',
      };
    case 'appStateChanged':
      return { state, command: 'none' };
  }
}
