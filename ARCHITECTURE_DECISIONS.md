# ARCHITECTURE_DECISIONS.md

# Architecture Decision Record (ADR)

This document records the architectural decisions for the Algebra Fluency Trainer project.

Its purpose is to explain **why** decisions were made so future contributors understand the intent before making changes.

---

# Guiding Philosophy

The application is expected to grow from simple arithmetic into a complete Algebra I fluency platform.

The architecture should support years of expansion without major rewrites.

The primary design goals are:

1. Correctness
2. Maintainability
3. Extensibility
4. Testability
5. Student experience

---

# ADR-001

## The Engine Owns All Mathematics

### Decision

All mathematical logic lives inside the engine.

The UI never creates problems.

The UI never evaluates answers.

The UI never knows mathematical rules.

### Reason

Keeping mathematics separate from presentation makes the engine reusable and independently testable.

The engine could eventually support:

- Web
- Mobile
- Desktop
- CLI
- Automated worksheet generation

without modification.

---

# ADR-002

## The UI Owns Presentation

### Decision

React components display data.

React components never generate mathematical content.

### Reason

Presentation changes frequently.

Mathematics changes rarely.

Keeping them separate greatly simplifies maintenance.

---

# ADR-003

## One Folder Per Skill

### Decision

Every mathematical topic has its own folder.

Example:

```
Addition/

    AdditionSkill.ts

    AdditionSkill.test.ts

    index.ts
```

Future examples:

```
Fractions/

OrderOfOperations/

CombineLikeTerms/

OneStepEquations/
```

### Reason

Everything related to a topic remains together.

Adding a new skill should require creating only one folder.

---

# ADR-004

## Skills Implement a Common Interface

### Decision

Every skill implements the same interface.

Example:

```ts
interface MathSkill {

    id: string;

    title: string;

    category: string;

    generate(settings): Question;

}
```

Future methods may include:

```ts
evaluate()

hint()

explain()

validate()
```

### Reason

The engine should treat every skill identically.

This enables:

- mixed practice
- adaptive learning
- weighted randomization
- teacher-defined skill sets

without special cases.

---

# ADR-005

## Favor Composition Over Inheritance

### Decision

Skills are plain objects or small classes.

Avoid inheritance hierarchies.

### Reason

Composition is easier to understand, easier to test, and scales better as the number of skills grows.

---

# ADR-006

## Small Files

### Decision

Each file should have one responsibility.

### Reason

Small files are easier to review, test, and modify.

---

# ADR-007

## Strong Typing

### Decision

Avoid `any`.

Prefer explicit interfaces.

### Reason

The compiler should detect mistakes before runtime.

---

# ADR-008

## One Source of Truth

### Decision

Each concept should have one canonical model.

Examples:

- Question
- Skill
- EvaluationResult
- Settings

### Reason

Duplicate models eventually diverge.

A single definition prevents inconsistencies.

---

# ADR-009

## Behavior Before Optimization

### Decision

Correct behavior is more important than micro-optimizations.

### Reason

The application generates only one problem at a time.

Readability is more valuable than premature optimization.

---

# ADR-010

## Every Skill Is Independently Testable

### Decision

Each skill should have its own unit tests.

### Reason

A bug in one skill should not affect confidence in the rest of the engine.

---

# ADR-011

## Keyboard First

### Decision

The application is optimized for keyboard use.

Examples:

- Enter submits answers.
- Focus automatically returns to the answer box.
- Minimal mouse interaction.

### Reason

Students should solve problems quickly without unnecessary clicks.

---

# ADR-012

## Immediate Feedback

### Decision

Students receive immediate correctness feedback after every answer.

### Reason

Fast feedback improves learning and keeps practice engaging.

---

# ADR-013

## Statistics Persist Across Navigation

### Decision

Navigating between pages should not reset a practice session.

Only an explicit "Reset Session" action clears session statistics.

### Reason

Students often adjust settings or view statistics during a practice session.

Their progress should not be lost.

---

# ADR-014

## Backward-Compatible Refactoring

### Decision

Whenever possible:

1. Introduce new abstractions.
2. Migrate existing code.
3. Remove obsolete code.

Avoid rewriting large portions of the application in one step.

### Reason

Small, compiling commits reduce risk and simplify debugging.

---

# ADR-015

## Compile After Every Commit

Every commit must successfully run:

```bash
git status

npx tsc --noEmit

npm test

npm run dev
```

No commit should knowingly leave the repository in a broken state.

---

# ADR-016

## Stable Architecture

Architecture changes require a compelling reason.

Examples:

- removes significant complexity
- enables a major new feature
- fixes a structural limitation

Architecture should not change simply because another design appears cleaner.

---

# ADR-017

## Feature Development Comes Before Perfection

After the engine architecture is stable, development effort should shift toward building mathematical content rather than continuing to redesign the engine.

The goal is to create value for students, not endlessly refine abstractions.

---

# ADR-018

## Student Experience Is the Primary Metric

When choosing between two technically sound solutions, prefer the one that produces the better learning experience.

Examples:

- fewer clicks
- faster practice
- clearer feedback
- better explanations
- consistent interaction

---

# ADR-019

## Documentation Is Part of the Codebase

Major architectural decisions should be documented here.

The documentation should evolve alongside the project.

Future contributors should understand *why* the architecture exists before modifying it.

---

# ADR-020

## Professional Engineering Practices

The project should be developed as though it were a production application.

This includes:

- meaningful commit messages
- code reviews
- unit tests
- clear documentation
- incremental refactoring
- consistent style

The long-term objective is to create an open-source project that other developers can confidently contribute to and educators can trust in the classroom.