---
title: Diagnostic Investigation Plan
description: >-
  Generate a structured research plan for a bug/error. Ranks root cause
  hypotheses, suggests verification steps, and flags missing info instead of
  guessing.
published: 2026-09-28T17:42:16.721Z
draft: false
category: research
models:
  - Claude
  - GPT
  - Gemini
tags:
  - troubleshooting
  - diagnostics
  - root-cause-analysis
difficulty: intermediate
prompt: >-
  Act as a senior systems researcher. Analyze the provided issue to create a
  structured investigation plan.


  Inputs:

  - Symptoms/Errors: {{symptoms_and_errors}}

  - Relevant Context/Code: {{code_or_config_snippets}}

  - Environment Details: {{os_runtime_versions_infrastructure}}


  Output a numbered list with exactly these sections:


  1. Core Failure Statement: Summarize the primary symptom in one concise
  sentence.

  2. Ranked Hypotheses: List top 3 likely root causes ordered by probability.
  For each, cite specific evidence from the inputs that supports the link.

  3. Verification Actions: For each hypothesis, provide 1-2 concrete,
  non-destructive steps to test validity (e.g., specific log grep patterns,
  config toggles, or isolation commands).

  4. Confidence & Gaps: Rate your confidence (Low/Medium/High) and explicitly
  list any critical information missing that prevents a higher rating. Do not
  assume facts not present.

  5. Targeted Search Queries: Generate 3 precise search strings combining tool
  names, error signatures, and keywords to find relevant issue trackers or forum
  discussions.


  Constraints:

  - Base all analysis strictly on provided inputs. Flag any inference as
  speculative.

  - Never invent error codes, APIs, or behaviors not mentioned or implied by the
  context.

  - If inputs lack sufficient detail to form a hypothesis, stop and request the
  missing data rather than hallucinating a solution.
---

## When to use this

Reach for this when debugging a complex error, intermittent failure, or unexpected behavior where the cause isn't immediately clear. Paste your symptoms, logs, and context to receive a prioritized list of hypotheses and actionable verification steps, helping you systematically narrow down the problem before searching documentation or asking for help.

## Tips

- Include exact error messages, stack traces, and version numbers; paraphrasing symptoms reduces the model's ability to identify specific known issues.
- After receiving the plan, run the verification steps and feed the results back to the model in a follow-up to eliminate hypotheses and refine the next steps.
