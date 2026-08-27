# Beginner Guide — What You Actually Do

You do not need to become an expert React Native engineer before making the game.
You need a safe routine.

## Tools
- VS Code or Cursor: edit files
- Terminal: run commands
- Git: undo mistakes
- Expo: run the game
- ChatGPT: ask what/why/how
- Codex: perform bounded multi-file work

## Your safety routine
Before AI changes code:
```bash
git status
git add .
git commit -m "checkpoint before <task>"
```

After AI changes code:
```bash
npm run typecheck
git diff
npm start
```

If it is broken and you do not understand why, do NOT keep stacking more AI fixes. Bring the error and diff back for review.

## How to report a bug to ChatGPT
Send:
1. what you clicked
2. what you expected
3. what happened
4. exact terminal error
5. screenshot if visual

## How to judge a feature
Ask only three questions:
- Does the player understand what happened?
- Did this create tension/curiosity/power?
- Is this worth the implementation complexity?

If no, cut it.

## Current milestone
Do not make B1, B2, B3.
Do not generate final characters yet.

Current milestone is **Foundation + tiny two-loop mechanical prototype**.
