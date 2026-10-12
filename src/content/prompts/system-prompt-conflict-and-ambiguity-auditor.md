---
title: System Prompt Conflict & Ambiguity Auditor
description: >-
  Audit system prompts to find direct contradictions, ambiguous constraints, and
  rule priority collisions before deploying to production.
published: 2026-10-12T19:57:43.401Z
draft: false
category: prompt-engineering
models:
  - Claude
  - GPT
  - Gemini
tags:
  - prompt-engineering
  - debugging
difficulty: intermediate
prompt: >-
  You are an expert prompt engineer auditing a production system prompt for
  logical conflicts, contradictory constraints, ambiguous directives, and
  missing priority hierarchies.


  Analyze the following system prompt and context:


  === BEGIN SYSTEM PROMPT ===

  {{system_prompt}}

  === END SYSTEM PROMPT ===


  === EXPECTED OUTPUT FORMAT ===

  {{expected_output_format}}


  === KNOWN FAILURE MODES OR WEIRD BEHAVIOR (OPTIONAL) ===

  {{known_failure_modes}}


  Audit Instructions:

  - Do NOT invent hypothetical conflicts if the system prompt is
  well-constructed and unambiguous. If no critical conflicts exist, state that
  explicitly.

  - Only analyze directives actually present in or implied by the provided
  prompt text. Do not assume external business logic unless explicitly supplied.

  - If important context is missing (such as available tool definitions or user
  input types), flag it as missing instead of guessing.


  Produce an audit report with the following exact structure:


  1. Direct Rule Contradictions:
     - Identify pairs of instructions that directly oppose each other (e.g., strict length caps vs. mandatory output sections).
     - Quote the exact contradictory phrases from the system prompt.

  2. Implicit Priority Collisions & Ambiguities:
     - Identify scenarios where two or more rules compete for precedence without a clear tie-breaker rule.
     - Flag vague terms (e.g., "be concise", "whenever appropriate", "high quality") that create non-deterministic behavior.

  3. Conflict & Risk Matrix:
     - List each identified issue with Severity (Critical, Moderate, Low) and the specific input trigger that causes the model to fail or hallucinate.

  4. Optimized & Refactored System Prompt:
     - Provide a rewritten, production-ready version of the prompt that resolves all identified conflicts.
     - Include an explicit "Rule Precedence Hierarchy" section near the top of the refactored prompt to handle edge-case collisions automatically.
---

## When to use this

Use this prompt when refactoring bloated system prompts, combining instructions written by multiple developers, or debugging unpredictable model outputs in production. It helps catch rule collisions before shipping prompts to an agent workflow.

## Tips

- Paste the complete, unedited system prompt—including any variable placeholders like {{user_input}}—so the auditor can evaluate real structural scope.
- If you've noticed specific bad outputs in production, describe them in the known failure modes placeholder to help the model zero in on the precise logical conflict.
