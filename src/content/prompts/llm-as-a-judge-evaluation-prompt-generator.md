---
title: LLM-as-a-Judge Evaluation Prompt Generator
description: >-
  Generate a production-ready LLM evaluator prompt with strict scoring rubrics
  and bias mitigations to benchmark AI agent outputs.
published: 2026-10-05T19:22:09.824Z
draft: false
category: prompt-engineering
models:
  - Claude
  - GPT
  - Gemini
tags:
  - prompt-engineering
  - testing
difficulty: intermediate
prompt: >-
  You are an expert AI evaluation engineer specializing in automated quality
  assessment (LLM-as-a-Judge). Your task is to author a complete,
  production-ready evaluator prompt that an LLM can use to score outputs from
  another model or agent.


  Input Context:

  - Target Task Description: {{target_task_description}}

  - Input Given to Target Model: {{model_input_context}}

  - Output Requirements / Schema: {{expected_output_format}}

  - Evaluation Criteria: {{evaluation_criteria}}

  - Target Scoring Scale: {{scoring_scale}}


  Rule: Before drafting the judge prompt, review the inputs above. If any
  critical evaluation criteria or constraints are missing or ambiguous,
  explicitly list the missing information and stop. Do not fabricate evaluation
  standards.


  Provide your response in four distinct parts:


  1. **Judge System Prompt**: A complete, copy-pasteable prompt template for the
  evaluator LLM. It must:
     - Require step-by-step reasoning *before* giving any scores (Chain-of-Thought).
     - Include explicit instructions to mitigate common judge biases (verbosity bias, tone bias, and self-enhancement bias).
     - Define clear placeholders like `{{USER_INPUT}}` and `{{GENERATED_OUTPUT}}`.

  2. **Scoring Anchor Rubric**: A explicit mapping for every point on the scale
  (e.g., 1 to 5), detailing what specific failures lower the score and what
  concrete elements earn full marks.


  3. **Structured JSON Output Schema**: A JSON schema or TypeScript interface
  specifying the required judge output format (e.g., `analysis`,
  `criteria_scores`, `pass_fail_verdict`, `final_score`).


  4. **Execution Advice**: Brief, practical settings for running the judge
  prompt (e.g., recommended temperature, token limits, and model choice
  recommendations).
---

## When to use this

Reach for this prompt when building automated testing suites or evaluation pipelines for AI agents and LLM features. It generates a standardized judge prompt that evaluates model outputs objectively without subjective bias or grade inflation.

## Tips

- Provide specific failure cases in the 'evaluation criteria' placeholder so the generated rubric explicitly targets the exact errors your system commonly makes.
- Run the generated judge prompt with temperature set to 0.0 on high-reasoning models like Claude 3.5 Sonnet or GPT-4o to maximize scoring consistency.
