# ZERO HOUR Rebuild Rules

Read only the documents relevant to the assigned task. Do not ingest the whole docs tree unless the task requires it.

## Tech
- Expo 54
- React Native 0.81
- React 19
- TypeScript 5.9
- Zustand

Use Expo 54-compatible APIs. Check exact versioned Expo docs when API behavior is uncertain.

## Source of truth
- game design: `docs/MASTER_GDD.md`
- production order: `docs/PRODUCTION_ROADMAP.md`
- art direction: `docs/art/VISUAL_BIBLE.md`
- Codex task discipline: `docs/codex/CODEX_WORKFLOW.md`

## Development rules
- Existing game code is legacy reference until explicitly migrated.
- Do not delete working legacy code during early phases.
- Build the new narrative engine data-first.
- Keep game rules out of presentation components.
- Prefer pure functions for conditions/effects/time calculations.
- Version persisted save data.
- No large dependency without a stated reason.
- No broad refactor outside the assigned task.
- End each task with verification results and unresolved risks.

## Product priority
The 30–45 minute vertical slice comes before full-game content.
The first reset and first Foreknowledge choice are the highest-priority experience.
