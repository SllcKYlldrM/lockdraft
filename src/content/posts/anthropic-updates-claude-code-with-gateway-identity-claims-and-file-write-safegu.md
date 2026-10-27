---
title: >-
  Anthropic Updates Claude Code with Gateway Identity Claims and File Write
  Safeguards
published: 2026-10-27T21:01:23.890Z
draft: false
description: >-
  Claude Code v2.1.312 brings custom OIDC user ID claims, concurrency limits on
  execution hooks, and safeguards against truncating large project files.
tags:
  - anthropic
  - Developer Tools
  - AI Agents
  - ai-news
  - claude-code
  - tool-update
category: Agents
author: LockDraft
sourceLink: 'https://github.com/anthropics/claude-code/releases/tag/v2.1.312'
---

## What changed

Anthropic has released Claude Code version v2.1.312, introducing security, authentication, and execution adjustments across terminal and cloud environments:

* **Identity & Enterprise Policy:** The Claude apps gateway now supports custom OIDC identity claims via `oidc.user_id_claim`. This allows enterprise infrastructure, such as Microsoft Entra ID setups using the `oid` claim, to identify users instead of forcing reliance on the default `sub` claim. Additionally, managed settings and organization policies now correctly fetch and apply immediately after a user logs in through the VS Code extension.
* **File Editing & Navigation Protections:** The `Write` tool now instructs Claude to inspect files completely or make edits in place before modifying them. This prevents a bug where Claude would overwrite large `CLAUDE.md`, rule, or `@`-included files in subdirectories after viewing only the beginning. Per-directory skills and `paths:` configurations also remain discovered when running a Bash `cd` command into deeper repository paths.
* **Platform & Model Execution Settings:** Requests using unrecognized model identifiers or custom deployment ARNs on Amazon Bedrock, Google Vertex AI, Foundry, and Mantle now automatically use a condensed system prompt. Operators can retain full prompts by setting `CLAUDE_CODE_SIMPLE_SYSTEM_PROMPT=0`. Automatic model fallbacks triggered by flagged messages now apply to non-standard deployment names as well, which can be turned off with `CLAUDE_CODE_DISABLE_REFUSAL_FALLBACK=1`.
* **Hook Concurrency & Sub-Agent Limits:** Prompt and agent hooks are now capped at 24 concurrent executions per session across all sub-agents, with up to 12 additional slots reserved for hooks exceeding their timeout. Hook timeouts under one second are automatically normalized to one second. Sub-agent `autoCompactWindow` directives can now lower the threshold set by `CLAUDE_CODE_AUTO_COMPACT_WINDOW`, though they cannot raise it.
* **Telemetry & Error Messaging:** OpenTelemetry tracking now reports the authentic name of fixed-URL remote MCP servers from Anthropic's marketplace rather than labeling them as `custom`. The `claude_code.safety_event` OpenTelemetry event has been removed. WebFetch errors in cloud sessions now name specific unresolvable hostnames so developers can add them to allowed network domains, and usage notifications refer to the "5-hour limit" instead of a "session limit."

## Why it matters

For teams deploying Claude Code across complex enterprise repositories, truncating configuration files like `CLAUDE.md` poses a direct risk to project context and automated guardrails. Forcing full reads or inline edits prevents agentic file corruption.

At the organizational level, adding custom claim mappings for OIDC unblocks deployments using Microsoft Entra ID. Managing hook execution counts and sub-agent auto-compaction builds on recent control enhancements—such as [Claude Code v2.1.295](/posts/anthropic-releases-claude-code-v21295-with-strict-hook-controls-gateway-filters-/) and [v2.1.309](/posts/anthropic-releases-claude-code-v21309-with-security-patches-skill-namespacing-an/)—ensuring background execution loops do not exhaust system resources during long-running tasks.

## What to do next

1. **Configure Custom OIDC Claims:** If your organization relies on Azure AD / Microsoft Entra ID, update your gateway config to set `oidc.user_id_claim` to `oid`.
2. **Review Deployment Environment Variables:** If using custom inference ARNs or custom deployments on Bedrock or Vertex, verify whether the simplified prompt behavior impacts outputs. Set `CLAUDE_CODE_SIMPLE_SYSTEM_PROMPT=0` if your workflows require full prompts.
3. **Audit VS Code Extension Status:** If organization settings fail to load at launch, use the new retry or sign-in options provided directly in the extension tab rather than restarting the session manually.

## Limitations and caveats

While sub-agent `autoCompactWindow` settings can restrict the context window size relative to `CLAUDE_CODE_AUTO_COMPACT_WINDOW`, they cannot expand it beyond the primary session setting. Furthermore, setting hook timeouts below 1 second will be automatically floored to 1 second.

## Sources

* [Claude Code v2.1.312 Release Notes](https://github.com/anthropics/claude-code/releases/tag/v2.1.312)
