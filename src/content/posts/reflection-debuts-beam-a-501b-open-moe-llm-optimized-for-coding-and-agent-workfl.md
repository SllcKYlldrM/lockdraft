---
title: >-
  Reflection Debuts Beam: A 501B Open MoE LLM Optimized for Coding and Agent
  Workflows
published: 2026-10-17T12:29:55.111Z
draft: false
description: >-
  Reflection releases Beam, a 501B open-source MoE LLM featuring 1M context, 23B
  active parameters per token, and Apache 2.0 licensing.
tags:
  - Open Source
  - AI Agents
  - ai-news
  - open-source-llms
  - model-release
category: AI News
author: LockDraft
sourceLink: 'https://huggingface.co/blog/reflection-beam'
---

## What changed

US-based AI lab Reflection has released Beam, an open-weights, text-only Mixture-of-Experts (MoE) language model containing 501 billion total parameters. Distributed under an Apache 2.0 license, Beam requires only 23 billion active parameters per token during inference, giving it the operational speed of a much smaller model while maintaining a large parameter capacity.

Beam's architectural design features 52 decoder layers with a 5,120 hidden dimension. The initial three layers consist of dense SwiGLU MLPs, while the remaining 49 layers use MoE blocks containing 256 experts each. Each expert is a SwiGLU MLP with an intermediate size of 2,560 (~39 million parameters), accounting for 98.4% of the model's overall weight count. Routing follows DeepSeek-V3's group-limited framework: experts are scored via sigmoid, divided into 8 groups of 32, and the top 4 groups are selected to route a total of 8 active experts per token without shared experts.

Attention handling combines two distinct approaches across a 1-million-token context window:
- **Sliding-Window Attention:** 43 layers use a fixed 512-token sliding window paired with standard Rotary Position Embeddings (RoPE).
- **Global Attention:** 9 layers (every sixth layer plus the final layer) attend to the full sequence length without positional encodings. Instead, global layers use scalable-softmax query scaling—multiplying queries by `(1 + (pos + 1) / 2048) ** 0.1`—to maintain precision over extended contexts.

By restricting full context tracking to the 9 global layers, Beam keeps its Key-Value (KV) cache memory footprint to roughly 36 KiB per token (compared to ~208 KiB per token for fully global architectures). At the full 1M token context length, a single sequence requires 36.08 GiB of KV cache in BF16.

Additional architectural details include Grouped-Query Attention (48 query heads, 8 KV heads), RMSNorm on query and key vectors, learned sigmoid gating prior to output projection, and a square-root weighted residual connection stream that maintains constant scale across all 104 internal sublayer additions. Final logits pass through an FP32-calculated tanh softcap set at ±30.

Beam provides multi-turn reasoning context retention (`preserve_thinking`), structured grammar support for tool execution, and five selectable reasoning modes: `low`, `medium` (default), `high`, `xhigh`, and `max`. Speculative decoding is supported via a DFlash2 drafter model.

On public evaluations provided by Reflection, Beam achieved the following benchmark scores:
- **SWEBench Verified:** 81.6% (BF16), 80.2% (FP8), 80.7% (NVFP4)
- **Terminal Bench v2.1:** 80.1% (BF16)
- **SWE Bench Pro v2-Hard:** 76.5% (BF16), 78.6% (NVFP4)
- **AIME 2026:** 97.7% (BF16)
- **GPQA Diamond:** 90.6% (BF16)
- **MCP Atlas:** 80.8% (BF16)

## Why it matters

While developers often look to proprietary API endpoints when building agentic systems—such as those detailed in our guide to [Architecting with Claude](/posts/architecting-with-claude-an-in-depth-developers-guide-to-anthropics-api-surface/)—Beam brings frontier-scale parameter capacity into a self-hostable, permissive open-source format. 

By leveraging sparse routing (23B active parameters out of 501B total) alongside a 9-layer global attention footprint, Beam drastically reduces standard compute and memory barriers associated with massive context windows. Its dedicated tool-calling grammar, token-level reasoning toggles, and multi-turn reasoning preservation target technical automation workflows, specifically software engineering agents and terminal execution systems.

Ecosystem support is available on day zero across `transformers`, `vLLM`, and `SGLang`, alongside full-parameter reinforcement learning recipes via the Miles framework and a dedicated open-source Rust inference harness.

## What to do next

Engineers looking to evaluate or deploy Beam can access model checkpoints on Hugging Face:

- **Weight Quantizations:** Checkpoints are available in BF16 (~1 TB safetensors), FP8 (targeted at NVIDIA Hopper and Ampere GPUs), and 4-bit NVFP4 (~280 GB, optimized for NVIDIA Blackwell architectures).
- **Deployment Frameworks:** Official execution recipes are available for vLLM, SGLang, and Reflection's Rust harness.
- **Community Incentives:** Reflection and Hugging Face are running a competition offering $10,000 in Hub credits for projects built using Beam—including Spaces demos, custom hardware quantizations, synthetic datasets, RL environments, or public benchmarks submitted to the model repository.

**Limitations and Caveats:** Although active compute per token matches a 23B parameter model, hosting Beam requires storing all 501B parameters (and 256 expert weights) in GPU memory simultaneously. As a result, deployment requires a substantial hardware setup (at least ~280 GB VRAM even in NVFP4). Additionally, Beam is strictly a text-in, text-out model and does not natively support image or audio inputs.

## Sources

- [Hugging Face Blog: Welcome Beam](https://huggingface.co/blog/reflection-beam)
