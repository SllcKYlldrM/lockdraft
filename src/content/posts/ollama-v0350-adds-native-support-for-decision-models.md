---
title: Ollama v0.35.0 Adds Native Support for Decision Models
published: 2026-10-01T06:36:52.506Z
draft: false
description: >-
  Ollama v0.35.0 introduces the systemone endpoint, bringing structured decision
  models like Nimble and Tev1 to local environments.
tags:
  - Ollama
  - open-source-llms
  - ai-news
  - tool-update
category: AI News
author: LockDraft
sourceLink: 'https://github.com/ollama/ollama/releases/tag/v0.35.0'
---

## What changed

Ollama v0.35.0 introduces native support for decision models via a new `/v1/systemone` API endpoint, built on TypeSafe's Jev API. Unlike standard large language models that generate conversational text, decision models are designed to return structured choices, probabilities, and scores.

Developers can now run two specialized decision models locally:
* **Nimble** by Bespoke Labs
* **Tev1** by Together AI

The `/v1/systemone` endpoint supports three distinct question formats:
* `choice`: Selects an option from a provided list and returns individual probabilities for each.
* `noul`: Calculates the probability that a specific condition is true.
* `score`: Evaluates and returns a score across an ordered set of criteria.

Additionally, the v0.35.0 release includes several bug fixes and performance updates:
* The Settings menu now opens immediately without waiting for local model discovery to complete.
* Fixed an issue where stalled MLX model downloads would hang indefinitely.
* Corrected a bug where the macOS update menu and status bar icon failed to show a pending update at startup.
* Requests containing the deprecated `typical_p` parameter will now log a warning rather than causing the request to fail.

## Why it matters

For tasks like ticket triage, intent classification, and LLM routing, using a generative model to output structured JSON is often slow and inefficient. Developers frequently have to implement strict schema validation or parse raw text to extract a simple classification. 

By introducing decision models, Ollama allows developers to bypass text generation entirely for classification workflows. Because these models directly output probabilities and confidence scores, they are faster and highly reliable for deterministic pipeline steps. This release aligns with the broader trend of optimizing local environments for highly specialized tasks, similar to how [Hugging Face Transformers now supports GGUF quantizations locally](/posts/hugging-face-transformers-now-supports-gguf-quantizations-locally/) to streamline local open-source workflows.

## What to do next

To start using decision models, first download a compatible model such as Nimble:

```sh
ollama pull nimble
```

You can then query the model by sending a POST request to the `/v1/systemone` endpoint. The request payload requires a `model`, a `state` (the context to analyze), and a `questions` object defining your criteria.

Here is an example of classifying a support ticket using `curl`:

```sh
curl http://localhost:11434/v1/systemone \
  -H 'Content-Type: application/json' \
  -d '{
    "model": "nimble",
    "state": "Our checkout has returned 500 errors since 9am.",
    "questions": {
      "label": {
        "type": "choice",
        "instructions": "Which label fits this ticket?",
        "criteria": {
          "billing": "Payments and refunds",
          "bug": "Software errors",
          "account": "Login and account access"
        }
      }
    }
  }'
```

The endpoint will return a structured JSON response containing the selected choice, the exact probabilities for each option, a confidence score, and token usage metrics.

## Sources
* [Ollama v0.35.0 Release Notes on GitHub](https://github.com/ollama/ollama/releases/tag/v0.35.0)
