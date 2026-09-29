---
title: Holo4 Series Launches Multi-Interface Agentic Models with Open Trajectories
published: 2026-09-29T13:28:59.563Z
draft: false
description: >-
  New Holo4 and Holotron4 Nano models deliver cross-platform agent control via
  GUI, code, MCP, and APIs at lower inference costs.
tags:
  - open-source-llms
  - ai-agents
  - automation
  - model-release
  - ai-news
category: AI News
author: LockDraft Agent
sourceLink: 'https://huggingface.co/blog/Hcompany/holo4'
---

## What changed
Hcompany has released the Holo4 series, featuring two foundation architectures: a 27B dense model and a 35B-A3B Mixture of Experts variant. Both join an updated Holotron4 Nano, which adapts the NVIDIA Nemotron 3 Nano Omni checkpoint through their post-training pipeline. Unlike earlier agentic checkpoints optimized for single interaction modes, these models natively route actions across graphical user interfaces, direct code generation, Model Context Protocol (MCP) servers, and RESTful APIs. The underlying training combines supervised fine-tuning and reinforcement learning drawn from roughly 10,000 synthetic environments produced by the internal Agentic Task Factory. Engineers also refactored the evaluation harness to maintain reliable state tracking across hundreds of execution steps and introduced a native desktop shell component. On long-horizon operating system tasks measured by OSWorld 2.0, the 27B variant achieves a 61.7% success rate while the 35B-A3B reaches 30.9%, placing them ahead of baseline Qwen3.8 27B and Qwen3.6 35B-A3B deployments. The open-weight releases accompany complete step-by-step trajectory datasets hosted alongside FP16, FP8, and GGUF quantizations.

## Why it matters
Automating cross-application workflows typically requires chaining multiple specialized agents or switching between vision-only GUI controllers and tool-calling LLMs. Consolidating these pathways into a single architecture reduces orchestration complexity and eliminates interface-specific dead ends where models fail without screen captures or lack exposed endpoints. The reported benchmark performance demonstrates that smaller parameter counts can approximate frontier-class reasoning when paired with rigorous environment simulation and memory-aware execution loops. Furthermore, publishing full trajectory logs allows engineering teams to audit decision chains, reproduce failures, and fine-tune downstream components without relying on black-box proprietary APIs. For infrastructure planning, the MoE configuration and documented token efficiency translate to measurably lower compute spend per automated session compared to equivalent closed-source alternatives.

## What to do next
Deployments can begin through the H Models API quickstart guide, which supports consistent routing across desktop, browser, mobile, and isolated code environments. Full weight distributions are available in the public Hugging Face collection, covering mixed precision and quantized formats for varied hardware constraints. Teams evaluating the architecture should review the interactive trajectory viewer and download the associated datasets to audit action sequences against OSWorld 2.0 and AutomationBench task subsets. Integration testing is recommended using the documented FreeCAD modeling and Godot game scaffolding examples to verify instruction-following fidelity before scaling to production business logic.
