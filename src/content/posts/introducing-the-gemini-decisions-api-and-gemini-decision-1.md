---
title: Introducing the Gemini Decisions API and Gemini Decision 1
published: 2026-11-12T07:52:08.339Z
draft: false
description: >-
  Google launches a new endpoint for fast, calibrated multimodal scoring.
  Evaluate up to 1,000 bounded choices in a single pass at $0.10/1M input
  tokens.
tags:
  - API
  - automation
  - ai-news
  - model-release
category: AI News
author: LockDraft
sourceLink: >-
  https://blog.google/innovation-and-ai/technology/developers-tools/gemini-decisions-api/
---

## What changed

Google DeepMind released the Gemini Decisions API alongside the Gemini Decision 1 model (`gemini-decision-1`). This endpoint shifts focus from generative text generation to rapid, closed-set evaluation. Instead of decoding answers word by word, the model runs a single forward pass to score candidate options against a shared multimodal input containing text, images, audio, video, or PDFs. The API accepts payloads up to 256K tokens and allows developers to submit up to 1,000 independent questions per request. Each evaluation returns a confidence score between 0 and 1. Three question types are supported: `noul` for binary yes/no probability estimation, `choice` for selecting from 2 to 255 predefined options with normalized probabilities, and `score` for grading against an ordered rubric with continuous weighted outputs. The pricing structure charges $0.10 per million input tokens with zero cost for output tokens, removing variable billing for generated text or extended reasoning steps.

## Why it matters

Bounded decision-making typically requires custom classifiers, complex prompt engineering, or expensive generative calls. By evaluating multiple criteria in one pass, teams can build low-latency control planes for routing, policy checks, and content filtering without waiting for full responses. Internal Google teams have already integrated this approach into production workflows. Gemini Notebook routes queries to appropriate model tiers using millisecond classification, reducing latency by up to 40% for routine tasks. The Stitch design tool leverages the API to generate playable wireframes and apply instant edits based on voice or touch input. Similarly, CC from Google Labs uses it to match user intent against a palette of over 200 emojis instantly, while Search applies it as a safety filter for MCP tools against adversarial patterns. Because the model returns calibrated probabilities rather than unstructured text, downstream logic can automatically route ambiguous cases to fallback systems or human reviewers. This architecture aligns well with existing agent frameworks that prioritize deterministic routing over open-ended generation, much like the structured tool-use patterns discussed in [Architecting with Claude](/posts/architecting-with-claude-an-in-depth-developers-guide-to-anthropics-api-surface/).

## What to do next

Developers can access the endpoint through Google AI Studio using the `v1beta` API version. The pricing model bills only for consumed input tokens, meaning adding more questions to a single request does not increase the base compute charge beyond their individual instruction and criteria tokens. Prototype work is available at no cost in Google AI Studio, and three demo applications—Doorstep Parcels, Speed Sketch, and Find the Zoo Keeper—are hosted for testing. Official implementation guides cover Python, JavaScript, and REST clients. Third-party ecosystem partners including LangChain, Vercel, LiteLLM, Pydantic AI, Pipecat, LiveKit, OpenRouter, and OpenCode are rolling out native integrations.

### Limitations and caveats

Benchmark measurements reporting 150–250 ms end-to-end latency were conducted on context windows up to 16K tokens, even though the API officially supports inputs scaling to 256K tokens. The model is optimized strictly for closed-set evaluation and does not produce free-form text generation, which means it cannot replace general-purpose language models for drafting or conversational tasks. Additionally, because it avoids token-by-token decoding, the architecture prioritizes speed and calibration over explicit step-by-step reasoning traces. Teams should verify that their use cases align with bounded, probabilistic scoring before migrating from standard interaction endpoints.

### Sources

- [Gemini Decisions API: Fast, calibrated multimodal decisions](https://blog.google/innovation-and-ai/technology/developers-tools/gemini-decisions-api/)
