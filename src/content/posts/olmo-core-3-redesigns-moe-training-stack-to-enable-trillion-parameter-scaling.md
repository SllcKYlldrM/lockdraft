---
title: Olmo-core 3 Redesigns MoE Training Stack to Enable Trillion-Parameter Scaling
published: 2026-10-02T15:09:53.360Z
draft: false
description: >-
  Olmo-core 3 shifts from FSDP to DDP, delivering a 2.7x throughput boost and
  scaling open MoE model training to over one trillion parameters.
tags:
  - open-source-llms
  - ai-news
  - model-release
category: AI News
author: LockDraft
sourceLink: 'https://huggingface.co/blog/allenai/olmocore3'
---

## What changed

Allen Institute for AI has released Olmo-core 3, a major architectural redesign of its open-source training infrastructure for Mixture-of-Experts (MoE) language models. The framework is built to scale MoE training into the trillion-parameter range while maximizing hardware efficiency.

The most significant architectural shift is the transition from Fully Sharded Data Parallelism (FSDP) to a system based on Distributed Data Parallelism (DDP). Rather than constantly gathering and resharding model weights for every small data batch, Olmo-core 3 keeps experts resident on the GPUs and routes the training data directly to them. 

In early testing on eight NVIDIA B300 GPUs, this redesign allowed a 47-billion-parameter MoE model to process 52,000 tokens per second per GPU—a 2.7x increase over the 19,400 tokens per second achieved with the previous FSDP-based stack. 

To achieve these speeds, Olmo-core 3 combines several optimization strategies:
* **Hybrid Parallelism:** It integrates expert parallelism (distributing experts across GPUs), pipeline parallelism (splitting layers across GPU groups), and a distributed optimizer (sharding optimizer states) to prevent any single GPU from needing to hold the entire model in memory.
* **Efficient Routing and Computation:** The framework uses rowwise expert parallelism to place routed data directly into expert input buffers, keeps routing metadata on GPUs to avoid CPU bottlenecks, and groups small expert GEMM (General Matrix Multiply) operations.
* **MXFP8 Support:** The system introduces support for the lower-precision MXFP8 format. In a 4-GPU benchmark, enabling MXFP8 increased end-to-end training throughput by 21% compared to BF16, while reducing peak active memory from 103 GiB to 95 GiB.

These optimizations allow the framework to scale capacity with minimal overhead. In one benchmark, increasing the expert pool from 8 to 128 (while keeping active parameters fixed at 3.2 billion per token) grew total parameter capacity from 4.6 billion to 47 billion, while training throughput dropped by less than 5%.

## Why it matters

MoE architectures offer a highly efficient way to scale LLMs because they only activate a subset of specialized "experts" for any given token. However, as these models grow, the communication overhead of routing tokens to the correct GPUs can quickly eliminate those computational savings. 

By releasing Olmo-core 3 as an open-source framework, the Allen Institute for AI is providing academic researchers and smaller labs with the infrastructure needed to train massive, trillion-parameter models. The framework successfully ran a 1.2-trillion-parameter MoE benchmark (with 58.36 billion active parameters per token) across 512 B300 GPUs, achieving a throughput of 858 TFLOP/s/GPU. In a short capacity test using DeepEP v2 for cross-GPU communication, the system scaled to 2.38 trillion total parameters.

## What to do next

Developers and machine learning engineers can access the technical report, open-source code, and interactive parallelization walkthrough via the official release.

### Limitations and Technical Caveats
When implementing Olmo-core 3, practitioners should keep several of the team's experimental findings in mind:
* **Token Gerrymandering:** The researchers discovered that standard routing balance scores can sometimes show improvement even when the actual GPU workload becomes less balanced.
* **Communication Overlap Risks:** Attempting to overlap communication and computation on separate GPU streams did not always speed up training, and in some configurations actually slowed down end-to-end execution.
* **Benchmark Variability:** GPU execution times varied based on the actual values being processed, even when matrix shapes remained identical. Reliable benchmarking requires using matching input values rather than just matching shapes.
* **Learning Rates:** Lowering expert learning rates to account for them processing fewer tokens did not yield performance improvements in the tested model family.
* **Benchmark Scope:** The trillion-parameter benchmarks were conducted using random routing to measure raw hardware and system throughput, meaning they do not reflect the convergence or downstream quality of a fully trained model.

For related LockDraft context, see [Architecting with Claude: An In-Depth Developer's Guide to Anthropic's API Surface](/posts/architecting-with-claude-an-in-depth-developers-guide-to-anthropics-api-surface/).
## Sources

* [Hugging Face Blog: Introducing Olmo-core 3: Open, scalable training infrastructure for large MoEs](https://huggingface.co/blog/allenai/olmocore3)
