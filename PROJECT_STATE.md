# PROJECT_STATE.md

# Algebra Fluency Trainer

## Project Goal

Build the best browser-based Algebra Fluency Trainer possible.

The application should eventually support students from approximately Grade 5 through Algebra I.

The application is **not** intended to teach lessons.

It is intended to build automaticity through thousands of carefully generated practice problems with excellent feedback.

---

# Technology

- React
- TypeScript
- Vite
- Tailwind CSS
- React Context
- Vitest

---

# Current Status

Arithmetic practice works.

Implemented:

- Addition
- Subtraction
- Multiplication
- Division

Current features:

- Settings
- Statistics
- Practice
- Dashboard

---

# Development Philosophy

The application should feel polished.

We prioritize:

1. Correctness
2. Maintainability
3. Student experience
4. Performance

over quick implementation.

---

# Coding Standards

## General

- TypeScript strict mode
- No `any`
- Composition over inheritance
- Small focused files
- One responsibility per component

---

## Formatting

Prefer

```ts
function doSomething(
  first: string,
  second: number,
) {

}
```

over

```ts
function doSomething(first: string, second: number) {}
```

---

Always use explicit imports.

Prefer

```ts
import type { Question } from "./Question";
```

---

Keep lines reasonably short.

---

# React Standards

Use

- Functional components
- Hooks
- Context where appropriate

Avoid class components.

---

# Testing

Every engine feature should have tests.

Every math skill should have tests.

Random generators should have deterministic tests where possible.

---

# Long-Term Architecture

The engine owns all math.

The UI never generates math.

Target architecture:

```
src/
    engine/

        MathEngine.ts

        models/

        random/

        session/

        registry/

        skills/
```

---

# Skill Architecture

Every math topic lives in its own folder.

Example:

```
Addition/

    AdditionSkill.ts

    AdditionSkill.test.ts

    index.ts
```

Future:

```
Fractions/

OrderOfOperations/

DistributiveProperty/

CombineLikeTerms/

SolveOneStepEquations/

SolveTwoStepEquations/

SystemsOfEquations/

Quadratics/
```

---

# MathSkill Interface

Target interface:

```ts
interface MathSkill {

    id: string;

    title: string;

    category: string;

    generate(
        settings
    ): Question;

}
```

Future versions may expand with

```ts
evaluate()

explain()

hint()
```

---

# Engine Principles

The engine should know nothing about React.

The UI should know almost nothing about mathematics.

---

# Current Refactoring Status

Completed

- Skill folders created

```
skills/

    Addition/

    Subtraction/

    Multiplication/

    Division/
```

- Introduced MathSkill interface.

- Registry now works with MathSkill objects.

- Existing arithmetic generators continue to power the application.

No functionality should have changed.

---

# Immediate Next Goal

Complete the engine refactor without changing behavior.

The migration should:

- never break the application
- never redesign architecture mid-stream
- compile after every commit

---

# Future Engine

Eventually:

```
MathEngine

↓

Skill Registry

↓

MathSkill

↓

Generated Problem

↓

UI
```

---

# Student Experience Goals

Practice should feel fast.

Keyboard-first.

Answer box automatically focused.

Immediate feedback.

Minimal clicks.

Gamification should be subtle.

---

# Planned Features

## Arithmetic

- Mixed arithmetic
- Fact families
- Timed drills

---

## Fractions

- Simplify
- Compare
- Add
- Subtract
- Multiply
- Divide

---

## Integers

- Signed arithmetic
- Absolute value

---

## Algebra

- Evaluate expressions

- Order of operations

- Exponents

- Combine like terms

- Distribution

- Factoring

- One-step equations

- Two-step equations

- Multi-step equations

- Variables both sides

- Literal equations

- Systems

- Inequalities

- Radicals

- Polynomials

- Quadratics

---

# Statistics

Track

- Correct

- Incorrect

- Skipped

- Accuracy

- Average response time

Future:

- mastery

- streaks

- spaced repetition

---

# Settings

Current

- max number

- allow negatives

- allow fractions

- allow decimals

- enabled skills

Future

difficulty profiles

adaptive learning

custom skill sets

---

# UI Goals

Modern.

Minimal.

Fast.

No unnecessary animations.

Optimized for keyboard use.

---

# Commit Workflow

Every commit must include:

## Objective

## Estimated Time

## Files Created

Include

mkdir

touch

commands.

## Files Modified

Provide complete contents unless very large.

## Files Deleted

## Verification

Run

```
git status

npx tsc --noEmit

npm test

npm run dev
```

Every commit must compile.

---

# Rules

Never redesign architecture in the middle of implementation.

Never ask the developer to "do the same".

Every file change must be explicitly listed.

Always provide exact mkdir/touch commands.

Never assume repository contents.

Inspect first.

Then modify.

One compiling commit at a time.

---

# Future Wishlist

Adaptive difficulty.

Achievements.

Daily practice.

Teacher dashboard.

Student profiles.

Cloud synchronization.

Printable worksheets.

AI-generated explanations.

Voice support.

Touch-friendly mode.

---

# Ultimate Goal

Create the highest quality open-source Algebra Fluency Trainer available.

Code quality should be comparable to a professionally maintained production application.

Architecture should support years of future expansion without requiring another major rewrite.