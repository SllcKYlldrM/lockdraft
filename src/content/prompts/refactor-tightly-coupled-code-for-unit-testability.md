---
title: Refactor Tightly-Coupled Code for Unit Testability
description: >-
  Refactor untestable code by isolating side-effects with dependency injection
  and generating isolated unit tests.
published: 2026-11-07T16:35:38.212Z
draft: false
category: coding
models:
  - Claude
  - GPT
  - Gemini
tags:
  - testing
difficulty: intermediate
prompt: >-
  Act as a senior software architect specializing in test-driven development and
  clean architecture.


  Analyze the following code written in {{programming_language}} and refactor it
  so that it can be cleanly unit-tested without relying on live databases,
  external APIs, filesystem access, or non-deterministic state (such as system
  time or random numbers).


  ## Input Details

  - **Language/Runtime:** {{programming_language}}

  - **Testing Framework:** {{testing_framework}}

  - **External Dependencies & Context:** {{external_dependencies_notes}}


  ## Source Code

  ```

  {{code_snippet}}

  ```


  ## Response Requirements

  Provide your response in the following strict 4-part structure:


  1. **Untestability Audit**: Briefly list each specific side effect, hardcoded
  dependency, or non-deterministic behavior in the input code that prevents
  effective unit testing.

  2. **Refactored Production Code**: Write clean, production-ready code in
  {{programming_language}} that decouples these dependencies using dependency
  injection, interfaces/adapters, or parameterization. Maintain exact functional
  equivalence.

  3. **Unit Test Suite**: Write complete unit test cases using
  {{testing_framework}} that achieve high coverage for happy paths, error
  handling, and edge cases using mocks/stubs for all external side effects.

  4. **Missing Information & Assumptions**: Explicitly list any missing type
  definitions, unstated framework conventions, or ambiguous business logic you
  had to assume. If critical context is missing that prevents safe refactoring,
  state what is needed rather than guessing.
---

## When to use this

Reach for this prompt when legacy or rapidly-prototyped code is difficult to unit test because it makes direct network calls, database queries, or system clock reads. It helps you isolate side effects through dependency injection while providing ready-to-use unit test mocks.

## Tips

- Paste relevant type definitions or import statements alongside {{code_snippet}} so the model doesn't have to invent domain types.
- Specify your exact testing library preferences in {{testing_framework}} (e.g., 'Jest with ts-jest' or 'Pytest with unittest.mock') for directly executable code.
