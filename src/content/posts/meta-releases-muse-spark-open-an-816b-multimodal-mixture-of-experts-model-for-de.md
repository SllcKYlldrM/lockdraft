---
title: >-
  Meta Releases Muse Spark Open: An 816B Multimodal Mixture-of-Experts Model for
  Developer Agents
published: 2026-10-18T12:49:25.203Z
draft: false
description: >-
  Meta has released Muse Spark Open, an 816B parameter open-weight MoE model
  designed for agentic coding and multimodal tasks with up to 1M context.
tags:
  - Open Source
  - ai-news
  - open-source-llms
  - model-release
category: AI News
author: LockDraft
sourceLink: 'https://huggingface.co/blog/meta-muse-spark-open'
---

## What changed

Meta has launched **Muse Spark Open**, an open-weight multimodal mixture-of-experts (MoE) model. Built primarily for agentic coding tasks, the model integrates text, image, audio, and video inputs to generate text responses.

Key architectural specifications include:

- **Parameter Scale:** Approximately 816 billion total parameters, with roughly 42 billion active parameters per token.
- **MoE Layer Configuration:** 62 transformer layers with a hidden dimension of 8192. Each MoE block features 256 experts (accounting for ~97% of total parameters), with top-8 routing per token. Experts project from 8192 to 4096 dimensions before returning to 8192.
- **Attention Mechanism:** Grouped-query attention utilizing 128 query heads and 16 key-value heads (head dimension of 64). Features include QK-normalization and learned residual gates for layer connection.
- **Context Length:** A max context window of 1,048,576 tokens (1M tokens) across all input modalities.
- **Perception Encoders:** Uses a 1.8B parameter encoder (50 layers, hidden dim 1536, 14x14 patch split, producing 4096-dimensional features) for images and video. Audio relies on a convolutional pyramid encoder emitting one token every 80 ms (12.5 tokens per second).
- **Checkpoints & Hardware:** Released in BF16 (`Muse-Spark-Open-816B-A42B`, requiring ~1.5 TB safetensors) and NVFP4 4-bit precision (`Muse-Spark-Open-816B-A42B-NVFP4`). BF16 inference requires 4 nodes of 8 NVIDIA H200 GPUs (Tensor Parallelism = 32), while the NVFP4 checkpoint can run on a single NVIDIA B200 node.

## Why it matters

While smaller local releases like Muse Glimmer targeted local edge execution, Muse Spark Open is built for heavy developer automation. Meta trained the model specifically around complex coding agents capable of analyzing full codebases, managing multi-file refactoring, debugging over extended sessions, executing external tools, and processing visual developer interfaces—such as examining screen recordings or reading UI screenshots alongside text prompts.

Because only 8 of the 256 experts are activated per token, the compute burden during inference matches that of a 42B dense model. However, because all 256 experts must reside in VRAM, deployment memory overhead remains high. At a 1M token context window, the KV cache alone demands roughly 266 GB of VRAM in BF16 (~250 KB per token).

Additionally, Meta natively integrated controllable reasoning parameters. The model accepts discrete reasoning levels (`low`, `medium`, `high`, `xhigh`), which map to internal reasoning budgets of 16, 64, 256, and 512 step tokens respectively.

## What to do next

Developers can deploy and fine-tune Muse Spark Open across several standard open-source tools:

- **Inference Integration:** Official recipes are supported in `vLLM`, `SGLang`, and `llama.cpp`.
- **Hugging Face Framework:** Load models using `MuseSparkForConditionalGeneration` and process multimodal inputs via `MuseSparkProcessor`. Parallel execution can be configured directly in code using `DistributedConfig` to define tensor parallelism (`tp_size`) and expert parallelism (`ep_size`).
- **Reasoning Optimization:** Unlike typical text models, reasoning cannot be completely disabled on Muse Spark Open. To conserve tokens on simpler queries, developers should explicitly pass `reasoning_effort="low"` in `processor.apply_chat_template` or inject `Reasoning strength: 1` into the system prompt.

As developer automation shifts from simple code completion toward multimodal long-context agents—similar to API patterns seen in [Claude's integration surface](/posts/architecting-with-claude-an-in-depth-developers-guide-to-anthropics-api-surface/) or [Gemini 4 Argon](/posts/gemini-4-argon-released-global-access-pricing-and-engineering-benchmarks/)—Muse Spark Open provides an open-weight alternative for local cluster execution.

### Limitations and Caveats
The infrastructure threshold for running Muse Spark Open is substantial. Due to its ~1.5 TB memory footprint in BF16, self-hosting requires multi-node H200 clusters or specialized Blackwell hardware for NVFP4 execution. Furthermore, mandatory reasoning tokens mean token generation latency and costs cannot be stripped down to plain autoregressive text generation without at least minimal reasoning overhead.

## Sources

- [Hugging Face Blog: Welcome Muse Spark Open](https://huggingface.co/blog/meta-muse-spark-open)
