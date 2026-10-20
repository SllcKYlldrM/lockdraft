---
title: >-
  Deploying Self-Hosted n8n AI Workflows on NVIDIA DGX Spark with Zero Cloud
  APIs
published: 2026-10-20T20:14:34.451Z
draft: false
description: >-
  Learn how to run a full local AI stack—including Qwen3.6 MoE, Whisper, and
  OCR—on an NVIDIA DGX Spark for privacy-first n8n workflows.
tags:
  - n8n
  - Open Source
  - ai-news
  - tool-update
category: Automation
author: LockDraft
sourceLink: 'https://blog.n8n.io/n8n-nvidia-dgx-spark/'
---

## What changed

n8n has detailed a design pattern for deploying a fully air-gapped, self-hosted AI architecture on an NVIDIA DGX Spark desktop workstation. The setup serves multiple local models behind a unified LiteLLM proxy, allowing standard n8n OpenAI nodes to execute multimodal tasks—such as call transcription, document extraction, text generation, and image generation—without transmitting data to external cloud APIs.

The deployment relies on the DGX Spark's GB10 Grace Blackwell Superchip, which features 128GB of unified memory shared between the CPU and GPU (with Linux reporting roughly 121GB of total available memory) and a memory bandwidth of 273 GB/s. 

To keep all required models simultaneously loaded in unified memory, the architecture pairs lightweight specialized models with a single primary Mixture-of-Experts (MoE) LLM for all text, vision, and reasoning jobs. All models in the stack carry permissive commercial licenses (Apache 2.0 or MIT):

- **Primary LLM/Vision/Coding:** `nvidia/Qwen3.6-35B-A3B-NVFP4` (Apache 2.0; 35B total parameters, ~3B active parameters per token)
- **Embeddings:** `Qwen/Qwen3-Embedding-4B` (Apache 2.0)
- **Reranking:** `Qwen/Qwen3-Reranker-0.6B` (Apache 2.0)
- **Speech-to-Text:** `openai/whisper-large-v3-turbo` (MIT)
- **Document OCR:** `zai-org/GLM-OCR` (MIT)
- **Image Generation:** `Tongyi-MAI/Z-Image-Turbo` (Apache 2.0)
- **Text-to-Speech:** `hexgrad/Kokoro-82M` (Apache 2.0)

In testing on the DGX Spark, the main `Qwen3.6-35B-A3B-NVFP4` model delivered 120 tokens per second for a single user and 359 tokens per second total across eight concurrent users (inclusive of model reasoning tokens).

## Why it matters

For organizations operating under strict legal, regulatory, or privacy mandates—such as law firms, accounting practices, and healthcare clinics—sending customer data to cloud API providers introduces compliance risks and data sovereignty issues. Self-hosting the entire AI stack on local hardware ensures data remains strictly within physical premises and under internal audit control.

From an automation architecture standpoint, routing all models through a single LiteLLM gateway exposes an OpenAI-compatible endpoint. This allows teams [building custom automation workflows](/posts/first-n8n-workflow/) or configuring [dedicated agents](/posts/n8n-introduces-dedicated-agents-with-native-workflow-and-mcp-tool-integration/) to point n8n directly to local IP addresses while enforcing per-team API keys and rate management.

## What to do next

Practitioners looking to replicate this air-gapped setup on a DGX Spark should follow these configuration steps:

1. **Pre-cache and lock models:** Download models locally using the `huggingface_hub` CLI and save specific commit hashes into a `models.lock` file. Start containers using the `--revision` flag referencing these commits to guarantee offline execution and protection against upstream license or weight modifications.
2. **Pin vLLM container versions:** Use the official `vllm/vllm-omni:v0.30.0` arm64 container rather than unpinned floating tags (like `cu130-nightly`, which can lock to older vLLM releases that fail to parse newer Qwen model architectures). Because `vllm-omni` does not use `vllm serve` as its default entrypoint, wrap the container with a custom Dockerfile.
3. **Optimize serving parameters:** Serve the primary LLM container using explicit memory and kernel flags:
   - Set `--gpu-memory-utilization 0.32` to cap the LLM at ~32% of unified memory, leaving room for background services (Whisper, OCR, TTS, image generation).
   - Enable `--kv-cache-dtype fp8` to halve the memory overhead of the KV cache.
   - Set `--moe-backend marlin` for quantized expert layers.
   - Enable speculative execution using multi-token prediction via `--speculative-config '{"method":"mtp","num_speculative_tokens":3,"moe_backend":"triton"}'`.
   - Specify `--reasoning-parser qwen3` and `--tool-call-parser qwen3_xml` to handle tool calls and reasoning outputs cleanly.

### Limitations and caveats

While NVFP4 quantization reduces memory weight transfer overhead by storing weights in 4-bit format via the Marlin kernel (`MarlinNvFp4LinearKernel`), current vLLM builds on the GB10 chip perform mathematical operations in 16-bit precision rather than native FP4 computation. Additionally, initial cold startup times for the primary LLM container take approximately 311 seconds before serving endpoints become fully available.

## Sources

- [n8n Blog: Run your n8n AI workflows on NVIDIA DGX Spark, with no cloud API](https://blog.n8n.io/n8n-nvidia-dgx-spark/)
