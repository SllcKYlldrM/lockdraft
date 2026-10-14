---
title: Ollama v0.40.4 Brings Decision Models to CLI and Stabilizes MLX Runner
published: 2026-10-14T05:36:00.400Z
draft: false
description: >-
  Ollama v0.40.4 enables decision model execution via `ollama run`, adds Kev
  model support in the MLX runner, fixes speculative decoding, and updates local
  model 
tags:
  - Ollama
  - ai-news
  - open-source-llms
  - tool-update
category: AI News
author: LockDraft
sourceLink: 'https://github.com/ollama/ollama/releases/tag/v0.40.4'
---

## What changed

Ollama v0.40.4 introduces direct execution of decision models within the terminal interface. Users can now perform binary classification, label assignment, and rubric-based scoring using the standard `ollama run` command without requiring external post-processing. For example, evaluating a ticket file against a decision model named `nimble` is supported via:

```
ollama run nimble --ask "Is a refund being requested?" < ticket.txt
```

This functionality is powered by an update to the embedded llama.cpp library, which now includes native decision model support.

On Apple Silicon, the MLX runner extends its architecture support to include Kev decision models. The release also delivers several reliability and performance enhancements to the MLX backend. Speculative decoding stability has been improved, specifically addressing recurrent state handling following rollbacks. The runner now clips excessively long Laya states instead of failing with rejection errors. Inference efficiency gains are realized through the reuse of verified manifests and retained loaded models. Additionally, prefill performance for Gemma 4 has been optimized on NVIDIA GPUs when utilizing the MLX runner.

Embedding capabilities were expanded with the addition of multimodal embedding support exposed through llama-server. A regression preventing the loading of multimodal embedding models configured with small context windows has been resolved.

Workflow integrations received updates in the `ollama launch` suite. The launch command can now utilize existing usage credits without mandating a transition to a paid subscription tier. Within the Codex CLI, the model picker interface now lists models installed locally in Ollama. Developers can switch between available local models during a session using the `/model` directive. Documentation revisions clarify the distinction between local processing and cloud service interactions.

## Why it matters

The integration of decision models into the CLI simplifies the automation of structured evaluation tasks. By exposing classification and scoring logic directly through `ollama run`, developers can embed deterministic decision-making into shell scripts and pipeline workflows without relying on complex prompt engineering or custom parsers. Native support in llama.cpp reduces overhead compared to generating full text responses for discrete outputs.

For practitioners operating on Apple hardware, the MLX runner updates address critical stability gaps. The fix for recurrent state management ensures that high-speed decoding strategies remain robust under edge cases. Supporting Kev models broadens the range of specialized architectures available for efficient local deployment. The improvement to speculative decoding reliability directly benefits latency-sensitive applications by maintaining consistent throughput during complex inference sequences.

Multimodal embedding support via llama-server enables retrieval-augmented generation systems to index and query combined text and visual data locally. Resolving the context window constraint for these models removes a barrier for deployments requiring tight memory budgets.

## What to do next

Upgrade to Ollama v0.40.4 to access decision model execution and MLX runner enhancements. Test the new CLI syntax with decision models to verify classification and scoring workflows. If using Apple Silicon, evaluate the support for Kev models and observe the handling of long Laya states. On NVIDIA GPUs, benchmark Gemma 4 prefill performance through the MLX runner to assess latency improvements. Explore the local model availability in `ollama launch codex` to streamline model switching. Review the updated documentation for clarified privacy boundaries regarding cloud services.

**Limitations and Caveats**
Kev decision model support is currently limited to the MLX runner on Apple Silicon. While the MLX runner reports performance gains for Gemma 4 on NVIDIA GPUs, verify compatibility with your specific driver and hardware configuration. Ensure context windows are appropriately sized when deploying multimodal embedding models, as the update addresses prior loading failures associated with smaller limits.

**Sources**
[Ollama v0.40.4 Release](https://github.com/ollama/ollama/releases/tag/v0.40.4)

For related LockDraft context, see [Ai2 Open-Sources AstaBrief 8B for Fast Scientific Report Generation](/posts/ai2-open-sources-astabrief-8b-for-fast-scientific-report-generation/).

## Sources

- [Official source](https://github.com/ollama/ollama/releases/tag/v0.40.4)
