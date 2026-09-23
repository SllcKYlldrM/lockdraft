---
title: "Design a Well-Specified Tool for an AI Agent"
description: "Write a tool/function definition an LLM agent will actually call correctly — the part most tool-use bugs trace back to."
published: 2026-09-24
category: agents
models: [Claude, GPT]
tags: [agents, tool-use, function-calling]
difficulty: intermediate
prompt: |
  I'm adding a tool to an AI agent. Help me write a well-specified tool definition.

  What the tool should do: {{tool_purpose}}
  Inputs it needs: {{inputs}}
  What it returns: {{return_value}}
  Constraints or side effects (destructive? rate-limited? costs money?): {{constraints}}

  Give me:
  1. A tool name that's unambiguous next to the agent's other tools (avoid vague verbs
     like "process" or "handle").
  2. A description written for the model, not for a human reading docs — it should
     state exactly when to call this tool and, just as importantly, when NOT to.
  3. A parameter schema with each field's type, whether it's required, and one example
     value — flag any parameter that's ambiguous enough a model could plausibly
     misinterpret its format (date strings, IDs, enums).
  4. If the tool is destructive, irreversible, or costs money: the exact confirmation
     step the agent should require before calling it for real.

  Point out any part of my inputs above that's too vague for a model to use reliably,
  rather than filling the gap with an assumption.
---

## When to use this

Use this before wiring a new tool into an agent, not after debugging why the agent keeps calling it wrong — most tool-use failures trace back to an ambiguous description or an underspecified parameter, not the model's reasoning.

## Tips

- If you have two tools whose descriptions could plausibly overlap in the model's mind, paste both and ask directly: "would a model be able to reliably tell these apart? If not, how would you rename/redescribe them?"
- For destructive tools, don't skip the confirmation step even in a personal/internal project — it's the single highest-leverage guardrail in agent design.
