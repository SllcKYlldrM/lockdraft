---
title: "Find the Root Cause of a Stack Trace"
description: "Turn a raw error and stack trace into a ranked list of likely root causes instead of a guess-and-check debugging session."
published: 2026-09-24
category: coding
models: [Claude, GPT]
tags: [debugging, errors, stack-trace]
difficulty: beginner
prompt: |
  I have an error I can't immediately explain. Help me find the root cause, not just a
  workaround.

  Error message: {{error_message}}
  Stack trace: {{stack_trace}}
  Relevant code (the function(s) in the trace): {{code}}
  What I expected to happen: {{expected_behavior}}
  What actually happened: {{actual_behavior}}

  Do this:
  1. Read the stack trace bottom-to-top and identify the exact line where the bad state
     was introduced, not just where it was thrown.
  2. List the 2-3 most likely root causes, ranked by likelihood, each with the specific
     evidence from the trace/code that supports it.
  3. For the top candidate, give a minimal code change that fixes the cause — not a
     try/catch that hides the symptom.
  4. Name one thing I could log or assert to confirm the diagnosis before applying the fix.

  If the trace doesn't contain enough information to be confident, say so explicitly and
  ask for the specific missing piece (input value, prior log line, version) instead of
  guessing.
---

## When to use this

Use this the moment an error message makes you reach for a workaround instead of understanding it — a null reference three layers deep, a race condition, an error that only reproduces sometimes.

## Tips

- Paste the full stack trace, not a truncated version — the frame that matters is often near the bottom, closest to your own code.
- If the model proposes wrapping the error in a try/catch as "the fix," push back: ask specifically for the root cause, not the symptom suppression.
