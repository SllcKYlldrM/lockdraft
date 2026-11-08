---
title: Design an Agent State & Memory Architecture
description: >-
  Architect how an AI agent stores, truncates, summarizes, and retrieves working
  state and long-term memory across turns.
published: 2026-11-08T16:45:51.211Z
draft: false
category: agents
models:
  - Claude
  - GPT
  - Gemini
tags:
  - agents
  - architecture
difficulty: intermediate
prompt: >-
  You are an expert AI agent architect. Design a robust, production-grade memory
  and state management strategy for an AI agent based on the specifications
  provided below.


  ### Agent Context & Requirements

  - **Agent Purpose & Scope**: {{AGENT_PURPOSE}}

  - **Execution Lifespan**: {{EXECUTION_LIFESPAN}}

  - **State & Data Types Needed**: {{DATA_TYPES_TO_STORE}}

  - **Context Window & Latency Budget**: {{CONTEXT_AND_LATENCY_CONSTRAINTS}}

  - **Target Tech Stack**: {{TECH_STACK}}


  ---


  ### Your Instructions

  If any key parameters are missing, vague, or contradictory, explicitly flag
  them under an "Assumptions & Missing Information" section before presenting
  your architecture design. Do not invent unstated technical constraints or
  pretend ambiguous requirements are clear.


  Provide a complete design structured into the following 5 sections:


  1. **State Partitioning & Data Model Matrix**
     - Categorize all data into Working Context (in-prompt short-term), Epistemic/Session State (key-value or relational working memory), and Semantic/Long-Term Memory (vector/document database).
     - Define exact schemas or data structures for key state objects.

  2. **Context Window Management & Compaction Strategy**
     - Detail explicit rules for context truncation, sliding windows, and token pruning.
     - Define how and when intermediate tool outputs and reasoning steps are summarized vs retained verbatim to avoid context bloat.

  3. **Memory Retrieval & Read/Write Lifecycle**
     - Provide a step-by-step execution flow for every agent turn (e.g., Read -> Retrieve -> Execute -> Update -> Compact).
     - Specify trigger mechanisms for when long-term memory is queried vs updated.

  4. **Failure Recovery & State Invalidation**
     - Explain how to handle state corruption, agent loop failures, or stale memory invalidation.
     - Specify how to rollback state if a multi-step tool call fails mid-sequence.

  5. **Implementation Code Blueprint**
     - Provide clean pseudocode or code structures (in Python or TypeScript) demonstrating how this state object is initialized, updated, and passed into the LLM call loop.
---

## When to use this

Reach for this prompt when building an AI agent that executes multi-turn tasks or multi-step loops and needs a clear separation between short-term prompt context, session persistence, and long-term memory storage.

## Tips

- Include specific latency targets and token limits in {{CONTEXT_AND_LATENCY_CONSTRAINTS}} so the model doesn't propose overly complex vector setups when key-value storage is sufficient.
- Mention your specific framework (such as LangGraph, LlamaIndex, or custom loop code) in {{TECH_STACK}} to receive framework-idiomatic state object definitions.
