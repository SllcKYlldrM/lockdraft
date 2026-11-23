---
title: Thinking Machines Lab Releases Inkling 2 Mini Looped MoE Model
published: 2026-11-23T20:42:42.223Z
draft: false
description: >-
  Inkling 2 Mini uses a 24-layer physical looped architecture to run 48 logical
  layer visits for local multimodal inference.
tags:
  - ai-news
  - open-source-llms
  - model-release
category: AI News
author: LockDraft
sourceLink: 'https://huggingface.co/blog/inkling2mini'
---

## What changed

Thinking Machines Lab has released Inkling 2 Mini, a multimodal Mixture-of-Experts (MoE) looped transformer model designed for local deployments. The model contains roughly 26 billion total physical parameters with 3 billion active parameters per token, supporting both image and text inputs across a 1M-token context window.

Inkling 2 Mini uses a weight-reusing loop structure to expand its effective depth. Although the decoder consists of 24 physical layers, it runs 48 logical layer passes per token:

* **Layer layout:** Layers 0–5 run once, middle layers 6–17 repeat three times in a loop, and final layers 18–23 run once (6 + 3*12 + 6 = 48 layer visits).
* **Cross-pass messaging:** Each pass through layers 6–17 accepts the initial output from layer 5 as input. Information passes between iterations via learned query, key, value, and MLP cross-pass messages. A gating controller determines how much state to retain or add per pass.
* **Attention and routing:** Features a hidden size of 2,304, 24 query heads, and 8 KV heads. Each layer selects 8 out of 128 SwiGLU experts per token (expert intermediate width is 1,152).
* **Quantization and speed:** Shipped in a mixed-precision format with NVFP4 and MXFP8 expert weights. It includes a DSpark drafter to yield additional speed-ups at a small memory cost.

Along with the primary model (`thinkingmachines/Inkling-2-Mini`), a research artifact (`thinkingmachines/TML-d24-varloop-research`) was released to allow dynamic adjustment of the loop iterations during generation.

## Why it matters

By executing 48 layer passes across 24 physical layers, Inkling 2 Mini minimizes memory overhead while delivering performance competitive with larger models. In benchmarking on the Artificial Analysis Intelligence Index v5 (AAv5), Inkling 2 Mini led 32 out of 48 benchmark suites when compared against Gemma 4 31B, Muse Glimmer, Qwen3.8-27B, and Nemotron 3.5 Super VL. For local coding tasks, it secured top scores on FrontierCode v2.0 and tied Qwen3.8-27B on Terminal-Bench 4.0.

This release highlights growing interest in parameter-efficient open weights, alongside specialized domain releases like [Ai2's open-source AstaBrief 8B model](/posts/ai2-open-sources-astabrief-8b-for-fast-scientific-report-generation/).

### Limitations
While the variable-loop research checkpoint (`TML-d24-varloop-research`) allows users to reduce pass counts to 1 or 2 for faster inference, doing so can degrade output quality. Thinking Machines Lab notes that further validation is required to fully evaluate variable looping behavior across broader benchmarks.

## What to do next

Inkling 2 Mini offers broad integration support across standard frameworks, including `transformers`, `llama.cpp`, `MLX`, and `SGLang` for datacenter deployments.

To run the base model using Hugging Face `transformers`:

```python
import torch
from transformers import AutoModelForMultimodalLM, AutoProcessor

model_id = "thinkingmachines/Inkling-2-Mini"

processor = AutoProcessor.from_pretrained(model_id)
model = AutoModelForMultimodalLM.from_pretrained(
    model_id,
)

messages = [{"role": "user", "content": [{"type": "text", "text": "Why is the sky blue?"}]}]

inputs = processor.apply_chat_template(
    messages, tokenize=True, add_generation_prompt=True, return_dict=True, return_tensors="pt",
).to(model.device)
input_len = inputs["input_ids"].shape[-1]

outputs = model.generate(**inputs, max_new_tokens=1024)
print(processor.decode(outputs[0][input_len:], skip_special_tokens=False))
```

### Adjusting reasoning effort
You can set the `reasoning_effort` parameter inside `processor.apply_chat_template()`. It accepts named levels (`none`, `minimal`, `low`, `medium`, `high`, `xhigh`, `max`) or numeric floats from `0.0` to `0.99` (default is `high` / `0.9`).

### Variable-loop checkpointing
To test the research variant with fewer loop passes, initialize `thinkingmachines/TML-d24-varloop-research` and pass `text_config={"loop_num_passes": 2}` (or `1`) to `AutoModelForMultimodalLM.from_pretrained()`.

## Sources

* [Hugging Face Blog: Welcome Inkling 2 Mini](https://huggingface.co/blog/inkling2mini)
