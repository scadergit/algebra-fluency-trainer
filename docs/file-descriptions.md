# File Descriptions

A short description of every file in the project, organized by folder.

---

## Root

| File | Description |
|------|-------------|
| `.gitignore` | Tells Git which files/folders to ignore (node_modules, dist, etc.) |
| `.oxlintrc.json` | Config for the Oxlint linter (fast Rust-based JS/TS linter) |
| `algebra-fluency-trainer.zip` | Archived snapshot of the project |
| `ARCHITECTURE_DECISIONS.md` | Documents key architectural choices and the reasoning behind them |
| `FEATURES.md` | High-level feature list and roadmap notes |
| `index.html` | Root HTML shell — Vite injects the React app bundle here |
| `package-lock.json` | Exact dependency lock file for reproducible installs |
| `package.json` | Project metadata, scripts (`dev`, `build`, `test`), and dependencies |
| `PROJECT_STATE.md` | Running notes on current project status and what's in progress |
| `README.md` | Project overview and getting-started instructions |
| `tsconfig.app.json` | TypeScript config for the app source code |
| `tsconfig.json` | Root TypeScript config (references app + node configs) |
| `tsconfig.node.json` | TypeScript config for Node/Vite tooling scripts |
| `vercel.json` | Vercel deployment config — rewrites all routes to `index.html` for SPA routing |
| `vite.config.ts` | Vite bundler configuration (plugins, aliases, build settings) |
| `vitest.config.ts` | Vitest test runner configuration |

---

## `docs/`

| File | Description |
|------|-------------|
| `docs/architecture.md` | Detailed architecture overview (layers, data flow, conventions) |
| `docs/coding-standards.md` | Coding style rules and patterns the project follows |
| `docs/file-descriptions.md` | This file — short description of every file in the project |

---

## `public/`

| File | Description |
|------|-------------|
| `public/favicon.svg` | Browser tab icon |
| `public/icons.svg` | SVG sprite sheet for UI icons |

---

## `src/`

| File | Description |
|------|-------------|
| `src/index.css` | Global styles — Tailwind import, keyframe animations (countdown pop, icicle grow/shimmer) |
| `src/main.tsx` | App entry point — mounts the React tree into `#root` |

### `src/app/`

| File | Description |
|------|-------------|
| `src/app/App.tsx` | Root component — wraps the app in providers and renders the router |
| `src/app/providers.tsx` | Composes all context providers (Settings, PracticeSession, etc.) |
| `src/app/router.tsx` | React Router route definitions (Dashboard, Practice, Statistics, Settings) |

### `src/assets/`

| File | Description |
|------|-------------|
| `src/assets/hero.png` | Hero/splash image asset |
| `src/assets/vite.svg` | Vite logo (leftover from scaffold) |

---

## `src/engine/` — Core math engine (framework-agnostic)

| File | Description |
|------|-------------|
| `src/engine/index.ts` | Public barrel export for the engine |
| `src/engine/questionEngine.ts` | Picks a random enabled skill and generates a question |
| `src/engine/types.ts` | Shared engine-level TypeScript types |

### `src/engine/models/`

| File | Description |
|------|-------------|
| `EvaluationResult.ts` | Type/class representing whether an answer was correct |
| `GeneratedProblem.ts` | Wraps a Question with an `evaluate()` method and metadata |
| `index.ts` | Barrel export for all models |
| `Question.ts` | The `Question` type — holds the prompt, topic, and answer |
| `SkillMetadata.ts` | Metadata shape for a skill (id, title, category) |

### `src/engine/problem/`

| File | Description |
|------|-------------|
| `createArithmeticProblem.ts` | Factory that builds a `GeneratedProblem` from two operands and an operator |
| `types.ts` | Types specific to problem creation |

### `src/engine/random/`

| File | Description |
|------|-------------|
| `randomInteger.test.ts` | Unit tests for `randomInteger` |
| `randomInteger.ts` | Utility that returns a random integer in a given range |

### `src/engine/skills/`

| File | Description |
|------|-------------|
| `arithmetic.ts` | Registers all four arithmetic skills into the engine |
| `index.ts` | Barrel export for skills |
| `MathSkill.ts` | The `MathSkill` interface — every skill must implement `generate()` |
| `registry.ts` | Skill registry — maps skill IDs to their implementations |
| `types.ts` | Shared skill-level types |
| `Addition/index.ts` | Addition skill — generates `a + b` problems |
| `Addition/index.test.ts` | Unit tests for the Addition skill |
| `Division/index.ts` | Division skill — generates `a ÷ b` problems with integer answers |
| `Division/index.test.ts` | Unit tests for the Division skill |
| `Multiplication/index.ts` | Multiplication skill — generates `a × b` problems |
| `Multiplication/index.test.ts` | Unit tests for the Multiplication skill |
| `Subtraction/index.ts` | Subtraction skill — generates `a - b` problems |
| `Subtraction/index.test.ts` | Unit tests for the Subtraction skill |

---

## `src/features/` — UI feature modules

### `src/features/dashboard/`

| File | Description |
|------|-------------|
| `DashboardPage.tsx` | Home/landing page with navigation cards to Practice, Statistics, and Settings |

### `src/features/practice/`

| File | Description |
|------|-------------|
| `PracticePage.tsx` | Main practice screen — duration picker, question card, stats panel, timer with icicle pause effect |

#### `src/features/practice/components/`

| File | Description |
|------|-------------|
| `CountdownOverlay.tsx` | "Ready… Set… Go!" overlay shown before a timed session starts |
| `QuestionCard.tsx` | Displays the current math problem and handles answer input |
| `SessionSummary.tsx` | End-of-session results card (correct, incorrect, streak, avg time) |
| `TimerDisplay.tsx` | Renders the countdown clock; turns blue when paused |

#### `src/features/practice/session/`

| File | Description |
|------|-------------|
| `PracticeSessionContext.tsx` | React context managing all live session state — streaks, counts, per-skill response time averages (correct answers only) |

### `src/features/settings/`

| File | Description |
|------|-------------|
| `SettingsContext.tsx` | React context that loads/saves user settings from localStorage |
| `SettingsPage.tsx` | Settings UI — toggle enabled skills and number range options |

### `src/features/statistics/`

| File | Description |
|------|-------------|
| `AvgTimeChart.tsx` | Sparkline chart showing avg response time trend across sessions |
| `SkillCard.tsx` | Per-skill stats card (accuracy, prompts, latest avg, trend chart) |
| `StatisticsPage.tsx` | Statistics page — aggregates session history into per-skill `SkillCard`s |

---

## `src/shared/` — Reusable utilities, hooks, and components

### `src/shared/components/`

| File | Description |
|------|-------------|
| `Button.tsx` | Generic styled button component |
| `Card.tsx` | Generic white rounded card container |
| `Page.tsx` | Page wrapper with a title heading and consistent padding |

### `src/shared/hooks/`

| File | Description |
|------|-------------|
| `useLocalStorage.ts` | Generic hook for reading/writing a value to localStorage with JSON serialization |
| `useSessionHistory.ts` | Hook that manages the array of completed `SessionRecord`s in localStorage |

### `src/shared/layout/`

| File | Description |
|------|-------------|
| `MainLayout.tsx` | App shell — top nav bar + main content area |

### `src/shared/types/`

| File | Description |
|------|-------------|
| `settings.ts` | Re-exports `AppSettings` from `src/types` (convenience alias) |

### `src/shared/utils/`

| File | Description |
|------|-------------|
| `storage.ts` | Low-level localStorage read/write helpers |

---

## `src/types/` — Global TypeScript types

| File | Description |
|------|-------------|
| `AppSettings.ts` | `AppSettings` type — enabled skills, max number, allow negatives/decimals/fractions |
| `index.ts` | Barrel export for all global types |
| `SessionRecord.ts` | `SessionRecord` type — shape of a saved completed session (scores, skill breakdowns, timestamps) |
