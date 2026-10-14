---
title: Liquid AI Releases LFM2.5-24B-A2B for Fast On-Device Agentic Workflows
published: 2026-10-14T14:19:52.707Z
draft: false
description: >-
  Liquid AI's open-weight 24B MoE reasoning model built for local agent
  execution, featuring 2B active parameters and explicit chain-of-thought
  generation.
tags:
  - LLM
  - model-release
  - ai-news
  - open-source-llms
category: AI News
author: LockDraft
sourceLink: 'https://huggingface.co/blog/LiquidAI/lfm25-24b-a2b'
---

## What changed
Liquid AI has published LFM2.5-24B-A2B, an open-weight reasoning model engineered specifically for autonomous agent workflows. The architecture retains a 24-billion parameter foundation but activates only 2 billion parameters per token through a mixture-of-experts configuration. This setup utilizes top-4 routing across 64 experts within 40 layers, paired with gated short convolutions and grouped query attention. The context window expanded from 32,000 to 131,000 tokens, while an in-place tokenizer expansion doubled the vocabulary from 65,000 to 128,000 tokens to improve non-Latin language handling. Unlike earlier iterations, this release functions strictly as a reasoning model that generates an explicit chain of thought before committing to a final output.

Training followed a structured progression. Initial pre-training scaled from approximately 17 trillion to 33 trillion tokens. Mid-training then divided into two distinct phases: 2 trillion tokens processed at a 32K context length focused on reasoning, mathematics, coding, instruction compliance, and multilingual text, followed by 300 billion tokens trained at the extended 131K context length prioritizing long-document comprehension. Agentic behaviors were integrated throughout via supervised fine-tuning, teacher specialization, multi-domain on-policy distillation, and reinforcement learning conducted directly inside agent environments like OpenClaw, Hermes Agent, Pi, and OpenCode.

In direct evaluations, LFM2.5-24B-A2B competes specifically with similarly sized mixture-of-experts models, most notably Qwen3.6-35B-A3B. It outperforms its primary MoE rival on AutomationBench (27.69 versus 8.72), BFCLv4 (65.01 versus 65.00), ToolSandbox (80.71 versus 75.02), LiveClaw (48.09 versus 38.19), and τ³-Bench Banking (8.04 versus 7.63). It also leads all three instruction-following benchmarks tested. For broader context on how open models stack up in enterprise environments, you can review our analysis of [Gemini 4 Argon's engineering benchmarks](/posts/gemini-4-argon-released-global-access-pricing-and-engineering-benchmarks/).

## Why it matters
Running autonomous agents locally requires balancing capability with computational overhead. By restricting active parameters to 2 billion per token, LFM2.5-24B-A2B significantly reduces memory bandwidth demands and inference latency compared to dense alternatives. This efficiency translates to measurable throughput gains: the model decodes at 184 tokens per second on an Apple M5 Max chip and reaches 114 tokens per second on AMD’s Ryzen AI Max+ 395 processor. On server-grade hardware, a single NVIDIA B300 GPU can push over 21,000 output tokens per second under high concurrency.

The explicit reasoning step means the model structures its tool-calling logic before committing to actions, which improves reliability in multi-step agent harnesses. Combined with day-one compatibility across llama.cpp, MLX, vLLM, SGLang, and ONNX, developers can deploy private, always-on agents without relying on third-party APIs or incurring unpredictable cloud costs.

## What to do next
To integrate the model into your stack, start by upgrading your transformer library to version 5.0.0 or newer. Load the weights using standard PyTorch pipelines, specifying `device_map="auto"` and `dtype="bfloat16"`. If your GPU supports Flash Attention 2, uncomment the corresponding implementation flag to maximize efficiency.

For agent orchestration, serve the model behind any OpenAI-compatible API endpoint and route your harness configuration accordingly. Port assignments vary by runtime: llama.cpp and MLX default to 8080, vLLM uses 8000, SGLang listens on 30000, and LM Studio operates on 1234. Set your harness to expect chat completions, enforce tool-use validation, and allocate the full 131,072 token context window. Fine-tuning guides are available for adapting the base weights to domain-specific trajectories.

**Limitations & Caveats**
While LFM2.5-24B-A2B excels at tool invocation and procedural task completion, it trails larger peers on knowledge-dense and complex coding benchmarks. Scores on GPQA Diamond, HLE, AA-Omniscience, SWE-Bench Verified, and SciCode remain lower than comparable 30B+ models. For workloads requiring deep factual recall or extensive software engineering verification, pair this model with retrieval-augmented generation or external web search to compensate for its smaller active parameter footprint.

Sources:
- [LFM2.5-24B-A2B Release Blog](https://huggingface.co/blog/LiquidAI/lfm25-24b-a2b)

## Sources

- [Official source](https://huggingface.co/blog/LiquidAI/lfm25-24b-a2b)
