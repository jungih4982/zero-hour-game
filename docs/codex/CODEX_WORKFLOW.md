# Codex Workflow — Plus Plan / Token-Conscious

## Why this exists
Codex is valuable, but repository-wide exploration and long agent runs can consume a large allowance. Use it only where repository context materially saves human effort.

## Division of labor
### ChatGPT conversation
Use for:
- game design
- story design
- architecture decisions
- writing task specs
- reviewing pasted errors
- generating small isolated functions
- explaining code to the developer

### Codex
Use for:
- multi-file implementation
- repository-wide refactor
- dependency migration
- wiring a feature through data/store/UI/tests
- debugging where the cause spans several files

### Local terminal
Use for:
- npm install
- npm run typecheck
- npm test
- Expo start
- checking git diff/status

## Golden rule
Never prompt Codex with “analyze everything and improve it.”

Give one bounded task with files, constraints, acceptance criteria, and verification commands.

## Recommended task size
One Codex turn should usually produce ONE of:
- one subsystem
- one refactor
- one bug fix cluster
- one content integration pass

Do not combine architecture + art + story + UI in one turn.

## Before every Codex task
1. `git status`
2. commit or stash existing work
3. state exact goal
4. state files likely involved
5. state what must not change
6. give acceptance criteria
7. tell Codex to run only relevant checks

## Prompt template
```
Task: <one concrete outcome>

Read first:
- AGENTS.md
- <specific docs only>

Do not redesign unrelated systems.
Do not touch legacy files unless necessary.

Implement:
1. ...
2. ...

Acceptance criteria:
- ...
- ...

Verification:
- npm run typecheck
- <specific test command>

At the end, summarize:
- files changed
- behavior changed
- verification result
- any unresolved risk
```

## Token-saving rules
- Never ask Codex to reread every design document; name only the relevant docs.
- Keep `AGENTS.md` concise.
- Split implementation into commits.
- Reuse the same thread for the same subsystem only; start fresh when context becomes bloated.
- Ask for diffs/implementation, not essays.
- Run tests locally when the agent does not need to reason about the output.
- Check `/status` periodically in Codex CLI.

## First 5 Codex tasks
1. Introduce new narrative-engine types without replacing UI.
2. Implement deterministic clock + condition/effect evaluation.
3. Implement memory/clue retention and loop reset.
4. Implement Foreknowledge choice rendering.
5. Build a tiny developer-only two-loop test scenario.

Only after those pass should Codex touch the real vertical-slice script.
