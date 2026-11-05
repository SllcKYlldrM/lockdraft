---
title: 'Palette: Fine-Tuning a 20B Model for Custom Slide Deck Generation'
published: 2026-11-05T01:12:45.941Z
draft: false
description: >-
  IBM Research releases Palette, an open-weight 20B model trained on synthetic
  data and a check-and-repair harness to generate branded slide decks locally.
tags:
  - ai-news
  - open-source-llms
  - tool-update
category: AI News
author: LockDraft
sourceLink: 'https://huggingface.co/blog/ibm-research/palette-deck-building'
---

## What changed
IBM Research introduced Palette, a workflow designed to teach a 20 billion parameter open-weight model how to generate presentation decks that match a specific corporate design language. Rather than relying on full fine-tuning, the team attached a Low-Rank Adaptation (LoRA) adapter to a capable base model, splitting the generation task into two distinct roles managed by the same adapter. A "designer" component outputs a structured JSON brief outlining the color palette, typography, slide layouts, and content rationale. A "coder" component then takes individual slide specifications and generates JavaScript using the `pptxgenjs` library to render the actual visuals. 

To train the system, the researchers generated approximately 1,000 synthetic decks covering roughly 10,000 slides using a larger open teacher model. Each example includes counterfactual reasoning traces that explain why alternative layouts or content choices were rejected. The training pipeline also supports plain-text directives wrapped in double brackets, such as `[[make this a timeline]]`, allowing users to steer specific structural or tonal decisions. Because the JavaScript generation traces are significantly longer than the design briefs, the dataset required oversampling the designer examples by a factor of five to prevent undertraining.

Every generated deck passes through an automated check-and-repair harness before delivery. The system validates geometry, flags overlapping elements or clipped text, and routes problematic slides to a dedicated editor model for correction. Rewrites are only accepted if a geometry validator confirms the fix resolves the layout errors. On the PresentBench benchmark, this approach secured first place across two of the three measured domains.

## Why it matters
Large frontier models typically default to a uniform, recognizable "AI-generated" aesthetic that struggles to maintain brand consistency. They also pose data privacy risks for organizations that cannot send proprietary information to external APIs. Palette addresses both constraints by operating on self-hosted infrastructure and learning directly from a target design language, specifically validated against the IBM Design Language. 

Slide creation forces small models to juggle editorial judgment and precise spatial arithmetic simultaneously. By decoupling these tasks and enforcing a strict validation loop, Palette mitigates common failure modes like background-matching titles and misaligned shapes. The harness effectively bridges the capability gap between smaller open weights and commercial systems while keeping intellectual property within local boundaries.

## What to do next
Teams looking to replicate this workflow should focus on three implementation steps. First, prepare a synthetic dataset mirroring your organization’s preferred template structure and inject counterfactual reasoning into every training example so the model learns underlying design rules rather than memorizing patterns. Second, address the sequence length imbalance in your training mix by heavily oversampling shorter components—like design briefs—to match the computational weight of longer code generation traces. Third, deploy a validation layer that renders intermediate outputs, catches geometric conflicts, and triggers targeted rewrites only when metrics confirm successful corrections.

## Limitations
The approach relies heavily on the quality of the synthetic teacher model and the reference decks used to ground its output. Prompt-level instructions alone proved insufficient to prevent factual hallucinations or template drift; reference examples were required to reliably steer the generator. Additionally, the parallel coding stage and multi-model repair loop introduce latency overhead compared to single-pass generation, making it less suitable for real-time editing scenarios.

For related LockDraft context, see [Ai2 Open-Sources AstaBrief 8B for Fast Scientific Report Generation](/posts/ai2-open-sources-astabrief-8b-for-fast-scientific-report-generation/).
## Sources
- [Palette: teaching a small model to build decks in your design language](https://huggingface.co/blog/ibm-research/palette-deck-building)
