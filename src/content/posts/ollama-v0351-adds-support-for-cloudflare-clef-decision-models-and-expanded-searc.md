---
title: >-
  Ollama v0.35.1 Adds Support for Cloudflare Clef Decision Models and Expanded
  Search Capabilities
published: 2026-10-03T13:57:41.967Z
draft: false
description: >-
  Ollama v0.35.1 introduces Cloudflare Clef decision models via the
  /v1/systemone endpoint, capability flags, and expanded web search limits.
tags:
  - Ollama
  - Open Source
  - AI Agents
  - ai-news
  - open-source-llms
  - tool-update
category: AI News
author: LockDraft
sourceLink: 'https://github.com/ollama/ollama/releases/tag/v0.35.1'
---

## What changed

Ollama released v0.35.1, introducing native support for Cloudflare's new open-source multimodal decision models: Clef (27B) and Clef Flash (9B).

Key changes in this update include:

* **Clef Decision Model Integration:** Users can run `clef` and `clef-flash` using a dedicated `/v1/systemone` API endpoint. Requests support multimodal input, accepting base64-encoded images along with a text `state` parameter evaluated across structured `questions` to output joint confidence scores.
* **Increased Web Search Depth:** Models capable of performing web searches can now make up to 10 searches per response, up from the previous limit of 3.
* **Explicit Modelfile Capabilities:** Modelfiles now accept `CAPABILITY` declarations to explicitly define model functions. These declarations persist when building from safetensors or GGUF files (bringing structured metadata features alongside local execution options like [Hugging Face Transformers GGUF support](/posts/hugging-face-transformers-now-supports-gguf-quantizations-locally/)), during model inheritance, and upon Modelfile export.
* **Capability Filtering for Clients:** The `ollama show` command and model list now report strictly `decision` as the capability for decision models. This prevents client frontends from offering these models for standard chat, tool calling, or reasoning ("thinking") tasks.
* **Core Engine Updates:** Underneath, Ollama updated both its `llama.cpp` and `MLX` backend engines.

## Why it matters

Decision models like Clef handle structured evaluation tasks rather than open-ended dialogue. By routing these workflows through the specialized `/v1/systemone` endpoint and enforcing the `decision` capability tag, Ollama ensures that downstream client tools do not misroute conversational or agentic tool-calling tasks to non-chat models.

Additionally, raising the web search boundary from 3 to 10 calls gives web-enabled models significantly more latitude to gather context across multi-step research queries.

## Limitations

Decision models exposed via `/v1/systemone` are strictly bounded to scoring state-question pairs. Because they report only the `decision` capability, client integrations attempting to execute standard chat completion endpoints or structured tool calls against `clef` or `clef-flash` will be rejected by compatible user interfaces.

## What to do next

To run decision queries locally on Ollama v0.35.1, pull the model and invoke the system endpoint:

```bash
curl http://localhost:11434/v1/systemone -d '{
  "model": "clef-flash",
  "state": "The user took this screenshot.",
  "images": ["<base64-encoded-image>"],
  "questions": {
    "has_ollama": {"type": "noul", "instructions": "Does this image contain Ollama?"}
  }
}'
```

You can verify the enforced capabilities on any local model by running `ollama show <model-name>` in your terminal.

## Sources

* [Ollama v0.35.1 Release Notes](https://github.com/ollama/ollama/releases/tag/v0.35.1)
