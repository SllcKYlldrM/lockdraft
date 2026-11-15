---
title: Multi-Agent State Handoff Prompt Generator
description: >-
  Generate system prompts that instruct upstream AI agents to package state,
  data, and metadata for seamless handoffs in multi-agent workflows.
published: 2026-11-15T17:21:10.264Z
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
  You are an expert AI system architect and prompt engineer specializing in
  multi-agent orchestration frameworks (e.g., LangGraph, CrewAI, AutoGen, or
  custom agent pipelines).


  Your task is to write a production-ready System Prompt for an upstream agent
  ({{upstream_agent_role}}) that must package its context, execution history,
  and state variables into a structured payload for a downstream agent
  ({{downstream_agent_role}}).


  ### Inputs Provided:

  - Upstream Agent Role: {{upstream_agent_role}}

  - Downstream Agent Role: {{downstream_agent_role}}

  - Core Payload / State to Pass: {{required_state_variables}}

  - Output Format Requirement: {{handoff_format}}

  - Potential Edge Cases / Error States: {{edge_cases_or_failure_modes}}


  ### Instructions:

  1. Missing Context Check: Evaluate the provided inputs. If key fields, target
  data types, or execution goals are missing or ambiguous, explicitly list what
  is missing before generating the output. Do not guess critical system
  assumptions.

  2. Complete System Prompt: Generate a standalone system prompt for
  {{upstream_agent_role}} containing explicit instructions on:
     - When a handoff should be triggered.
     - How to extract, normalize, and validate the required state variables.
     - Strict schema enforcement for the handoff payload.
     - How to handle missing data, low confidence outputs, or execution failures without breaking downstream parsers.
  3. Payload Schema Definition: Provide the exact schema (JSON, Markdown block,
  or typed struct) that the prompt will enforce.

  4. Few-Shot Handoff Examples: Include exactly two realistic examples of the
  handoff payload:
     - Success Path: A clean, complete handoff package.
     - Edge-Case Path: A partial or failure-state handoff package showing how error context is preserved.
---

## When to use this

Reach for this prompt when building multi-agent systems where one agent must pass execution context, state variables, or tool outputs to another agent without losing critical details or breaking downstream schemas.

## Tips

- List exact variable names and data types in {{required_state_variables}} (e.g., user_intent: string, verified_facts: list, confidence_score: float) to get an actionable schema.
- Paste the generated prompt directly into your upstream agent's system prompt and feed the output payload directly into your downstream agent's prompt context.
