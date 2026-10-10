---
title: Draft an Architectural Decision Record (ADR) from Raw Discussions
description: >-
  Convert unstructured tech discussions, PR comments, or Slack threads into a
  standardized Architectural Decision Record (ADR).
published: 2026-10-10T15:56:42.440Z
draft: false
category: writing
models:
  - Claude
  - GPT
  - Gemini
tags:
  - architecture
difficulty: intermediate
prompt: >-
  You are a principal software architect and technical writer. Your task is to
  analyze raw technical discussions (Slack threads, design meeting notes, or PR
  comments) and synthesize them into a clean Architectural Decision Record
  (ADR).


  Context & Inputs:

  - System/Project Context: {{project_context}}

  - Decision Topic: {{decision_topic}}

  - Raw Discussion / Slack Notes / Comments:

  ---

  {{discussion_notes}}

  ---


  Generate the ADR using the following explicit structure:

  1. Title: Short, descriptive title in the format "ADR-XXXX: [Short Title]".

  2. Status: [Proposed | Accepted | Rejected | Deprecated]

  3. Context & Problem Statement: Describe the technical context and the
  specific problem requiring a decision.

  4. Options Considered: For every alternative mentioned in the input, provide:
     - Option Name
     - Pros (supported by the notes)
     - Cons / Trade-offs (supported by the notes)
  5. Decision Outcome: State the selected option and the core technical
  rationale behind choosing it.

  6. Consequences: List the expected positive and negative operational,
  architectural, or developer-experience impacts.

  7. Missing Context & Open Questions: If key details (e.g., benchmarks, budget
  constraints, or final consensus) are missing from the input notes, list them
  explicitly here instead of assuming or making them up.


  Rules for Accuracy:

  - Base all pros, cons, and decisions strictly on the provided input.

  - Do NOT invent hypothetical metrics, cost estimates, or benchmarks that were
  not stated in the source text.

  - Maintain a neutral, professional, engineering-focused tone.
---

## When to use this

Reach for this prompt when a complex technical decision was hammered out across Slack threads, PR review comments, or raw whiteboarding notes, and you need to preserve it as a permanent ADR. It saves time converting fragmented architectural debates into standardized documentation for future team context.

## Tips

- Paste raw, unedited Slack threads or comment chains directly into the prompt—don't waste time cleaning up timestamps or user handles first.
- If the model outputs items under 'Missing Context & Open Questions', use those exact points as follow-up questions for your tech lead before marking the ADR as Accepted.
