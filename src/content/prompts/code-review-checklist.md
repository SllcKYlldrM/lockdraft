---
title: "Thorough Code Review"
description: "Have an AI model review a diff for correctness, security, and maintainability issues before you open a PR."
published: 2026-09-10
category: coding
models: [Claude, GPT]
tags: [code-review, pull-requests, quality]
difficulty: beginner
prompt: |
  You are reviewing the following code change before it is opened as a pull request.

  Review it for:
  1. Correctness bugs (logic errors, edge cases, off-by-one errors)
  2. Security issues (injection, unsafe deserialization, secrets in code)
  3. Maintainability (naming, duplication, missing tests)

  For each issue found, give:
  - File and line reference
  - A one-sentence summary of the problem
  - A concrete suggested fix

  Do not comment on style choices that a linter would already catch. Order findings from most to least severe. If you find nothing, say so explicitly instead of inventing minor nitpicks.

  Here is the diff:
  {{diff}}
---

## When to use this

Run this before opening a pull request, or paste it into your AI coding assistant right after generating a change. It works well as a second pass after your own read-through.

## Tips

- Paste an actual diff (`git diff`) rather than a full file — the model reasons better about *changes* than about whole files.
- If the model returns generic style nitpicks, tighten the instruction: "skip anything a linter would catch."
