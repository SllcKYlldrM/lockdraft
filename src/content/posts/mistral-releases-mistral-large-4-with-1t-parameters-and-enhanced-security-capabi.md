---
title: >-
  Mistral Releases Mistral Large 4 with 1T Parameters and Enhanced Security
  Capabilities
published: 2026-10-29T15:39:26.349Z
draft: false
description: >-
  Mistral Large 4 features a 1T Mixture-of-Experts architecture, 1M context, and
  top scores on coding and security benchmarks.
tags:
  - Open Source
  - LLM
  - AI Agents
  - ai-news
  - open-source-llms
  - model-release
category: AI News
author: LockDraft
sourceLink: 'https://huggingface.co/blog/mistral-large4'
---

## What changed

Mistral AI has released Mistral Large 4 (codenamed "Le Chonk"), an open-weight, multimodal Mixture-of-Experts (MoE) model. The architecture features roughly 1 trillion total parameters with 49 billion active parameters per token, supported by a 1-million-token context window. It handles text and image inputs to generate text responses.

The model's text decoder consists of 72 layers, a hidden dimension of 6,144, and 64 attention heads. It combines Multi-head Latent Attention (MLA) with DeepSeek Sparse Attention (DSA) indexing to select up to 2,048 key positions per query. Across its layers, three out of every four layers use YaRN-scaled RoPE ("LeRope") while the fourth uses NoPE (a 3:1 ratio), with key-value state shared across layers. The first layer uses dense feed-forward processing, while layers 2 through 72 use MoE blocks where a router selects 4 out of 128 experts alongside one shared active expert (5 active experts total per token).

For vision processing, Mistral Large 4 includes a 1.6-billion-parameter Pixtral encoder with 30 layers, 16 attention heads, and a hidden dimension of 2,048 using 14x14 patches. The model is released in FP8 and NVFP4 formats under the Mistral Ecosystem Open-Weight License, an MIT derivative that restricts managed model-as-a-service offerings. GGUF quantizations are also available from Unsloth and the llama.cpp team.

## Why it matters

Mistral Large 4 delivers notable capabilities in defensive cybersecurity, software development, and autonomous agent workflows. As of late October 2026, it ranks fifth among open-weight models on the Artificial Analysis Intelligence index.

Key performance metrics include:
- **Cybersecurity:** Achieved 82% on the Artificial Analysis Cyber Index for reproducing and patching software flaws, outperforming proprietary frontier models that refuse security tasks. It also solved 93% of challenges in Cybench and demonstrated 93.3% attack resistance on Lakera's B3 prompt-injection benchmark.
- **Coding Agents:** Reached a 49.8% combined score on the Coding Agent Index (61.7% on DeepSWE v1.1, 59.4% on SWE-Atlas-QnA, and 28.3% on Terminal-Bench 4), positioning it ahead of DeepSeek V4 Pro 0813 and Qwen3.8 Max.
- **Professional Workflows:** Scored 59.9% on AutomationBench and earned a 1,393 Elo rating on AA-Briefcase.

Because open-weight releases give organizations full control over deployment, security teams can perform vulnerability research, malware analysis, and detection rule creation without risk of automated API refusal filters or sudden access loss during incident response.

## What to do next

Developers can deploy Mistral Large 4 immediately through Hugging Face Transformers, vLLM, or llama.cpp. 

When running via Transformers, hardware execution relies on tensor and expert parallelism configured through `DistributedConfig`:

```python
import os
from transformers import AutoProcessor, AutoModelForMultimodalLM, DistributedConfig

distributed_config = DistributedConfig(
    tp_size=int(os.environ["WORLD_SIZE"]),
    ep_size=int(os.environ["WORLD_SIZE"]),
)

model_id = "mistralai/Mistral-Large-4-1T-A52B"
processor = AutoProcessor.from_pretrained(model_id)
model = AutoModelForMultimodalLM.from_pretrained(
    model_id,
    distributed_config=distributed_config,
)
```

The model supports configured reasoning depth (`low`, `medium`, `high`). Enterprise deployments can also host the checkpoints using Hugging Face Inference Endpoints or the Dell Enterprise Hub.

### Limitations and Caveats

- **Non-disableable reasoning:** The model requires reasoning execution; attempting to pass `reasoning_effort: none` in execution parameters will still default to high reasoning effort.
- **Licensing restrictions:** The Mistral Ecosystem Open-Weight License permits self-hosting and adaptation but limits commercial third-party model-as-a-service distribution.
- **Resource overhead:** Despite routing only 49B parameters dynamically, hosting the full 1-trillion-parameter base model demands multi-GPU clusters capable of managing massive VRAM footings.

For related LockDraft context, see [Ai2 Open-Sources AstaBrief 8B for Fast Scientific Report Generation](/posts/ai2-open-sources-astabrief-8b-for-fast-scientific-report-generation/).
## Sources
- [Hugging Face Blog](https://huggingface.co/blog/mistral-large4)
