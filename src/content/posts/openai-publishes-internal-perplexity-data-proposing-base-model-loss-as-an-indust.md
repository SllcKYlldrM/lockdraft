---
title: >-
  OpenAI Publishes Internal Perplexity Data, Proposing Base Model Loss as an
  Industry Safety Benchmark
published: 2026-11-23T08:22:17.840Z
draft: false
description: >-
  OpenAI revealed internal log-perplexity metrics across model generations,
  arguing base loss thresholds should guide AI safety and pacing standards.
tags:
  - OpenAI
  - ai-news
  - research
category: AI News
author: LockDraft
sourceLink: 'https://openai.com/index/perplexity-and-intelligence'
---

## What changed

OpenAI published internal evaluation data tracking the pretraining log-perplexity (cross-entropy loss) of its models from GPT-3.5 onward, advocating for the metric to be used as a shared industry standard for gauging model capabilities and pacing development.

The released metrics trace how reductions in base prediction loss directly correlate with emergent model capabilities:

* **GPT-3.5:** Recorded a log-perplexity of approximately 0.99 on OpenAI's primary evaluation dataset, enabling fluent conversational abilities.
* **GPT-4:** Dropped log-perplexity to approximately 0.91, unlocking productive chain-of-thought reasoning.
* **Sub-0.80 Loss:** Models reaching log-perplexity levels below 0.80 began displaying advanced capabilities in fields like mathematics and cybersecurity.
* **0.76 Threshold:** A model upgraded to approximately 0.76 log-perplexity began autonomously resolving open problems in mathematics within internal research threads.

OpenAI projects that reaching the ~0.68 to 0.70 log-perplexity range will trigger the next major wave of unexpected capabilities. In response, OpenAI proposes establishing industry-wide thresholds based on perplexity and related metrics. Under this framework, model developers would commit to pausing pretraining past agreed-upon loss limits until concrete monitoring and safety milestones—such as successors to chain-of-thought auditing tools—are met.

## Why it matters

Traditional downstream task benchmarks tend to saturate quickly; benchmarks used during the GPT-2 and GPT-3 eras were largely saturated by the time GPT-4 was released. Pretraining perplexity provides a more consistent, long-term metric for tracking general capabilities, as high-level capabilities emerge non-linearly from the underlying compressor/predictor substrate.

Additionally, AI is increasingly assisting in its own development cycle. OpenAI notes that AI involvement in pretraining algorithmic research could trigger a step-change acceleration in base capabilities as early as 2027. Setting shared pacing standards rooted in raw pretraining metrics offers a target for joint red-teaming and safety audits before new capabilities are deployed.

## What to do next

For frontier developers and research teams looking to implement or evaluate perplexity-based pacing:

* **Establish cross-lab evaluation standards:** Because different organizations train on varying data mixtures and evaluate on custom datasets, labs must develop transferable evaluation protocols to make perplexity figures directly comparable across architectures.
* **Account for post-pretraining gains:** Teams must pair perplexity tracking with targeted task evaluations, as techniques like inference-time chain-of-thought reasoning significantly expand practical execution capabilities without reducing pretraining loss.

### Limitations
Perplexity metrics have notable constraints. They do not map directly to specific operational tasks, fail to capture capability jumps achieved purely through post-pretraining fine-tuning or inference techniques, and face an unknown mathematical lower bound dictated by the inherent entropy of the underlying training data.

For related LockDraft context, see [Ai2 Open-Sources AstaBrief 8B for Fast Scientific Report Generation](/posts/ai2-open-sources-astabrief-8b-for-fast-scientific-report-generation/).
## Sources
- [OpenAI: Perplexity and Intelligence](https://openai.com/index/perplexity-and-intelligence)
