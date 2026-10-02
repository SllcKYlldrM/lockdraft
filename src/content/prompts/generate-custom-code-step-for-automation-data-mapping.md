---
title: Generate Custom Code Step for Automation Data Mapping
description: >-
  Generate clean Python or JavaScript code to transform and map complex webhook
  payloads between mismatched APIs in Make, n8n, or Zapier.
published: 2026-10-02T16:21:46.617Z
draft: false
category: automation
models:
  - Claude
  - GPT
  - Gemini
tags:
  - automation
difficulty: intermediate
prompt: >-
  You are an expert automation engineer. Your task is to write a highly robust,
  performant custom code step (script) for an iPaaS platform to transform a
  source JSON payload into a target JSON payload.


  ### Environment Constraints

  - Platform/Language: {{runtime_environment}} (e.g., Node.js in Make, Python in
  n8n, Zapier Code Step)

  - External Libraries: Do not use any external packages unless they are
  natively supported by the specified environment. Use standard library/built-in
  modules only.


  ### Data Specs

  - Source Payload Sample:

  ```json

  {{source_payload_sample}}

  ```

  - Target Payload Sample:

  ```json

  {{target_payload_sample}}

  ```


  ### Transformation Rules

  {{transformation_rules}}


  ### Requirements for the Code

  1. Handle missing, null, or undefined keys gracefully without throwing
  unhandled exceptions (return safe fallbacks or skip records as appropriate).

  2. Ensure date formats, string encodings, and data types (e.g., string to
  integer) match the target payload requirements precisely.

  3. Include clean, inline comments explaining complex array manipulations,
  filtering, or regex operations.


  ### Output Structure

  Please provide your response in the following structured format:


  1. **Mapping & Transformation Summary**: A markdown table mapping the source
  fields to the target fields, including any logic applied.

  2. **Assumptions and Missing Information**: If the source payload lacks the
  fields required to construct the target payload, or if a rule is ambiguous, do
  not guess. Explicitly list these missing elements here and state how the code
  handles them (e.g., using a default value or skipping).

  3. **Production-Ready Code**: The complete, copy-pasteable script. Wrap the
  main logic in the standard wrapper/handler function required by the specified
  platform (e.g., `inputData` in Zapier, returning an item array in n8n).

  4. **Test Scenarios**: Provide two validation scenarios (one standard case,
  one edge case with missing/null data) showing the expected input and output
  payloads to verify the script's behavior.
---

## When to use this

Use this prompt when you are building an integration in an iPaaS tool (like Make, Zapier, or n8n) and the native UI mapping tools are too limited to handle the complex data transformation, array manipulation, nested looping, or date formatting required between your trigger and action steps.

## Tips

- Always paste raw, realistic JSON payloads for both the source and target rather than describing them in prose; this ensures the generated code references the exact key names and nesting depths.
- Specify the exact environment constraints (e.g., 'Node.js 18 in n8n' or 'Python 3.9 in Zapier Code step') so the model doesn't use unsupported external libraries or modern syntax features that will crash your workflow.
