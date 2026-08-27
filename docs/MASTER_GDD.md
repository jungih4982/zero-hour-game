# ZERO HOUR: WHITE NIGHT — MASTER GDD 2.0

## 1. High concept
A narrative time-loop psychological thriller where death is reconnaissance and knowledge is progression.

**Core promise:** the player becomes powerful because they know what will happen next.

**Tagline:** “죽기 전 마지막 10초가, 다음 삶의 무기가 된다.”

## 2. Genre and scope
- Narrative thriller adventure
- Psychological horror / mystery
- PC-first, architecture portable to mobile
- First ending: 5–7 hours
- Full truth route: 8–12 hours
- Solo-developer scope: 10–15 reusable locations, 5 core NPCs, 30–35 hero CGs

## 3. Emotional arc
1. Fear — the hospital is unknown.
2. Déjà vu — repeated dialogue and events become recognizable.
3. Dominance — the player exploits future knowledge.
4. Paranoia — NPCs begin reacting to things they should not know.
5. Existential horror — the player discovers the loops are not erased timelines.

## 4. Setting
A private neurological rehabilitation hospital in a remote Korean mountain region. Beneath the hospital operates **PROJECT MNEMOSYNE**, a memory-state replication experiment.

The project does not reverse time. It creates a new brain-state instance at a fixed earlier point and injects retained memories into it.

Failed timelines continue to exist.

## 5. Player character
- User-namable protagonist
- Former EMT / paramedic
- No combat-superhero fantasy
- Competence: emergency care, observation, crisis decision-making
- True progression: retained knowledge

## 6. Inciting incident
The protagonist’s younger sister **Seo-yoon** disappeared after voluntarily entering White Night Hospital.

At 21:58, a scheduled message arrives:

> 오빠. 내가 내일도 여기 있다고 말하면 믿지 마. 00시가 되기 전에 나를 찾아.

Hospital records claim she was discharged 11 days earlier.

Game begins at 22:00 in the lobby.

## 7. Core cast
### Han Yujin — Night charge nurse, 29
Theme: guilt.
Calm, competent, and repeatedly lies about Seo-yoon. Later becomes terrified by the protagonist’s impossible foreknowledge.

### Yoon Sea — Long-term patient, 22
Theme: memory.
Does not remember loops cleanly, but experiences emotional and visual residue. Eventually says things that prove the protagonist is not the only contaminated observer.

### Kang Taejun — Security chief, 41
Theme: choice.
Appears antagonistic but secretly tries to save selected patients. Challenges the player’s assumption that knowing the future means everyone can be saved.

### Cha Minseo — Neurologist, 34
Theme: control.
Acts as a trustworthy ally. Secretly has far more loop experience than the protagonist and has learned to hide it.

### Seo-yoon — Younger sister, 24
Theme: love becoming obsession.
The first successful MNEMOSYNE subject. She kept the system running after witnessing a timeline where the protagonist died.

## 8. Location design
Use a small number of spaces repeatedly across different times and states.

### 1F — Normality
Lobby, reception, nurse station, consultation room, west ward, east ward.

### B1 — Operations
Security, electrical room, boiler room, storage, staff room.

### B2 — Isolation
Lab, pharmacy, isolation rooms, observation room, closed OR.

### B3 — MNEMOSYNE
Core room, memory archive, control room, Subject Zero room.

## 9. Time system
One loop: **22:00–04:00**.

Time is action-based, not real-time.
- inspect: 2–5 min
- short move: 3–5 min
- dialogue: 2–10 min
- complex action: 10–20 min

The player cannot intervene in every event in one loop.

## 10. Anchor events
- 23:12 — room 302 call bell
- 23:34 — Yujin moves to pharmacy
- 23:47 — west elevator stalls
- 00:00 — ZERO HOUR / blackout
- 00:06 — first fatal incident
- 00:17 — security shifts toward B1
- 00:43 — B2 gas protocol
- 01:10 — Sea moves
- 01:42 — east ward lockdown
- 02:11 — research data purge begins
- 03:20 — MNEMOSYNE initialization
- 03:57 — unexplained event
- 04:00 — loop reset

## 11. Core gameplay loop
Explore → spend time → witness event → obtain knowledge → die/fail → reset → use knowledge to unlock a Foreknowledge action → alter the route → reach deeper information.

## 12. Foreknowledge Choice
The signature UI/mechanic.

Normal choices coexist with special retained-memory choices:

**◈ [기억] 8초 뒤 컵을 떨어뜨릴 거잖아요.**

These choices must feel like power, not exposition.

## 13. Death Intelligence System
Every meaningful death should reveal at least one actionable clue, route, code, identity, schedule, weakness, or contradiction.

Death is not “retry.” It is a deliberate information-gathering strategy.

## 14. Memory Web
Clues are stored as relationships, not a flat list.

Example:
302 patient → nonexistent patient ID → Seo-yoon record → MNEMOSYNE → SUBJECT ZERO

Completing relationships unlocks deductions. Deductions unlock actions and dialogue.

## 15. Memory Contamination
Replace a generic sanity bar with **Memory Contamination**.

Repeated loops cause:
- previous-loop dialogue flashes
- people appearing where they are not
- transient extra choices
- spatial inconsistencies
- cross-instance memories

Some anomalies are hallucinations. Some contain real information.

## 16. LOOP 0 mystery
The displayed loop counter starts at 1 but is not the true count.

The player eventually discovers records such as INSTANCE -1, -4, -17.

The counter only measures loops since conscious retention began.

## 17. Diegetic UI reveal
HUD elements such as LOOP, TIME, MEMORY, and DEATH LOG appear to be normal game UI.

At B3 the player discovers the same interface on research monitors:

SUBJECT 06 / INSTANCE 17 / MEMORY RETENTION 82.4%

The UI was always the experiment’s monitoring layer.

## 18. Central reveal
MNEMOSYNE does not erase failed timelines. Each reset creates/continues another instance.

Every timeline the player “abandoned” continues without them.

Central question: **“당신은 몇 개의 세계를 버렸는가?”**

## 19. Seo-yoon reveal
Seo-yoon could have stopped MNEMOSYNE but continued it after witnessing a timeline where the protagonist died.

The player discarded worlds to save Seo-yoon.
Seo-yoon discarded worlds to save the player.

They became mirrors of each other.

## 20. Endings
### WHITE MORNING
Destroy MNEMOSYNE. The current world becomes final. Clock reaches 04:01 for the first time.

### ONE MORE TIME
Accept Seo-yoon’s logic and restart. Display: LOOP ???.

### REMEMBER THEM
Integrate failed-instance memories. Survive, but identity becomes ambiguous.

### TRUE END — ZERO HOUR
Unlock LOOP 0. No foreknowledge, Death Log, or retained advantage. The final hour forces the player to make the original choice as an ordinary human.

## 21. Vertical slice
Target: 30–45 minutes.

Required beats:
1. Arrival at 22:00
2. Yujin introduction
3. Free investigation
4. First contradiction
5. 23:47 incident
6. 00:00 blackout
7. Security encounter
8. First death
9. 22:00 reset
10. repeated Yujin scene
11. first Foreknowledge choice
12. exact prediction comes true
13. Yujin reaction changes
14. first Sea meeting
15. Sea says “또 왔네.”
16. TITLE: ZERO HOUR

The rest of the game is blocked until this slice is fun.
