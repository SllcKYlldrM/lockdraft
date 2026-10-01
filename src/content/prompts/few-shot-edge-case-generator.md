---
title: Few-Shot Edge-Case Generator
description: >-
  Generate high-quality, diverse few-shot examples (including edge cases and
  error handling) to insert into your system prompts for better accuracy.
published: 2026-10-01T17:09:58.460Z
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
  You are an expert prompt engineer specializing in few-shot learning and
  in-context alignment. Your task is to generate a diverse, highly realistic set
  of few-shot examples (input/output pairs) to embed within a system prompt.
  These examples must train the model to handle happy paths, complex edge cases,
  and graceful error recovery.


  Here is the specification for the task:

  - **Base System Prompt/Instructions:**

  {{system_prompt}}


  - **Task Description:**

  {{task_description}}


  - **Input Format/Schema:**

  {{input_schema}}


  - **Output Format/Schema:**

  {{output_schema}}


  - **Tricky Edge Cases to Cover:**

  {{known_edge_cases}}


  - **Number of Examples Needed:**

  {{number_of_examples}}


  CRITICAL SAFETY AND QUALITY CHECK:

  Before generating, analyze the provided schemas and task description. If any
  crucial details are missing, or if the input/output schemas are too ambiguous
  to generate syntactically valid and realistic examples, do not make
  assumptions or invent placeholders. Stop and list the specific clarifications
  or schema details you need.


  If you have sufficient information, output your response following this exact
  structure:


  1. **Target Failure Modes**: A quick bulleted list identifying the top 3-4
  ways an LLM is likely to fail on this task (e.g., hallucinating fields,
  ignoring negative constraints, formatting errors) and how your generated
  examples will prevent them.

  2. **Few-Shot Examples**: Exactly {{number_of_examples}} examples. Format each
  example clearly using XML tags like this:
     <example>
     <input>
     [Insert realistic input matching the input schema]
     </input>
     <output>
     [Insert correct, high-quality output matching the output schema]
     </output>
     <explanation>
     [1-2 sentences explaining what specific behavior, edge case, or constraint this example teaches the model]
     </explanation>
     </example>
  3. **Implementation Advice**: A brief recommendation on where to place these
  examples in the final system prompt for optimal recall (especially considering
  the context window of modern models).
---

## When to use this

Use this prompt when your LLM pipeline or agent is failing on complex inputs, ignoring negative constraints, or outputting malformed data. Instead of manually writing synthetic training data, use this to generate a balanced set of few-shot examples (happy path, edge cases, and graceful failures) to anchor your system prompt's behavior.

## Tips

- Provide concrete schemas (like JSON Schema, TypeScript interfaces, or Pydantic models) for the input and output placeholders to ensure the generated examples match your production data structures perfectly.
- If the generated examples are too simplistic, run a follow-up prompt asking the model to increase the complexity or introduce specific real-world noise (like typos, incomplete API payloads, or conflicting instructions) into the inputs.
