# Coding Standards

## General

- TypeScript strict mode
- No `any`
- Composition over inheritance
- Small focused files — target under 200 lines, hard limit 300 lines
- One responsibility per component or file

Every commit must:

- compile (`npx tsc --noEmit`)
- pass tests (`npm test`)
- run (`npm run dev`)

No dead code.

No commented-out code.

No TODOs without GitHub issues.

---

## Formatting

Prefer multi-line function signatures:

```ts
function doSomething(
  first: string,
  second: number,
) {

}
```

over single-line when parameters are non-trivial:

```ts
function doSomething(first: string, second: number) {}
```

Always use explicit imports:

```ts
import type { Question } from "./Question";
```

Keep lines reasonably short.

---

## Naming

| Kind | Convention |
|------|-----------|
| Classes | PascalCase |
| Interfaces | PascalCase |
| Functions | camelCase |
| Constants | camelCase |
| Skill folders | PascalCase |
| All other folders | camelCase |

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

Components contain presentation only.

No business logic in components.

---

## State

| Layer | Owns |
|-------|------|
| React | UI state |
| PracticeSession | Practice state |
| Engine | Math state |

---

## Testing

Every engine feature should have tests.

Every math skill should have tests.

Every bug fix includes a regression test.

Random generators should have deterministic tests where possible.

---

## Architecture

Prefer composition over inheritance.

Prefer interfaces over abstract classes.

Avoid singleton patterns.

Dependencies only flow downward:

```
React UI
↓
Practice Session
↓
Math Engine
↓
Nothing
```
