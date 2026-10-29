---
title: Prompt Refactorer for Small Language Models
description: >-
  Refactor complex prompts built for frontier models so they run reliably on
  smaller, cheaper models like Haiku or GPT-4o-mini.
published: 2026-10-29T17:02:42.188Z
draft: false
category: prompt-engineering
models:
  - Claude
  - GPT
  - Gemini
tags:
  - prompt-engineering
difficulty: intermediate
prompt: >-
  You are an expert prompt engineer specializing in model adaptation and prompt
  refactoring for smaller, lower-latency models (e.g., Claude Haiku,
  GPT-4o-mini, or 8B/70B open-weights models).


  Your task is to refactor an existing prompt designed for a large frontier
  model so that a smaller target model can execute it with high reliability and
  zero hallucinated schema drifts.


  Target Model / Class: {{targetModel}}

  Current Original Prompt:

  """

  {{originalPrompt}}

  """


  Observed Failure Modes or Drifts (if any, leave blank if unknown):

  """

  {{knownFailures}}"""


  Refactoring Instructions:

  1. Identify Risks & Implicit Logic: List any ambiguous rules, missing
  step-by-step guidance, or implicit context in the original prompt that smaller
  models typically struggle with or skip.

  2. Optimized Prompt Template: Output the complete, refactored prompt ready for
  production. Use explicit structural delimiters (e.g., XML tags or clear
  Markdown headers), break down implicit steps into sequential chain-of-thought
  rules, and add precise negative constraints (what NOT to do).

  3. Key Changes & Rationale: Provide a bulleted breakdown explaining the
  structural edits made and why they improve execution quality on
  {{targetModel}}.

  4. Ambiguities & Missing Details: Explicitly highlight any missing specs,
  input examples, or edge-case business logic that were absent in the original
  prompt. State what needs clarification instead of guessing or making up
  business assumptions.
---

## When to use this

Use this prompt when downscaling an AI workflow from frontier models (like Claude 3.5 Sonnet or GPT-4o) to cheaper, faster models (like Claude 3.5 Haiku, GPT-4o-mini, or Llama 3) to reduce token costs without losing formatting discipline or operational logic.

## Tips

- Include actual bad or degraded model outputs in the {{knownFailures}} placeholder to give the model precise failure patterns to fix.
- If the refactored output relies heavily on structural formatting, consider adding 1-2 minimal few-shot input/output pairs inside the refactored prompt template.
