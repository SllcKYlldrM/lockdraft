---
title: Pre-Implementation Risk & Edge Case Audit
description: >-
  Stress-test a proposed code snippet, config, or workflow against hidden risks,
  race conditions, and failure modes before you commit.
published: 2026-10-28T16:47:07.778Z
draft: false
category: research
models:
  - Claude
  - GPT
tags:
  - automation
difficulty: intermediate
prompt: >-
  You are a senior automation engineer performing a pre-implementation risk
  audit.


  Review the following technical proposal and identify hidden risks, failure
  modes, and edge cases that could cause silent failures or production
  incidents.


  ## Input Data

  **Context:**

  {{context}}


  **Proposed Logic / Configuration / Code Snippet:**

  {{proposal}}


  **Environment / Constraints:**

  {{constraints}}


  ## Instructions

  1. First, evaluate whether the input lacks critical information required for a
  rigorous audit (e.g., missing error handling, unknown data volume, undefined
  idempotency guarantees). If gaps exist, list them explicitly at the top of
  your response. State any assumptions you are making based on industry
  standards, or request clarification before proceeding.

  2. Produce a numbered list of findings organized into these categories:
     - **Critical Risks:** Issues that will likely cause failure, data corruption, or security exposure.
     - **Edge Cases:** Scenarios under normal operation where behavior becomes undefined, incorrect, or inefficient.
     - **Operational Blind Spots:** Weaknesses related to observability, debugging, scaling, or recovery that make incidents hard to manage.
  3. For each item, provide a concise explanation of the mechanism causing the
  risk and a concrete mitigation or verification step.

  4. Focus strictly on weaknesses and risks. Do not offer general praise. If no
  high-confidence risks are found, explicitly state "No significant risks
  identified" and summarize the factors supporting that conclusion.

  5. Maintain a pragmatic tone. Prioritize reliability and maintainability
  concerns over theoretical perfection.
---

## When to use this

Use this before implementing a non-trivial automation step or refactoring core business logic. It helps uncover race conditions, timeout traps, and silent failure modes that aren't obvious during casual review, saving time on post-deployment debugging.

## Tips

- Include your error handling, retry logic, and state transitions in the `{{proposal}}` field; omitting these often causes the model to overlook the most common failure paths.
- After receiving the audit, follow up by asking the model to convert the identified 'Edge Cases' into a checklist of assertions or unit tests to validate your implementation.
