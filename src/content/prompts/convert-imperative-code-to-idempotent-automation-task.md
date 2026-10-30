---
title: Convert Imperative Code to Idempotent Automation Task
description: >-
  Transform fragile, one-off scripts into safe, idempotent tasks with explicit
  state checks, failure handling, and execution safeguards.
published: 2026-10-30T16:48:26.741Z
draft: false
category: coding
models:
  - Claude
  - GPT
  - Gemini
tags:
  - automation
difficulty: intermediate
prompt: >-
  You are a principal backend engineer specializing in idempotent system design
  and automation workflows.


  Transform the following non-idempotent or imperative script into a robust,
  idempotent implementation that can be safely executed multiple times without
  creating duplicate resources or unintended side effects.


  ### Input Context

  - Programming Language / Environment: {{programming_language}}

  - Target System / API: {{target_system}}

  - Source Code / Script:

  ```

  {{source_code}}

  ```

  - Expected Outcome & Side Effects: {{expected_behavior}}


  ### Requirements

  1. Identify all state-changing operations (database writes, API POST calls,
  file creations, external service calls).

  2. Add pre-execution checks or target system state verifications before
  applying mutations.

  3. Include clean error handling, logging, and state reporting.

  4. If essential details about the target API's idempotency features (such as
  custom header support or primary key constraints) are missing from the input,
  explicitly flag them as missing rather than guessing.


  ### Output Format

  Produce your response using the following structured format:


  1. **Idempotency Risk Audit**: A bulleted list of non-idempotent operations in
  the original code and what happens if re-run after a partial failure.

  2. **Strategy & Pre-Checks**: An explanation of how current state will be
  checked prior to executing any mutation.

  3. **Refactored Idempotent Code**: The complete, production-ready code in
  {{programming_language}} with inline comments explaining the state safeguards.

  4. **Verification Test Plan**: Step-by-step instructions or test cases to
  verify that executing the code twice yields the exact same end state as
  executing it once.

  5. **Missing Context & Assumptions**: Any missing details or assumed API
  behaviors that require validation before deployment.
---

## When to use this

Reach for this prompt when converting a quick shell script, database migration, or cron job into a production-grade automation workflow. It ensures that running your task multiple times—whether due to retry policies, network failures, or partial crashes—produces the exact same outcome without duplicate records or orphaned resources.

## Tips

- Include specific details in your context about how your system handles uniqueness (e.g., database primary keys, unique file paths, or API idempotency keys) so the pre-checks match your infrastructure.
- After receiving the refactored code, ask the model to write an integration test spec to test the script under simulated network timeouts and partial crash conditions.
