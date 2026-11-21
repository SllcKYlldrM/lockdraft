---
title: >-
  OpenAI Releases GPT-6.2 Astra and Sol with Lower API Rates and Reduced Token
  Usage
published: 2026-11-21T13:07:20.654Z
draft: false
description: >-
  OpenAI launched GPT-6.2 Astra and Sol, lowering output token requirements and
  API pricing while improving scientific, legal, and agent benchmark scores.
tags:
  - OpenAI
  - AI Agents
  - ai-news
  - model-release
category: AI News
author: LockDraft
sourceLink: 'https://openai.com/index/introducing-gpt-6-2-astra-sol'
---

## What changed

OpenAI has introduced two new models: **GPT-6.2 Astra**, designed for complex professional tasks and agentic workflows, and **GPT-6.2 Sol**, aimed at efficient everyday work.

### GPT-6.2 Astra Capabilities and Benchmarks
GPT-6.2 Astra generates cleaner code, improved CAD/3D visuals, and formatted spreadsheets, slides, and legal briefs using fewer output tokens per task.

* **API Pricing:** Input and output token prices are 20% lower than GPT-6 Astra ($8 per million input tokens, $0.40 per million cached input tokens, and $40 per million output tokens). Cached input receives a 60% discount.
* **Agent Benchmark:** On *Agents' Last Exam*, Astra scored 5.2 points higher than GPT-6 Astra at less than one-third the cost, and 5.5 points ahead of Claude Fable 5.2 at 5% of its cost.
* **Scientific Workflows:** Astra set a new high score on *Terminal-Bench-Science 0.1*, scoring 9 percentage points higher than GPT-6 Astra at less than one-third the cost. It also reached a top score on the *Vals Science Index*.
* **Legal and Knowledge Work:** On *Harvey LAB-AA v1.1*, Astra more than doubled Claude Fable 5.2's pass rate at roughly one-sixth the cost, with a tailored *Astra for Law* variant scoring higher. On *GDPval v2*, Astra improved by 6.2 percentage points over GPT-6 Astra while generating 22% fewer output tokens.
* **Data Analysis:** On Artificial Analysis's *AA-AnalystAgent* evaluation, Astra answered 62.5% of questions correctly across five independent attempts on a specific task calculating medical transport spending from California Medicaid expenditure reports.
* **Design and Interactive Web:** Astra achieved 1,318 Elo on Artificial Analysis's *AA-3D* human preference benchmark, placing first ahead of Claude Fable 5.2 (1,271 Elo) and GPT-6.2 Sol (1,259 Elo).

### GPT-6.2 Sol Capabilities
GPT-6.2 Sol maintains the API token pricing of GPT-6.1 Sol while upgrading reasoning, writing, and coding capabilities.

* **Code Evaluation:** On Cognition's *FrontierCode 2.0*, Sol finished within 0.5 points of Astra at approximately one-fifth the cost (both evaluated at maximum settings).
* **Everyday Tasks:** On the *LifeVal* evaluation, Sol outscored GPT-6 Astra at approximately one-seventh the cost.
* **GDPval v2:** Sol improved by 5.3 points over GPT-6.1 Sol.

## Why it matters

Reducing the number of output tokens needed to resolve complex tasks directly decreases total workflow cost and execution time for multi-step agents. Astra's performance gains on scientific, legal, and agent benchmarks lower the barrier to running long-horizon evaluations at scale.

Meanwhile, GPT-6.2 Sol's performance on *FrontierCode 2.0* makes high-volume code maintenance and daily interactive tasks viable at lower cost tiers. Practitioners evaluating modern API options across providers (such as those comparing architectures in our guide to [architecting with Claude](/posts/architecting-with-claude-an-in-depth-developers-guide-to-anthropics-api-surface/)) now have updated cost-per-task metrics to consider.

## Limitations and caveats

* On the *Agents' Last Exam* leaderboard, Claude Fable 5.2's published results excluded nine tasks that required a fallback model.
* On the *AA-AnalystAgent* benchmark, Astra's 62.5% accuracy rate specifically reflects performance across five attempts on a single California Medicaid expenditure task, rather than an overall score across all financial spreadsheet benchmarks.

## What to do next

1. **Implement Prompt Caching:** Ensure system prompts and repetitive contexts use Astra's cached input endpoint to take advantage of the $0.40/1M cached token rate.
2. **Benchmark Sol for High-Volume Tasks:** Test GPT-6.2 Sol on automated PR reviews, background evaluations, and everyday user requests where Astra's frontier reasoning isn't strictly required.
3. **Audit Token Limits:** Adjust downstream parser timeouts and token budgets to account for Astra's reduced output token footprint on complex tasks.

## Sources

* [OpenAI: Introducing GPT-6.2 Astra and Sol](https://openai.com/index/introducing-gpt-6-2-astra-sol)
