---
title: >-
  LangChain Updates langchain-deepseek to 1.2.0 with LangSmith Gateway Routing
  and Python 3.10 Removal
published: 2026-11-16T19:08:24.963Z
draft: false
description: >-
  LangChain updates langchain-deepseek to version 1.2.0, routing ChatDeepSeek
  calls via the LangSmith gateway and dropping Python 3.10 support.
tags:
  - langchain
  - Python
  - ai-news
  - ai-agents
  - tool-update
category: Agents
author: LockDraft
sourceLink: >-
  https://github.com/langchain-ai/langchain/releases/tag/langchain-deepseek%3D%3D1.2.0
---

## What changed

LangChain has released version `1.2.0` of its `langchain-deepseek` partner package, bringing structural routing updates, dependency bumps, and environment cleanup.

Key updates in this release include:

* **LangSmith Gateway Routing:** Calls made via `ChatDeepSeek` are now routed through the LangSmith gateway (#41839).
* **Python 3.10 Support Dropped:** In line with end-of-life maintenance policies, support for Python 3.10 was removed from partner packages (#41268).
* **Dependency Upper Bounds Relaxed:** Upper version limits on third-party dependencies were relaxed to improve compatibility across complex environment trees (#41407).
* **Dependency Bumps:** Updated core network dependencies, upgrading `certifi` from `2025.8.3` to `2026.10.19` (#41389) and `urllib3` from `2.7.0` to `2.8.0` (#40962).
* **Model Profile Updates:** Refreshed internal model profile metadata across multiple updates (#41325, #41283, #40804, #40780) and fixed integration dependencies across partner packages (#41266).

## Why it matters

Routing `ChatDeepSeek` through the LangSmith gateway gives developers improved infrastructure support for tracing, monitoring, and managing request flows when integrating DeepSeek models into LangChain applications.

Dropping support for Python 3.10 forces automated pipelines and agent frameworks to run on modern Python runtimes (Python 3.11+). Relaxing the upper bounds on third-party dependencies reduces version lock-in issues when integrating `langchain-deepseek` alongside other fast-moving AI packages.

## What to do next

Developers using DeepSeek within LangChain workflows should take the following steps:

1. **Check Python Version:** Verify that runtime environments are running Python 3.11 or later before upgrading.
2. **Upgrade Package:** Install the updated package version using PyPI:
   ```bash
   pip install --upgrade langchain-deepseek==1.2.0
   ```
3. **Review Gateway Telemetry:** If using LangSmith for request monitoring, confirm that `ChatDeepSeek` traffic correctly resolves through your configured gateway settings.

### Limitations
Teams that are constrained to Python 3.10 environments cannot upgrade to `langchain-deepseek==1.2.0` without updating their underlying Python runtime.

For related LockDraft context, see [Anthropic Patches Zstd Decoding Vulnerability and Subagent Model Scoping in Claude Code v2.1.325](/posts/anthropic-patches-zstd-decoding-vulnerability-and-subagent-model-scoping-in-clau/).
## Sources
* [LangChain GitHub Release: langchain-deepseek==1.2.0](https://github.com/langchain-ai/langchain/releases/tag/langchain-deepseek%3D%3D1.2.0)
