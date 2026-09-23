---
title: "Design a Zapier or Make Automation"
description: "Turn a plain-language automation idea into a concrete trigger-action blueprint for Zapier or Make, including where it will break."
published: 2026-09-24
category: automation
models: [Claude, GPT]
tags: [zapier, make, automation]
difficulty: intermediate
prompt: |
  I want to automate this using {{platform}} (Zapier or Make):

  {{process_description}}

  Design the automation as:
  1. The trigger — exact event and app, and what data it provides.
  2. Each step after the trigger, numbered in order: app/action used, what it does,
     and which field from a previous step feeds into it.
  3. Every filter/condition needed (so the automation doesn't run when it shouldn't) —
     state the exact condition, not just "add a filter here."
  4. The most likely failure point (a field that's sometimes empty, an API that rate-
     limits, a step that depends on timing) and what to do about it — retry, fallback
     path, or a notification instead of silent failure.

  If {{platform}} is Make, use its module/scenario terminology; if Zapier, use its
  trigger/action/Zap terminology — don't mix them.
---

## When to use this

Use this before opening the builder — it forces you to name the exact trigger, the data flowing between steps, and the failure mode up front, instead of discovering them by trial and error inside the visual editor.

## Tips

- Be specific about the trigger in `{{process_description}}` — "when a deal reaches a specific stage in the CRM" is usable, "when something changes" is not.
- If you're not sure whether Zapier or Make fits better, ask a follow-up: "given this automation, which platform's pricing/step model fits better and why?"
