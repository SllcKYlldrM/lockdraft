---
title: ProvenanceGuard Identifies Source Attribution Errors in MCP LLM Agents
published: 2026-10-06T11:35:19.108Z
draft: false
description: >-
  ProvenanceGuard is a new verification layer for MCP agents that prevents
  cross-source conflation by mapping LLM claims directly to specific tool
  sources.
tags:
  - AI Agents
  - Open Source
  - ai-news
  - open-source-llms
  - research
category: AI News
author: LockDraft
sourceLink: >-
  https://huggingface.co/blog/MultiverseComputingCAI/getting-the-source-right-not-just-the-fact-source
---

## What changed

Researchers have introduced **ProvenanceGuard**, a post-generation verification layer designed for Model Context Protocol (MCP) agents. While traditional retrieval-augmented generation (RAG) systems pull from unified text corpuses, modern multi-tool agents utilize MCP to query databases, call search tools, and read structured records simultaneously. 

Standard factuality checkers—such as MiniCheck, RAGAS, AlignScore, and SummaC—evaluate pooled evidence to see if a claim is supported. They do not, however, verify whether a claim is attributed to the *correct* tool output. ProvenanceGuard addresses this gap by tracking source identities through the entire evaluation pipeline without requiring agent retraining.

In a local test configuration, the system processes captured MCP traces using a five-stage pipeline:
1. **Decomposition**: A local language model breaks the agent's response into individual claims.
2. **Routing**: A MiniLM model identifies the most relevant source for each claim.
3. **Support Verification**: A DeBERTa Natural Language Inference (NLI) model evaluates whether the selected source supports the claim, checking numbers and dates closely.
4. **Attribution Comparison**: The system checks if the supporting source matches the source explicitly or implicitly named in the agent's response.
5. **Decision & Repair**: The system outputs a claim-level verdict and triggers a RARR-style repair loop to rewrite or fall back on blocked answers.

In benchmark tests against traditional verifiers, ProvenanceGuard achieved the highest Reject/Block F1 score while being the only framework to output explicit claim-to-source ID mappings:

| Verifier | Reject/Block F1 | Emits Claim-to-Source ID |
| :--- | :--- | :--- |
| **ProvenanceGuard** | **0.802** | **Yes** |
| MiniCheck | 0.783 | No |
| RAGAS Faithfulness | 0.758 | No |
| AlignScore | 0.662 | No |
| SummaC-ZS | 0.436 | No |

## Why it matters

As developers build complex agentic workflows—often [architecting with Claude and Anthropic's API surface](/posts/architecting-with-claude-an-in-depth-developers-guide-to-anthropics-api-surface/) where MCP plays a central role—preventing "cross-source conflation" becomes critical. Cross-source conflation occurs when an agent states a true fact but attributes it to the wrong tool or document. For instance, a customer support agent might correctly state a refund window policy but incorrectly claim the detail was found in the user's specific "account record" rather than a general policy document.

In sensitive domains like medicine or finance, misattributions can be highly damaging. To evaluate this, researchers tested ProvenanceGuard on 281 real clinical agent traces. Out of 361 expert-evaluated claims, the system successfully caught 138 of 139 unsupported claims. In a controlled test where researchers intentionally swapped the named sources for 50 supported facts, ProvenanceGuard detected 100% of the attribution errors.

The computational overhead is minimal: processing a trace takes roughly 0.5 seconds on the local setup, with the individual NLI and routing calls completing in tens of milliseconds.

## Limitations and Caveats

ProvenanceGuard's high accuracy comes with a conservative bias. In evaluations, it flagged 67 supported claims as false positives, routing them for unnecessary review or repair. Additionally, distinguishing between highly similar sources remains a challenge: in a complex test featuring closely related documents, the system's exact source identification accuracy dropped to 50.3%, even though its overall blocking F1 score remained strong at 0.846.

## What to do next

Developers building MCP-based applications can implement ProvenanceGuard as an offline guardrail. While the reference implementation relies on local models (MiniLM and DeBERTa) to minimize latency and ensure data privacy, the pipeline's decomposition, routing, and verification steps can be adapted to hosted cloud APIs. 

The code, paper, and implementation details are available via Hugging Face.

## Sources

* Hugging Face Blog: [Getting the Source Right, Not Just the Fact: Source-Aware Verification for MCP Agents](https://huggingface.co/blog/MultiverseComputingCAI/getting-the-source-right-not-just-the-fact-source)
