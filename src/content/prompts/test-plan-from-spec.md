---
title: "Generate a Test Plan from a Feature Spec"
description: "Turn a feature description into a concrete test plan that actually covers edge cases, not just the happy path."
published: 2026-09-24
category: coding
models: [Claude, GPT]
tags: [testing, qa, planning]
difficulty: intermediate
prompt: |
  Here is a feature spec:

  {{feature_spec}}

  Write a test plan covering:
  1. Happy-path cases — the core behavior working as intended.
  2. Boundary/edge cases — empty input, maximum size, zero, negative numbers, unicode,
     concurrent access, whichever apply to this feature specifically.
  3. Failure/error cases — what should happen when a dependency is unavailable, input
     is invalid, or a precondition isn't met.
  4. Cases that touch existing behavior — anything this feature could plausibly break
     that isn't obviously "this feature" (a shared cache, a rate limit, a permission
     check).

  For each case, give: a short name, the setup/input, and the expected outcome. Flag
  any case where the spec doesn't actually say what the expected outcome should be —
  those are spec gaps, not test-writing problems, and should be called out separately
  rather than guessed at.
---

## When to use this

Run this after a spec is written but before implementation starts — the "spec gaps" the model flags are often faster and cheaper to resolve before code exists than after.

## Tips

- If the output leans heavily toward happy-path cases, ask explicitly: "now go deeper on the failure and boundary cases — I have enough happy-path coverage."
- Feed the resulting list straight into your test framework's `describe`/`it` blocks as a skeleton — it saves the blank-page problem more than it saves the actual test-writing.
