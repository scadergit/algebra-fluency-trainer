# Coding Standards

## General

Every commit must:

- compile
- pass tests
- run

---

No dead code.

No commented-out code.

No TODOs without GitHub issues.

---

## Engine

The engine:

- never imports React
- never imports browser APIs
- never mutates models
- never manipulates the DOM

---

## Skills

Each skill owns:

- generation
- evaluation
- explanation

Every skill includes unit tests.

---

## Components

Components contain presentation.

No business logic.

---

## State

React owns UI state.

PracticeSession owns practice state.

Engine owns math state.

---

## File Size

Target:

<200 lines

Hard limit:

300 lines

---

## Testing

Every bug fix includes a regression test.

Every new skill includes tests.

---

## Naming

Classes

PascalCase

Interfaces

PascalCase

Functions

camelCase

Constants

camelCase

Folders

PascalCase for skills

camelCase elsewhere

---

## Architecture

Prefer composition over inheritance.

Prefer interfaces over abstract classes.

Avoid singleton patterns.
