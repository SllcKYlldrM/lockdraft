---
title: >-
  Tether AI Releases BotPsy: A 0.8B On-Device Agentic Model Built for Function
  Calling
published: 2026-11-11T16:40:06.416Z
draft: false
description: >-
  Tether AI Research launched BotPsy, an open-source 0.8B parameter agent
  trained on top of Qwen3.5-0.8B for efficient on-device tool use.
tags:
  - Open Source
  - AI Agents
  - ai-news
  - open-source-llms
  - research
category: AI News
author: LockDraft
sourceLink: 'https://huggingface.co/blog/qvac/botpsy'
---

## What changed

Tether AI Research (Tether Data, S.A. de C.V.) has introduced BotPsy, an open-source 0.8-billion-parameter language model tuned specifically for function calling and local agent workflows. Derived from Qwen3.5-0.8B and released under the Apache 2.0 license, BotPsy is distributed in Hugging Face safetensors format alongside GGUF quantizations (bf16, Q8, and Q4) targeting runtimes like `llama.cpp` and Tether's QVAC SDK.

BotPsy significantly improves agentic performance relative to its base model, doubling its key benchmark scores. On BFCL v4, its score grew from 23.4 to 44.0; on ACEBench, it increased from 30.1 to 58.7; and on τ-bench, it improved from 23.2 to 51.5 (evaluated across banking, telecom, and retail subsets).

Across six benchmark suites, BotPsy outperformed competing models in the 1.2-billion-parameter category, including LFM2.5-1.2B-Think and MiniCPM5-1B-Think. It also surpassed Qwen3.5-2B-Think—a model 2.5 times larger—on five of six benchmarks:
- **ToolSandbox:** 64.6 vs. 41.2
- **BrowseComp-Plus:** 4.5 vs. 2.8
- **BFCL v4:** 44.0 vs. 37.7
- **ACEBench:** 58.7 vs. 55.4
- **τ-bench:** 51.5 vs. 46.5

Qwen3.5-2B-Think only edged out BotPsy on Claw-Eval, scoring 48.9 compared to BotPsy's 46.5.

Post-training also improved efficiency during step-by-step resolution. When evaluating correct answers, BotPsy required roughly 3× fewer reasoning tokens on GPQA Diamond (3,690 vs. 11,563) and 2.7× fewer on MMLU-Pro (1,912 vs. 5,105) than its base model. On IFBench, repetitive reasoning loops fell from 22.9% to 1.4%, while instances of context exhaustion hitting the 32k-token limit plummeted from 28.3% to 0.2%.

## Why it matters

Running agent workloads locally mitigates continuous cloud infrastructure costs and eliminates dependency on proprietary API availability or schema updates. However, compact models frequently struggle with tool hallucination, prompt injection vulnerability, and unnecessary reasoning loops that inflate latency. In constrained environments, excessive background computation can degrade battery performance and throughput—an issue developers frequently encounter when managed [agent processes consume significant token budgets](/posts/claude-code-background-agent-summaries-burn-up-to-20percent-of-token-budgets/).

BotPsy addresses tool-call reliability directly:
- **Refusing missing tools:** On BFCL v4 hallucination tests, which evaluate whether a model refrains from calling tools when no appropriate option exists, BotPsy reached a top score of 86.1.
- **Handling bad inputs:** On ACEBench special cases covering incomplete or malformed requests, BotPsy scored 51.3, up from 13.7 in its base model.
- **Safety under attack:** In automated red-teaming across six harm vectors, BotPsy generated unsafe responses 21% of the time, compared to 36% for the base model, 35% for LFM2.5-1.2B-Think, and 47% for MiniCPM5-1B-Think. Under prompt-injection conditions, its unsafe output rate fell from 46% to 31%.

General task accuracy also improved alongside agent capabilities. IFEval rose from 59.7 to 90.8, IFBench rose from 22.0 to 55.9, GPQA Diamond increased from 33.2 to 38.1, and MMLU-Pro moved from 41.6 to 48.9.

### Limitations
BotPsy is tailored for low-to-medium difficulty tasks such as calendar scheduling, basic web research, device management, and message handling. As a sub-billion parameter model, it remains susceptible to errors, struggles when multi-turn instructions accumulate heavily, and exhibits degraded accuracy in lower-resource languages. It is not designed for high-stakes operational environments.

## What to do next

- **Fetch the weights:** Developers can download the open weights directly from Hugging Face in standard safetensors format or pull GGUF quantizations (Q4, Q8, or bf16) for local execution.
- **Integration targets:** Local apps using `llama.cpp` or the QVAC SDK can integrate the model for local routine automation, offline function calling, or system control tasks.
- **Future roadmap:** Tether AI Research announced that subsequent developments will focus on linking BotPsy to decentralized peer-to-peer search via Hypersearch, enabling localized adapter tuning via QVAC Fabric, and supporting offloading transitions between mobile devices, local desktop nodes, and P2P networks.

## Sources
* [Hugging Face Blog](https://huggingface.co/blog/qvac/botpsy)
