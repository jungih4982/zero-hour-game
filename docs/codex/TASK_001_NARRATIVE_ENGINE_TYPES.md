# Codex Task 001 — Narrative Engine Types Only

## Objective
Create the TypeScript type foundation for the rebuilt narrative engine. Do NOT wire it into App.tsx yet.

## Read first
- `AGENTS.md`
- `docs/MASTER_GDD.md` sections 8–15 only
- `docs/PRODUCTION_ROADMAP.md` Phase 1 only

## Constraints
- Do not modify existing UI components.
- Do not delete or rewrite `data/scenarioNodes.ts`.
- Do not change the current Zustand store yet.
- Do not add dependencies.
- Keep this task compile-time/data-model only.

## Create
Suggested location: `src/engine/types.ts` (create directories if needed).

Define explicit TypeScript types for:
- GameTime / minute-based time representation
- SceneId, LocationId, ClueId, DeductionId, MemoryId
- NarrativeScene
- NarrativeChoice
- ChoiceCondition union
- NarrativeEffect union
- FixedEvent / anchor event
- DeathIntel
- MemoryRecord
- LoopPersistentState
- LoopVolatileState

Conditions should be data-driven and extensible, covering at minimum:
- has clue
- lacks clue
- has deduction
- minimum loop count
- time range
- previous death/intel known

Effects should cover at minimum:
- gain clue
- gain memory/intel
- advance time
- move location
- set flag
- trigger death
- jump scene

Do not implement evaluator logic in this task.

## Design requirements
- Prefer discriminated unions.
- Do not use `any`.
- IDs should be typed aliases rather than untyped comments.
- Types must support Foreknowledge choices without coupling to UI styling.
- Separate persistent knowledge from loop-local state.

## Verification
Run:
```bash
npx tsc --noEmit
```

If existing legacy code causes unrelated errors, report them separately and ensure the newly added file introduces no new TypeScript errors.

## Completion report
Return only:
1. files created/changed
2. short description of type model
3. verification result
4. unresolved design questions, maximum 3
