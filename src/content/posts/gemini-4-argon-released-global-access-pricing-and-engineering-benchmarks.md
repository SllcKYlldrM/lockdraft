---
title: 'Gemini 4 Argon Released: Global Access, Pricing, and Engineering Benchmarks'
published: 2026-10-13T19:37:30.667Z
draft: false
description: >-
  Google launches Gemini 4 Argon globally. Introductory pricing at $2/M input
  tokens. Available via API, Antigravity, and App for Pro/Ultra subscribers. #1
  on Val
tags:
  - model-release
  - ai-news
category: AI News
author: LockDraft
sourceLink: >-
  https://blog.google/innovation-and-ai/models-and-research/gemini-models/introducing-gemini-4-argon/
---

## What changed

Google has made Gemini 4 Argon globally available as its latest frontier model. The release includes updated access tiers and an introductory pricing structure designed for high-volume integration.

**Availability and Access**
Argon is accessible via API through AI Studio and the Gemini platform for developers and enterprises. Subscription-based access extends to Google Antigravity for Ultra subscribers, while Google AI Ultra and Pro subscribers gain entry through the Gemini app and AI Mode in Search.

**Pricing Structure**
The model launches with an introductory rate of $2 per million input tokens and $10 per million output tokens. Input tokens processed through cache receive a 95% discount.

**Performance and Benchmarks**
Argon ranks #1 on the Vals Index, measuring performance across critical economic sectors including finance, coding, legal, and tax work. Internal testing at Google shows software engineers shipping code faster using Argon in Antigravity, increasing agentic code submissions by more than 35% and reducing code rollbacks by nearly a third.

**Engineering and Scientific Optimizations**
The model has delivered measurable improvements across internal projects:
*   **Chrome Architecture:** Argon assisted the Chrome team in untangling a ~6 million line legacy folder within the 40 million line Chromium codebase. This architectural refactor across hundreds of files enables live webpages to transition fluidly between tabs, side panels, and floating windows without reloading, addressing a class of browser crashes.
*   **ADK Performance:** For the Agent Development Kit (ADK), Argon optimized the production Python codebase autonomously. Results include a 40% reduction in in-memory session preparation time for long sessions and a 21% increase in cold import speeds.
*   **Gemma Inference:** Argon achieved a 2.85x end-to-end inference speedup on an A100 GPU using vLLM. Throughput increased from approximately 37,900 to over 108,000 tokens per second on Gemma 4 E2B with 100% token parity and no quality degradation.
*   **Quantum Chemistry:** In optimizations for the xTB package, Argon accelerated molecular structure prediction by up to 2.3x and conformer search by 1.8x. Changes have been contributed to the official GitHub repository.

## Why it matters

Gemini 4 Argon moves beyond benchmark scores by demonstrating tangible utility in complex, multi-step workflows. The model combines deep reasoning with expanded domain knowledge in coding, finance, legal, and science, alongside stronger writing capabilities that reduce hedging and repetition.

**Developer Efficiency**
The speedups in Gemma and ADK highlight Argon's ability to handle low-level system optimizations and framework overhead reduction. Developers can leverage slash commands like `/goal` and multi-agent loops with custom skills in Antigravity to prototype 3D visualizations and interactive animations directly in the browser.

**Security and Research**
Argon supports autonomous auditing of critical codebases and formal proofs, helping identify zero-day vulnerabilities and logic flaws. Google is expanding the Fairwind Program to hundreds of additional partners, including Wiz, to extend these cyber defense capabilities.

**Scientific Acceleration**
By accelerating tools like xTB, Argon aids researchers in screening drug and material candidates, potentially compressing timelines for discovery in quantum computing and life sciences.

## What to do next

*   **Integrate via API:** Developers can begin accessing Argon through AI Studio and the Gemini platform immediately.
*   **Leverage Caching:** Implement caching strategies to utilize the 95% discount on input tokens.
*   **Explore Antigravity:** Subscribers should test Argon for complex engineering tasks, such as large-scale codebase refactoring and cross-domain analysis.
*   **Adopt Improved Writing Standards:** Utilize Argon's enhanced style adherence and direct response generation for professional workflows in legal, finance, and documentation.

**Caveats**
The current pricing is introductory and subject to change. While Argon demonstrates significant performance gains, results may vary depending on specific task complexity and implementation details.

**Sources**
[Google AI Blog](https://blog.google/innovation-and-ai/models-and-research/gemini-models/introducing-gemini-4-argon/)

For related LockDraft context, see [Ai2 Open-Sources AstaBrief 8B for Fast Scientific Report Generation](/posts/ai2-open-sources-astabrief-8b-for-fast-scientific-report-generation/).

## Sources

- [Official source](https://blog.google/innovation-and-ai/models-and-research/gemini-models/introducing-gemini-4-argon/)
