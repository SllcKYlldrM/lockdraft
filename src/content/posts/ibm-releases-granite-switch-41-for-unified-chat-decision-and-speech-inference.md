---
title: >-
  IBM Releases Granite Switch 4.1 for Unified Chat, Decision, and Speech
  Inference
published: 2026-10-21T14:21:59.522Z
draft: false
description: >-
  IBM releases Granite Switch 4.1, unifying chat, decisions, and speech-to-text.
  Models use cache-reusing aLoRAs for VRAM efficiency and Guardian beats Jev
  1.13.
tags:
  - model-release
  - ai-news
  - open-source-llms
category: AI News
author: LockDraft
sourceLink: 'https://huggingface.co/blog/ibm-granite/granite-switch-4-1'
---

## What changed
IBM has released Granite Switch 4.1, expanding its modular model framework with two new configurations: `Granite-Switch-4.1-8B` and `Granite-Switch-4.1-30B`. These models integrate a base Granite model with three distinct components into a single inference endpoint:

* **Decision aLoRA:** Provides general-purpose decision-making capabilities, supporting `/v1/systemone` API calls for classification tasks.
* **Guardian aLoRA:** A specialized safety adapter that IBM reports averages higher performance than Jev 1.13, Microsoft-Decision-1, GPT-Luna-Decisions, and Clef-Flash on safety-related decision tasks.
* **Granite-Speech-5.0-Turbo-CTC:** Integrated speech-to-text module, currently ranked as the fastest ASR model on the OpenASR Leaderboard.

The architecture utilizes cache-efficient Activated LoRAs (aLoRAs) and co-located ASR encoding. This design allows the KV cache generated during base model text generation to be reused for subsequent adapter-based decisions. Combined with recent vLLM optimizations for low-rank adapter inference, the models can switch between chat, decision, and audio requests with minimal latency overhead. Crucially, composing these adapters adds negligible VRAM cost; the full suite consumes approximately the same GPU memory as the base model alone.

In comparative testing, a `Granite-Switch-4.1-30B` configuration running a five-step RAG workflow completed tasks significantly faster than a comparable `Jev-27B` setup. Additionally, a custom 3B-parameter Granite Switch variant demonstrated game-playing capabilities at 60–100 decisions per second, outperforming Jev's reported 10 decisions per second while maintaining narration and response functions.

## Why it matters
Granite Switch 4.1 demonstrates how modular composition can consolidate multiple AI workloads onto shared infrastructure. By leveraging shared prefix caches and efficient adapter loading, developers can deploy endpoints that handle transcription, content moderation, summarization, and user-facing chat simultaneously without proportional increases in hardware requirements. The inclusion of Granite Libraries allows users to swap or extend adapters, potentially trading a generalist decision adapter for specialists tailored to specific classification needs.

Compatibility extends to existing tooling; the models run via a vLLM plugin and offer native inference support in llama.cpp. They can replace `/v1/systemone` API calls in downstream platforms while continuing to service standard chat requests, facilitating easier integration into automated pipelines.

## What to do next
* Explore the **Speech-to-Decisions demo** on Hugging Face Spaces to see real-time transcription, summarization, and safety screening on a single endpoint.
* Review the **Model Cards** for detailed specifications on the 8B and 30B variants.
* Use the **GitHub repository** to implement the vLLM plugin or access llama.cpp inference scripts.
* Experiment with **Granite Libraries** to compose custom models by mixing predefined adapters. IBM plans to release an Adapter SDK for training adapters in Mellea in the near future.

*Note: The Doom gameplay benchmark cited above refers to a custom 3B-parameter model built by the team, rather than the official 8B or 30B releases.*

For related LockDraft context, see [Ai2 Open-Sources AstaBrief 8B for Fast Scientific Report Generation](/posts/ai2-open-sources-astabrief-8b-for-fast-scientific-report-generation/).

## Sources

- [Official source](https://huggingface.co/blog/ibm-granite/granite-switch-4-1)
