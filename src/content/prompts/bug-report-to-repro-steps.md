---
title: "Turn a Vague Bug Report into Reproduction Steps"
description: "Extract a minimal, concrete reproduction from a messy user-written bug report before you spend time trying to reproduce it yourself."
published: 2026-09-24
category: coding
models: [Claude, GPT]
tags: [bug-reports, qa, debugging]
difficulty: beginner
prompt: |
  Here is a bug report as written by a user or support agent:

  {{bug_report}}

  Turn this into:
  1. A minimal numbered list of reproduction steps, written as if for someone who has
     never seen this report — starting state, exact actions, in order.
  2. The expected result vs. the actual (reported) result, stated as two separate
     one-line facts.
  3. A list of every piece of information the report is missing that you'd need to
     actually reproduce it (browser/OS/version, account state, exact input values,
     timing) — do not guess these, just list what's missing.
  4. A confidence rating (high/medium/low) on whether these steps would reliably
     reproduce the issue as described, and why.

  Do not invent steps, error messages, or environment details that aren't stated or
  strongly implied by the report.
---

## When to use this

Use this on incoming bug reports before triaging or assigning them — it separates "here's exactly what to try" from "here's what we still need to ask the reporter," instead of letting both blur together in a paragraph of prose.

## Tips

- Paste the report verbatim, typos and all — rewriting it yourself first can accidentally remove a detail that turns out to matter.
- If the missing-information list comes back empty, be suspicious — most real bug reports are missing at least an environment detail.
