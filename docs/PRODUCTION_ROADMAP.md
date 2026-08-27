# Production Roadmap — Solo Developer Edition

## Rule zero
Do not build the whole game yet. Build one unforgettable 30–45 minute vertical slice.

## Phase 0 — Foundation
Goal: make the repository safe and understandable.

Tasks:
- keep old implementation intact as legacy reference
- add source-of-truth docs
- create new data-driven narrative architecture
- add lint/typecheck/test scripts
- establish asset naming and metadata rules

Exit criteria:
- app boots
- no TypeScript errors in the new architecture
- one sample node can render from data

## Phase 1 — New narrative engine
Implement only:
- game clock
- scene/node navigation
- conditions
- effects
- clue acquisition
- Memory Web basics
- Foreknowledge choices
- death → reset → retained memory
- save migration/versioning

Exit criteria:
- a developer test route proves the entire loop mechanically

## Phase 2 — Vertical slice content
Write and implement the 16 beats from MASTER_GDD.

Exit criteria:
- 30–45 minute playable build
- first loop and second loop feel materially different
- player uses knowledge at least 3 times
- at least one optional death gives useful information
- Sea reveal lands without exposition dump

## Phase 3 — Presentation pass
- visual stage transitions
- type animation refinement
- sound cue system
- screen effects for contamination
- UI hierarchy
- accessibility toggles

Exit criteria:
- playable without placeholder debug UI except missing final art

## Phase 4 — Art lock
- Visual Bible approved
- 5 character masters locked
- 1F architecture locked
- production workflows reproducible

Exit criteria:
- same character stays recognizable across 20 test outputs
- same location stays spatially coherent across variants

## Phase 5 — External playtest
Give the slice to 5–10 people who have not read the GDD.

Measure:
- where they become confused
- whether they understand death = information
- whether the first reset excites them
- whether they remember Yujin/Sea
- where they stop reading

Pass condition:
At least 70% spontaneously describe the knowledge-loop mechanic correctly and want to continue after the title reveal.

## Phase 6 — Full production
Only now expand B1/B2/B3, cast arcs, loop schedule, endings, and hero CGs.

## Beginner weekly rhythm
- Monday: choose one tiny milestone
- Tue–Thu: implement only that milestone
- Friday: run app from clean start and fix regressions
- Saturday: play the game as a player, not a developer
- Sunday: write 5 lines: what worked / what felt boring / what to cut

## Never do these
- add features because they are “cool” without a scene that needs them
- generate hundreds of AI images before visual lock
- ask Codex to “improve the whole project”
- refactor while simultaneously adding story content
- write B3 before the first reset is fun
