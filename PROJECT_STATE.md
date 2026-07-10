# Project State

## Goal

Build the best browser-based Algebra Fluency Trainer possible.

Target audience: students from approximately Grade 5 through Algebra I.

The application builds automaticity through carefully generated practice problems with excellent feedback. It does not teach lessons.

---

## Technology

- React + TypeScript
- Vite
- Tailwind CSS
- React Context
- Vitest
- Deployed on Vercel

---

## Current Status

Arithmetic practice is complete and deployed.

### Implemented Skills

- Addition
- Subtraction
- Multiplication
- Division

### Implemented Features

- Practice page with timed sessions (30s, 1min, 2min, 5min, 10min)
- Countdown overlay before timed sessions
- Pause/resume with icicle visual effect
- Per-session stats (correct, incorrect, streak, avg response time — correct answers only)
- Session summary on timer expiry
- Statistics page with per-skill cards and sparkline trend charts
- Settings (enabled skills, max number, allow negatives/decimals/fractions)
- Dashboard
- Session history persisted to localStorage
- Vercel SPA routing (`vercel.json`)

---

## Documentation

| File | Contents |
|------|----------|
| `docs/architecture.md` | Architecture overview + all ADRs |
| `docs/coding-standards.md` | Coding style, naming, testing rules |
| `docs/features.md` | Full feature roadmap |
| `docs/file-descriptions.md` | Short description of every file |

---

## Ultimate Goal

Create the highest quality open-source Algebra Fluency Trainer available.

Code quality should be comparable to a professionally maintained production application.

Architecture should support years of future expansion without requiring another major rewrite.
