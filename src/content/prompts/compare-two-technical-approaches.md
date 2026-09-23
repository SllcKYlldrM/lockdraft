---
title: "Compare Two Technical Approaches Before Committing"
description: "Get a structured, decision-ready comparison of two implementation options instead of a wishy-washy 'it depends' answer."
published: 2026-09-24
category: research
models: [Claude, GPT, Gemini]
tags: [decision-making, architecture, trade-offs]
difficulty: intermediate
prompt: |
  I'm deciding between two approaches for this problem:

  Problem/context: {{context}}
  Option A: {{option_a}}
  Option B: {{option_b}}
  Constraints that matter most (performance, team familiarity, cost, time-to-ship,
  long-term maintenance): {{constraints}}

  Compare them as:
  1. A short table: dimension (relevant to the stated constraints) × how each option
     scores on it, in one phrase each — not paragraphs.
  2. The specific scenario where Option A clearly wins, and the specific scenario
     where Option B clearly wins — not just "it depends," name the deciding factor.
  3. Given the constraints I listed, which one you'd pick and the single strongest
     reason why — one recommendation, not a hedge.
  4. The biggest risk of the option you picked, and what would make you reconsider it.

  If either option description is too vague to compare fairly, ask for the specific
  missing detail instead of assuming.
---

## When to use this

Use this at the point where a decision has narrowed to two real options and you need to actually commit, not during open-ended brainstorming — it's built to force a recommendation, not survey the space.

## Tips

- List constraints in priority order in `{{constraints}}` — the recommendation changes a lot depending on whether speed-to-ship or long-term maintainability is listed first.
- Save the output as a lightweight ADR (architecture decision record) — the "biggest risk" answer is exactly what future-you will want to check back against.
