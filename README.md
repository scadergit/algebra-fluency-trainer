# Algebra Fluency Trainer

A free, open-source browser app that helps students build **automaticity** in arithmetic and pre-algebra through timed, adaptive practice sessions.

> **Target audience:** Grades 5 through Algebra I (roughly ages 10–15).

---

## What It Does

The Algebra Fluency Trainer is a drill tool, not a lesson tool. It generates an endless stream of arithmetic problems and measures how quickly and accurately a student can answer them. The goal is to move basic facts from "I have to think about it" to "I just know it" — freeing up working memory for higher-level algebra.

### Skills covered

| Skill | Example |
|---|---|
| Addition | `7 + 8 = ?` |
| Subtraction | `15 − 6 = ?` |
| Multiplication | `9 × 7 = ?` |
| Division | `56 ÷ 8 = ?` |

### Key features

- **Timed sessions** — 30 s, 1 min, 2 min, 5 min, or 10 min
- **Countdown overlay** — "Ready… Set… Go!" before each timed session
- **Pause / resume** — with a fun icicle visual effect
- **Live session stats** — correct, incorrect, streak, average response time
- **Session summary** — shown when the timer expires
- **Statistics page** — per-skill cards with a questions-per-minute trend chart (Y-axis 0–50 QPM)
- **Multi-student support** — each student logs in with their name and a secret word; stats are stored separately per student
- **Teacher settings** — password-protected settings page lets a teacher configure skills, number ranges, and reset any student's secret word
- **Fully offline** — all data is stored in `localStorage`; no account or server required

---

## Using the App

### For students

1. Open the app (or visit the deployed URL).
2. On the **Practice** page, enter your name and choose a secret word.
   - First time? Pick any secret word you'll remember.
   - Returning? Enter the same secret word you used before.
3. Select a timer duration (or "No Timer" for free practice).
4. Answer questions as fast as you can — type the answer and press **Enter**.
5. When the session ends, review your summary and start again.

### For teachers

- Navigate to **Settings** and enter the teacher password (`teachersecret` by default — change this in the source before deploying to a class).
- **Skills** — enable or disable addition, subtraction, multiplication, and division.
- **Numbers** — set the maximum operand value (5–20) and allow negatives, fractions, or decimals.
- **History** — clear the current student's session history.
- **Students** — view all registered students and set or reset any student's secret word.

### Viewing statistics

Click **Statistics** in the nav bar. Each skill you have practiced shows a card with:
- Overall accuracy
- Latest average questions per minute
- A trend chart showing QPM across all sessions (Y-axis fixed at 0–50)

---

## Running Locally

**Prerequisites:** Node.js 18+ and npm.

```bash
# Clone the repo
git clone https://github.com/scadergit/algebra-fluency-trainer.git
cd algebra-fluency-trainer

# Install dependencies
npm install

# Start the dev server
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

### Other commands

| Command | Description |
|---|---|
| `npm run dev` | Start the Vite dev server with HMR |
| `npm run build` | Type-check and build for production |
| `npm test` | Run the Vitest unit test suite |
| `npm run preview` | Preview the production build locally |

---

## Project Structure

```
src/
├── app/              # Router, providers, App root
├── engine/           # Problem generation, skill definitions, types
│   ├── skills/       # Addition, Subtraction, Multiplication, Division
│   └── problem/      # Arithmetic problem factory
├── features/
│   ├── practice/     # Practice page, session context, components
│   ├── settings/     # Settings page and context
│   ├── statistics/   # Statistics page, SkillCard, QPM chart
│   └── student/      # Student login context (name + secret word)
└── shared/
    ├── components/   # Button, Card, Page
    ├── hooks/        # useLocalStorage, useSessionHistory
    ├── layout/       # MainLayout (nav bar)
    ├── types/        # Shared TypeScript types
    └── utils/        # localStorage helpers
```

Full documentation lives in the `docs/` folder:

| File | Contents |
|---|---|
| `docs/architecture.md` | Architecture overview and decision records |
| `docs/coding-standards.md` | Code style, naming conventions, testing rules |
| `docs/features.md` | Feature roadmap |
| `docs/file-descriptions.md` | Short description of every source file |

---

## Tech Stack

| Tool | Role |
|---|---|
| [React 19](https://react.dev) | UI framework |
| [TypeScript](https://www.typescriptlang.org) | Type safety |
| [Vite](https://vite.dev) | Build tool and dev server |
| [Tailwind CSS](https://tailwindcss.com) | Utility-first styling |
| [React Router](https://reactrouter.com) | Client-side routing |
| [Vitest](https://vitest.dev) | Unit testing |
| [Vercel](https://vercel.com) | Hosting and SPA routing |

---

## Contributing

Contributions are welcome! Here's how to get started:

### 1. Fork and clone

```bash
git clone https://github.com/<your-username>/algebra-fluency-trainer.git
cd algebra-fluency-trainer
npm install
```

### 2. Create a branch

```bash
git checkout -b feature/my-improvement
```

### 3. Make your changes

- Follow the coding standards in `docs/coding-standards.md`.
- Keep components small and focused.
- Add or update unit tests for any logic in `src/engine/`.
- Run `npm test` and `npm run build` before committing — both must pass.

### 4. Commit and push

```bash
git add .
git commit -m "feat: describe your change"
git push origin feature/my-improvement
```

### 5. Open a pull request

Open a PR against `main`. Describe what you changed and why.

### Good first contributions

- Add a new skill (e.g. exponents, square roots)
- Improve problem generation (better difficulty scaling, avoid repeats)
- Add accessibility improvements (keyboard navigation, screen reader labels)
- Improve the statistics page (more chart types, date filtering)
- Add a leaderboard or class-wide view for teachers

### Code style

- TypeScript strict mode — no `any`.
- Functional React components only.
- Tailwind for all styling — no inline styles except for dynamic SVG values.
- Tests live next to the code they test (`*.test.ts`).

---

## License

MIT — free to use, modify, and distribute.
