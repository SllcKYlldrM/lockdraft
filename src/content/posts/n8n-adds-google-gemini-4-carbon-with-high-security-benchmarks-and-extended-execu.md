---
title: >-
  n8n Adds Google Gemini 4 Carbon with High Security Benchmarks and Extended
  Execution
published: 2026-11-11T07:17:07.390Z
draft: false
description: >-
  n8n integrates Google Gemini 4 Carbon, bringing strong prompt injection
  defense and multi-step agent execution to workflow automation.
tags:
  - n8n
  - AI Agents
  - automation
  - ai-news
  - tool-update
category: Automation
author: LockDraft
sourceLink: >-
  https://blog.n8n.io/build-safer-n8n-agents-and-workflows-with-google-gemini-4-carbon/
---

## What changed

n8n has added native support for Google's Gemini 4 Carbon model across both cloud and self-hosted environments. The model is available inside the Google Gemini Chat Model sub-node for AI Agents as well as the standalone Google Gemini node.

Google's benchmark results place Carbon at 53.9% on AutomationBench, making it the top-performing model on the test. Security-focused performance scores include:

- **SEC-bench Pro (vulnerability detection):** 88.2%
- **CWE-bench (vulnerability patching):** 71.0%
- **ExploitGym (exploitability verification):** 54.8%
- **Gray Swan (prompt injection defense):** 0.0% attack success rate (an improvement from 0.7% on Gemini 4 Argon)

Google has listed introductory pricing at $2.00 per million input tokens and $10.00 per million output tokens through November 30, 2026. Following the introductory window, rates will adjust to $4.00 per million input tokens and $20.00 per million output tokens. n8n Cloud users access Carbon using Gateway credits without separate provider billing, while self-hosted instances connect via standard Gemini API keys.

## Why it matters

AI agents in n8n frequently process untrusted data streams, such as incoming webhook payloads, raw web scrapes, form submissions, and inbound emails. These unvetted inputs present vectors for prompt injection attacks that attempt to hijack agent tool calls. Carbon's 0.0% attack success rate on Gray Swan benchmarks provides better defenses when handling raw data feeds.

Beyond prompt security, Carbon is designed for long-horizon execution. Internal test runs cited by Google ran across multiple days on complex engineering tasks, navigating around execution obstacles rather than stopping prematurely. For developers building agentic workflows, this persistence helps prevent agents from dropping context across complex tool loops. Pairing Carbon with [layered hallucination detection strategies](/posts/layered-hallucination-detection-strategies-for-n8n-ai-agents/) offers additional control over autonomous agent decisions.

## What to do next

To implement Carbon in an n8n workflow:

1. Open an **AI Agent** or standalone **Google Gemini** node.
2. Select the Google Gemini Chat Model integration.
3. Choose **Gemini 4 Carbon** from the model list and connect required tools or memory nodes.

To manage token costs, developers do not need to replace every existing model. A practical pattern is to reserve Carbon for complex reasoning and tool execution steps, while relying on lighter models like Gemini 4 Argon for basic input classification or formatting tasks. 

On self-hosted instances, configure your Gemini API key in n8n's credentials settings (for teams running fully isolated local setups, see our guide on [deploying self-hosted n8n AI workflows](/posts/deploying-self-hosted-n8n-ai-workflows-on-nvidia-dgx-spark-with-zero-cloud-apis/)).

*Caveats and limitations:* Although Carbon recorded a 0.0% attack rate on Gray Swan's prompt injection test, no model guarantees absolute immunity to adversarial manipulation at production scale. Existing security protocols, tool permission boundaries, and input filtering should remain active.

## Sources
- [n8n Blog: Build Safer n8n Agents and Workflows with Google Gemini 4 Carbon](https://blog.n8n.io/build-safer-n8n-agents-and-workflows-with-google-gemini-4-carbon/)
