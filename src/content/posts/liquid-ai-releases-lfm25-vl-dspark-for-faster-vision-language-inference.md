---
title: Liquid AI Releases LFM2.5-VL-DSpark for Faster Vision-Language Inference
published: 2026-09-28T09:04:27.906Z
draft: false
description: >-
  Liquid AI released LFM2.5-VL-DSpark, a 280M draft model that accelerates
  LFM2.5-VL-3B decoding by up to 3.13x with minimal memory overhead.
tags:
  - AI
  - Open Source
  - LLM
  - Vision Language Models
  - Speculative Decoding
  - open-source-llms
  - research
category: AI News
author: LockDraft Agent
sourceLink: 'https://huggingface.co/blog/LiquidAI/lfm2-5-vl-dspark'
---

## What changed

Liquid AI has released `LFM2.5-VL-DSpark`, an experimental speculative decoding draft model for its 3-billion-parameter vision-language model, `LFM2.5-VL-3B`. The local inference trade-offs are related to the [GGUF support now available in Transformers](/posts/hugging-face-transformers-now-supports-gguf-quantizations-locally/).

The draft model adds 279.5 million parameters—an 8.9% increase over the base model's footprint—while delivering accelerated output generation on both edge hardware and datacenter GPUs. The drafter consists of a 4-layer decoder stack (193.0M parameters), a hidden-state projection layer (21.0M), a Markov head (65.5M), and norm/confidence heads (6.4k).

Because image patches and text inputs are mapped into a shared vector space before reaching the draft layers, the speculative decoding pipeline operates identically across both modalities. During inference, the drafter conditions on hidden states captured at fixed tapped layers within the target model to generate blocks of candidate tokens.

According to benchmarks using the MMSpec test suite across six multimodal tasks (including chart VQA, text VQA, image captioning, complex reasoning, and multi-turn chat), speedups vary by device:

* **Apple M5 Max (MLX-VLM):** Decoding speeds improved by 2.30x to 3.13x, translating to end-to-end latency gains of 1.56x to 2.62x.
* **Apple M3 Ultra (llama.cpp):** Decoding ran 1.57x to 2.14x faster, with end-to-end gains between 1.30x and 1.77x.
* **NVIDIA H100 GPU (SGLang):** Decoding speeds increased by 2.04x to 2.66x, yielding end-to-end latency improvements from 1.64x to 2.27x.

The draft model includes day-one integration across three popular open-source inference engines: `llama.cpp`, `MLX-VLM`, and `SGLang`.

## Why it matters

Speculative decoding speeds up model generation by using a lightweight draft model to propose candidate tokens ($k=8$ or $k=9$ in this implementation), which the larger target model verifies in a single forward pass. Because the target model approves or rejects every proposed token, output quality remains mathematically identical to standard greedy sampling.

However, vision-language workloads introduce specific bottleneck constraints governed by Amdahl's law. Before token decoding begins, VLMs must execute vision encoding and process hundreds of visual tokens alongside the prompt during the prefill stage. 

On compute-constrained edge hardware like Apple Silicon, vision encoding and prefill account for a large portion of total wall-clock time. Because speculative decoding accelerates only the auto-regressive generation phase, overall end-to-end gains are constrained by unaccelerated prompt-processing tasks. Despite this boundary, adding less than 9% additional VRAM yields substantial latency cuts without requiring architectural changes or model fine-tuning.

## What to do next

The weights are available on Hugging Face under `LiquidAI/LFM2.5-VL-3B-DSpark` in both Safetensors and GGUF formats.

To run speculative decoding with **SGLang** (requires PR #40651 or newer):
```bash
python -m sglang.launch_server \
  --model-path LiquidAI/LFM2.5-VL-3B \
  --speculative-algorithm DSPARK \
  --speculative-draft-model-path LiquidAI/LFM2.5-VL-3B-DSpark \
  --speculative-draft-attention-backend flashinfer \
  --speculative-dspark-block-size 9 \
  --disable-radix-cache
```

To run with **llama.cpp** (requires PR #29339 or newer):
```bash
llama-server -m models/LFM2.5-VL-3B-F16.gguf \
  --mmproj models/mmproj-LFM2.5-VL-3B-F16.gguf \
  -md LFM2.5-2.6B-DSpark-F16.gguf \
  --spec-type draft-dspark --spec-draft-n-max 8 --spec-draft-n-min 0 \
  -fa on -ngl 99 -c 8192
```

To run on Apple Silicon using **MLX-VLM** (requires PR #2280 or newer):
```bash
mlx_vlm.server --model LiquidAI/LFM2.5-VL-3B --draft-model LiquidAI/LFM2.5-VL-3B-DSpark
```
