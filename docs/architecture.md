# Architecture

## Philosophy

The application consists of three independent layers.

```
UI

↓

Practice Session

↓

Math Engine
```

The UI never contains math logic.

The engine never imports React.

The engine can eventually be reused by:

- React
- React Native
- Electron
- Node
- CLI

without modification.

---

## Layers

```
src/
    app/          Application bootstrapping, routing, providers
    engine/       Pure TypeScript math engine — no React, no browser APIs
    features/     Application features (Practice, Settings, Statistics, Dashboard)
    shared/       Reusable components, hooks, layout, utilities
    types/        Global TypeScript types
```

### app

Application bootstrapping, routing, and providers. No business logic.

### engine

Pure TypeScript. No React. No browser APIs. Contains every piece of math logic.

### features

Application features. Each feature owns its React components.

### shared

Reusable UI components, hooks, layout shell, and utilities.

---

## Engine Structure

```
engine/
    models/       Immutable value objects (Question, GeneratedProblem, EvaluationResult)
    problem/      Problem factory functions
    random/       Random number utilities
    skills/       One folder per math skill
```

---

## Models

**Question** — Represents what the student sees. Contains id, prompt, topic, difficulty. Never contains the answer.

**GeneratedProblem** — Wraps a Question with `evaluate()` and metadata.

**EvaluationResult** — Contains `correct` and `message`. Expandable later.

---

## Skills

Every skill lives in its own folder:

```
Addition/
    index.ts
    index.test.ts
```

Every skill implements the `MathSkill` interface:

```ts
interface MathSkill {
    id: string;
    title: string;
    category: string;
    generate(settings): Question;
}
```

Future methods may include `evaluate()`, `hint()`, `explain()`, `validate()`.

---

## Skill Registry

Single source of truth for all registered skills.

Responsible for registration, lookup, and enabled skill filtering.

The Settings page never hard-codes skill names.

---

## Practice Session

Owns current problem, statistics, timer, streak, and history.

The session survives page navigation.

---

## Dependency Rules

```
React UI
↓
Practice Session
↓
Math Engine
↓
Nothing
```

Dependencies only flow downward. The engine never imports anything from features or components.

---

# Architecture Decision Records

This section records the key architectural decisions and the reasoning behind them.

---

## ADR-001 — The Engine Owns All Mathematics

**Decision:** All mathematical logic lives inside the engine. The UI never creates problems, evaluates answers, or knows mathematical rules.

**Reason:** Keeping mathematics separate from presentation makes the engine reusable and independently testable. The engine could eventually support web, mobile, desktop, CLI, and worksheet generation without modification.

---

## ADR-002 — The UI Owns Presentation

**Decision:** React components display data. React components never generate mathematical content.

**Reason:** Presentation changes frequently. Mathematics changes rarely. Keeping them separate greatly simplifies maintenance.

---

## ADR-003 — One Folder Per Skill

**Decision:** Every mathematical topic has its own folder containing its implementation and tests.

**Reason:** Everything related to a topic remains together. Adding a new skill should require creating only one folder.

---

## ADR-004 — Skills Implement a Common Interface

**Decision:** Every skill implements the same `MathSkill` interface.

**Reason:** The engine treats every skill identically. This enables mixed practice, adaptive learning, weighted randomization, and teacher-defined skill sets without special cases.

---

## ADR-005 — Favor Composition Over Inheritance

**Decision:** Skills are plain objects or small classes. Avoid inheritance hierarchies.

**Reason:** Composition is easier to understand, easier to test, and scales better as the number of skills grows.

---

## ADR-006 — Small Files

**Decision:** Each file should have one responsibility. Target under 200 lines; hard limit 300 lines.

**Reason:** Small files are easier to review, test, and modify.

---

## ADR-007 — Strong Typing

**Decision:** Avoid `any`. Prefer explicit interfaces.

**Reason:** The compiler should detect mistakes before runtime.

---

## ADR-008 — One Source of Truth

**Decision:** Each concept should have one canonical model (Question, Skill, EvaluationResult, Settings).

**Reason:** Duplicate models eventually diverge. A single definition prevents inconsistencies.

---

## ADR-009 — Behavior Before Optimization

**Decision:** Correct behavior is more important than micro-optimizations.

**Reason:** The application generates only one problem at a time. Readability is more valuable than premature optimization.

---

## ADR-010 — Every Skill Is Independently Testable

**Decision:** Each skill should have its own unit tests.

**Reason:** A bug in one skill should not affect confidence in the rest of the engine.

---

## ADR-011 — Keyboard First

**Decision:** The application is optimized for keyboard use. Enter submits answers. Focus automatically returns to the answer box. Minimal mouse interaction required.

**Reason:** Students should solve problems quickly without unnecessary clicks.

---

## ADR-012 — Immediate Feedback

**Decision:** Students receive immediate correctness feedback after every answer.

**Reason:** Fast feedback improves learning and keeps practice engaging.

---

## ADR-013 — Statistics Persist Across Navigation

**Decision:** Navigating between pages does not reset a practice session. Only an explicit "Reset Session" action clears session statistics.

**Reason:** Students often adjust settings or view statistics during a practice session. Their progress should not be lost.

---

## ADR-014 — Backward-Compatible Refactoring

**Decision:** Introduce new abstractions, migrate existing code, then remove obsolete code. Avoid rewriting large portions of the application in one step.

**Reason:** Small, compiling commits reduce risk and simplify debugging.

---

## ADR-015 — Compile After Every Commit

Every commit must successfully compile, pass tests, and run.

---

## ADR-016 — Stable Architecture

Architecture changes require a compelling reason: removes significant complexity, enables a major new feature, or fixes a structural limitation. Architecture should not change simply because another design appears cleaner.

---

## ADR-017 — Feature Development Comes Before Perfection

After the engine architecture is stable, development effort should shift toward building mathematical content rather than continuing to redesign the engine. The goal is to create value for students, not endlessly refine abstractions.

---

## ADR-018 — Student Experience Is the Primary Metric

When choosing between two technically sound solutions, prefer the one that produces the better learning experience: fewer clicks, faster practice, clearer feedback, better explanations, consistent interaction.

---

## ADR-019 — Documentation Is Part of the Codebase

Major architectural decisions should be documented here. The documentation should evolve alongside the project. Future contributors should understand *why* the architecture exists before modifying it.

---

## ADR-020 — Professional Engineering Practices

The project should be developed as though it were a production application: meaningful commit messages, unit tests, clear documentation, incremental refactoring, and consistent style.
