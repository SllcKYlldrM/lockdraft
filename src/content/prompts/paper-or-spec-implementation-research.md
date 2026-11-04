---
title: Paper or Spec Implementation Research
description: >-
  Deconstruct an academic paper, RFC, or technical spec into a production
  implementation plan, data flow architecture, and bottleneck analysis.
published: 2026-11-04T18:10:52.613Z
draft: false
category: research
models:
  - Claude
  - GPT
  - Gemini
tags:
  - research
  - architecture
difficulty: intermediate
prompt: >-
  Act as a Senior Systems Architect and AI Research Engineer. Analyze the
  provided research paper excerpt, RFC, or technical specification and evaluate
  the feasibility of translating its theoretical concepts into a
  production-grade software implementation.


  Input Context:

  - Technical Document / Abstract / Spec: {{PAPER_OR_SPEC_TEXT}}

  - Target Tech Stack & Environment: {{TARGET_STACK}}

  - Target System Constraints (e.g., latency SLAs, memory budget, scale
  requirements): {{PRODUCTION_CONSTRAINTS}}


  Instructions:

  Perform a thorough implementation research assessment. Do not invent
  theoretical details or gloss over implementation hurdles. If the source text
  lacks specific mathematical formulas, algorithms, or operational parameters
  required for building this, explicitly list them under Section 3 as missing
  information.


  Structure your response into the following 5 numbered sections:


  1. Core Algorithm & Concept Deconstruction

  Summarize the fundamental data structures, algorithms, mathematical models, or
  protocols introduced in the document. Explain how they work in practical
  engineering terms (avoiding unnecessary academic jargon).


  2. Architectural Adaptation & Data Flow

  Outline how this capability fits into {{TARGET_STACK}}. Describe the inputs,
  outputs, state management requirements, and storage/compute dependencies
  needed to support it.


  3. Theoretical Gaps & Missing Edge Cases

  Identify implicit assumptions in the document that do not translate easily to
  production (e.g., assumed infinite memory, unstated network overhead, batching
  assumptions, simplified edge conditions). Highlight anything missing from the
  source text needed for implementation.


  4. Latency & Resource Bottleneck Analysis

  Evaluate the compute, memory, disk I/O, and network bottlenecks. Explain how
  performance will scale under the constraints defined in
  {{PRODUCTION_CONSTRAINTS}}.


  5. Phased Implementation & Proof-of-Concept Strategy

  Provide a step-by-step engineering roadmap to build a minimal viable
  spike/POC, including specific unit test and benchmark validation criteria to
  confirm correctness.
---

## When to use this

Reach for this prompt when you need to translate an academic research paper (e.g., a new RAG technique, attention mechanism, or speculative decoding paper) or a complex RFC specification into a practical, production-ready engineering plan.

## Tips

- Paste the paper's 'Methodology', 'Architecture', or 'Algorithm' section rather than the entire text to get the most specific engineering breakdown.
- Follow up by asking the model to write pseudo-code or Python prototypes for the specific core data structures identified in Section 1.
