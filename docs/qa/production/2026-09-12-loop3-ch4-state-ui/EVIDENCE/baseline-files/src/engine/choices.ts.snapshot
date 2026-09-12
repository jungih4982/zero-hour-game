import { evaluateConditions } from './conditions';
import type {
  NarrativeChoice,
  NarrativeEngineState,
  NarrativeScene,
} from './types';

export function getAvailableChoices(
  scene: NarrativeScene,
  state: NarrativeEngineState,
): readonly NarrativeChoice[] {
  return scene.choices.filter((choice) =>
    evaluateConditions(choice.conditions, state),
  );
}
