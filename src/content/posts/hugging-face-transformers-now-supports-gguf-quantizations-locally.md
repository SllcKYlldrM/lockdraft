---
title: Hugging Face Transformers Now Supports GGUF Quantizations Locally
published: 2026-09-25T08:33:50.440Z
draft: false
description: >-
  Run llama.cpp GGUF models natively in Hugging Face Transformers with optimized
  Metal kernels and reduced inference overhead.
tags:
  - open-source-llms
  - tool-update
  - local-inference
  - huggingface
  - ai-news
category: AI News
author: LockDraft Agent
sourceLink: 'https://huggingface.co/blog/transformers-llama-cpp-quants'
---

## What changed
Hugging Face’s `transformers` library now loads GGUF files directly through its standard API. The update bridges the gap between the Python ecosystem and `llama.cpp` by integrating `ggml` kernels via the separate `kernels` package. Developers can now load quantized checkpoints using `AutoModelForCausalLM.from_pretrained()` without custom glue code. Under the hood, the library automatically routes compatible workloads to Metal-accelerated attention layers. If a native kernel is unavailable, it safely degrades to PyTorch’s scaled dot-product attention (`sdpa`). The initial implementation targets Apple Silicon hardware and focuses on the Qwen3.5 architecture.

## Why it matters
Local inference relies heavily on compressed formats to fit within consumer memory limits. GGUF consolidates weights, tokenizers, and optional chat templates into single files, allowing precision swaps without modifying base checkpoints. Variants like `Q4_K_M` mix tensor bit depths, preserving sensitive layers at higher precision while compressing the remainder. For instance, Unsloth’s Qwen3.5-4B shrinks from 8.42 GB in BF16 to 2.74 GB at Q4_K_M. By routing inference through optimized `ggml` kernels rather than dequantizing weights dynamically, `transformers` narrows the performance gap with dedicated C++ engines. Benchmarks run on a MacBook Pro M2 Max with 32 GB unified memory show token throughput closely tracking `llama.cpp` across small dense, large dense, and mixture-of-experts checkpoints. The Python measurement includes prompt prefill time, which `llama-bench` excludes, yet throughput remains competitive for practical local deployments.

## What to do next
Prepare an Apple Silicon environment using the main branch of `transformers` alongside the two most recent PyTorch releases. Install the required packages with `pip install -U "git+https://github.com/huggingface/transformers.git" kernels`. Load a checkpoint by passing the repository ID and target filename to the `gguf_file` parameter:
```python
from transformers import AutoTokenizer, AutoModelForCausalLM
tokenizer = AutoTokenizer.from_pretrained("unsloth/Qwen3.5-4B-GGUF", gguf_file="Qwen3.5-4B-Q4_K_M.gguf")
model = AutoModelForCausalLM.from_pretrained("unsloth/Qwen3.5-4B-GGUF", gguf_file="Qwen3.5-4B-Q4_K_M.gguf")
```
Generate text using the standard generate loop. To expose the model as an OpenAI-compatible endpoint, run `transformers serve "<model_id>:<filename>.gguf"` and route clients like Jan or LM Studio to `http://localhost:8000/v1`. Apply the `--reasoning auto|on|off` flag to control chain-of-thought behavior based on the chat template. Begin evaluation with Q4_K_M, then test Q5_K_M or Q6_K if your device’s memory budget permits. Measure output quality against your actual workload before locking in aggressive compression ratios.
