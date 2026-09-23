---
title: "Write a Blameless Postmortem from an Incident Timeline"
description: "Turn a raw incident timeline into a structured, blameless postmortem with concrete follow-up actions instead of vague promises to 'do better.'"
published: 2026-09-24
category: writing
models: [Claude, GPT]
tags: [postmortem, incident-response, writing]
difficulty: intermediate
prompt: |
  Here is a raw timeline of an incident (timestamps and what happened/was observed):

  {{timeline}}

  Impact: {{impact}}

  Write a postmortem with these sections:
  1. Summary — two sentences: what broke and the user-facing impact.
  2. Timeline — cleaned up, in order, each entry stated as an observed fact ("error
     rate crossed 5%") not an interpretation ("the team noticed things were bad").
  3. Root cause — the actual underlying cause, distinct from the trigger. If the
     timeline doesn't contain enough information to state a root cause confidently,
     say what's still unknown instead of guessing.
  4. Contributing factors — things that made it worse or slower to detect/resolve,
     stated as system/process gaps, never as a person's mistake.
  5. Action items — each one specific and verifiable (a monitoring alert to add, a
     runbook step to change), with no vague items like "improve communication."

  Keep the tone blameless throughout: describe what the system/process allowed to
  happen, never what a person did wrong.
---

## When to use this

Use this right after an incident is resolved, while the timeline is still fresh, to get a first draft the team can react to and correct rather than starting from a blank document.

## Tips

- Paste the timeline with real timestamps, not a summarized version — precise timing is often what reveals the actual root cause versus just the trigger.
- If an action item comes back vague despite the instruction, push back directly: "make this one specific and verifiable — how would we know it's done?"
