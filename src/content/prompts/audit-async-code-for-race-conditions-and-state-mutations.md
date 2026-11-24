---
title: Audit Async Code for Race Conditions and State Mutations
description: >-
  Audit concurrent or async code to detect race conditions, shared state
  mutations, and non-deterministic edge cases under load.
published: 2026-11-24T20:46:20.670Z
draft: false
category: coding
models:
  - Claude
  - GPT
  - Gemini
tags:
  - debugging
difficulty: intermediate
prompt: >-
  Act as a senior systems and concurrency engineer. Audit the following code
  snippet for race conditions, shared state mutations, memory leaks, unhandled
  promise/async edge cases, and thread-safety bugs.


  Target Language & Runtime: {{LANGUAGE_AND_FRAMEWORK}}

  Concurrency Context: {{CONCURRENCY_CONTEXT}}

  Known Symptoms or Edge Cases (if any): {{KNOWN_ISSUES_OR_SYMPTOMS}}


  Code to Audit:

  ```

  {{CODE_SNIPPET}}

  ```


  Provide your output using the following structure:


  1. **Assumptions & Missing Context**: Explicitly state any assumptions you had
  to make about the runtime environment, process model, or shared resources that
  were not provided. If crucial context is missing, flag it explicitly instead
  of guessing.

  2. **Vulnerability & Race Condition Analysis**: List each identified issue
  with a severity rating (Critical, High, Medium, Low), the specific line
  numbers or functions involved, and the exact step-by-step execution sequence
  that triggers the failure.

  3. **Missing Safeguards**: Specify what concurrency primitives (e.g., locks,
  mutexes, atomic operations, database transaction isolation, idempotency keys)
  are missing.

  4. **Refactored Code**: Provide a clean, robust, production-ready refactored
  version of the code that fixes all identified concurrency issues while
  preserving the original business logic.

  5. **Verification & Stress Testing Strategy**: Write a specific unit test
  setup or stress testing approach designed to reproduce the concurrency failure
  under simulated load.
---

## When to use this

Reach for this prompt when reviewing code that handles asynchronous I/O, background jobs, multi-threaded worker pools, or shared state across concurrent requests. It is especially useful for diagnosing intermittent or non-deterministic production bugs that occur under heavy traffic.

## Tips

- Specify the exact process layout in {{CONCURRENCY_CONTEXT}} (e.g., 'Node.js cluster with 4 workers sharing a Redis cache' vs. 'Single-threaded Python asyncio event loop') so the AI recommends the correct synchronization primitives.
- If the code interacts with a database, paste relevant SQL schema fragments or index details so the model can evaluate database-level transaction locks (e.g., SELECT FOR UPDATE).
