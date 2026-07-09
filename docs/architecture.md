# Algebra Fluency Trainer Architecture

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

# Layers

```
src

app/

components/

engine/

features/
```

## app

Application bootstrapping.

Routing.

Providers.

No business logic.

---

## components

Reusable UI components.

Examples

Button

Card

Slider

Dialog

ProgressBar

No math logic.

---

## features

Application features.

Practice

Settings

Statistics

Home

Each feature owns its React components.

---

## engine

Pure TypeScript.

No React.

No browser APIs.

Contains every piece of math logic.

---

# Engine

```
engine/

    models/

    random/

    registry/

    session/

    skills/

    utils/
```

---

# Models

Question

GeneratedProblem

EvaluationResult

These are immutable value objects.

---

# Question

Represents what the student sees.

Contains

- id
- prompt
- topic
- difficulty

Never contains the answer.

---

# GeneratedProblem

Represents everything required to solve and evaluate a problem.

Contains

- Question
- metadata
- evaluate()
- explain()

---

# EvaluationResult

Contains

- correct
- message

Expandable later.

---

# Skills

Every skill owns:

- generation
- evaluation
- explanation
- metadata

Examples

Addition

Subtraction

Combine Like Terms

Multi-Step Equations

---

# Skill Registry

Single source of truth.

Responsible for

- registration
- lookup
- enabled skills

The Settings page never hard-codes skills.

---

# Practice Session

Owns

- current problem
- statistics
- timer
- streak
- history

The session survives page navigation.

Eventually it survives browser restarts.

---

# Statistics

Three scopes.

Session

Lifetime

Daily

---

# Testing

Every skill includes unit tests.

React components are tested only for rendering and interaction.

Engine logic is heavily tested.

---

# Dependency Rules

React UI

↓

Practice Session

↓

Math Engine

↓

Nothing

Dependencies only flow downward.

The engine never imports anything from features or components.
