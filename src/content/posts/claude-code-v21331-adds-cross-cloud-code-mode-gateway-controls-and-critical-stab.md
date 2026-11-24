---
title: >-
  Claude Code v2.1.331 Adds Cross-Cloud Code Mode, Gateway Controls, and
  Critical Stability Fixes
published: 2026-11-24T05:04:25.137Z
draft: false
description: >-
  Claude Code v2.1.331 brings Code Mode to Amazon Bedrock, Google Cloud,
  Microsoft Foundry, and AWS; introduces gateway OIDC path extraction, improved
  diagnostics
tags:
  - claude-code
  - tool-update
  - ai-agents
  - anthropic
  - ai-news
category: Agents
author: LockDraft
sourceLink: 'https://github.com/anthropics/claude-code/releases/tag/v2.1.331'
---

## What changed

Anthropic has released Claude Code v2.1.331, introducing expanded platform support, enhanced gateway configuration, and targeted reliability fixes for coding agents.

**Platform Expansion and Code Mode**
Terminal sessions running Claude Code now support Code Mode on Amazon Bedrock, Google Cloud's Agent Platform, Microsoft Foundry, and the Claude Platform on AWS. This extends Code Mode capabilities beyond local development environments into these managed cloud offerings.

**Gateway and Identity Updates**
The Claude apps gateway now supports `oidc.groups_jsonpath`, allowing administrators to extract group information from OIDC tokens using a restricted JSONPath syntax aligned with RFC 9535. For complex network setups, the new environment variable `CLAUDE_GATEWAY_IDP_CONNECT_BY_HOSTNAME=1` ensures that sign-in requests forward the IdP hostname to proxies, even when `NO_PROXY` is configured. Additionally, `claude doctor` now includes an API connectivity check that reports HTTP status codes, specific errors, or explains why a test was skipped.

**Observability and Diagnostics**
Tracing instrumentation for `claude_code.llm_request` spans now exposes `gen_ai.usage.*`, `gen_ai.response.model`, and `gen_ai.operation.name`. The `gen_ai.usage.input_tokens` metric includes tokens consumed by the prompt cache, providing more accurate usage tracking. A new diagnostic endpoint in `claude doctor` helps verify API reachability.

**Plugin Management and Environment Controls**
Plugin manifests can now define `optionalDependencies`, enabling plugins that depend on others to be installed, disabled, or uninstalled independently. An environment variable `CLAUDE_CODE_DISABLE_RESPONSE_COMPRESSION` addresses issues where proxies truncate compressed model responses, though Anthropic advises against using this setting on self-hosted runners or with Remote Control.

**Usability and Bug Fixes**
Several stability and UX issues were addressed:
- MCP tool calls that could hang for up to 30 minutes due to malformed replies from local or WebSocket servers are resolved.
- Session resumption with `--resume` or `--continue` in a different permission mode now preserves thinking and prompt cache state, though script limits from the initial mode are maintained.
- The agent retries a request once if a reply goes silent while still processing, preventing timeouts in turns and subagents.
- Typing `!` or slash commands during a script execution no longer triggers a request every second.
- Failed plugin updates no longer leave partial directories that result in missing skills or components.
- Windows users on FAT32 and exFAT drives encounter fewer redundant permission prompts during plugin sessions.
- The `/compact` command and auto-compact process retain full summaries even when they quote specific XML tags.
- Stop hooks, including `SubagentStop`, now correctly capture the final reply in transcripts. See also [Anthropic Releases Claude Code v2.1.295 with Strict Hook Controls, Gateway Filters, and MCP Fixes](/posts/anthropic-releases-claude-code-v21295-with-strict-hook-controls-gateway-fitters-/).
- Voice dictation in tap mode displays a notice when stopping after 15 seconds of silence or reaching the two-minute duration limit.
- UI rendering issues in narrow windows affecting `/bug`, `/diff`, theme selection, and tool results have been corrected.

## Why it matters

This release significantly lowers barriers for organizations adopting Claude Code in enterprise cloud environments by adding Code Mode support to major managed platforms. The introduction of `oidc.groups_jsonpath` and refined proxy handling provides DevOps teams with finer granularity for identity propagation and network routing, essential for secure, compliant deployments.

Reliability improvements directly impact automation workflows. Resolving the 30-minute MCP hangs and addressing silent-reply timeouts reduces the cognitive load on operators managing long-running agent tasks. The enhancements to session resumption ensure that context and caching efficiency are preserved when switching permission modes, optimizing token costs and continuity. For plugin developers, the `optionalDependencies` feature simplifies modular architectures, allowing more flexible lifecycle management of interdependent tools.

## What to do next

- Upgrade to v2.1.331 to enable Code Mode on Amazon Bedrock, Google Cloud Agent Platform, Microsoft Foundry, and AWS.
- Run `claude doctor` to utilize the new API connectivity diagnostics and identify potential gateway issues.
- If operating behind proxies that mishandle compressed responses, evaluate `CLAUDE_CODE_DISABLE_RESPONSE_COMPRESSION`, keeping in mind the restriction for self-hosted runners and Remote Control.
- For gateways using proxies with `NO_PROXY` settings, test `CLAUDE_GATEWAY_IDP_CONNECT_BY_HOSTNAME=1` to verify correct IdP hostname forwarding.
- Review plugin manifests to leverage `optionalDependencies` for better isolation and management of optional features.
- Update observability pipelines to ingest the new `gen_ai` attributes in LLM request traces for precise token accounting.

**Limitations and Caveats**
The `CLAUDE_CODE_DISABLE_RESPONSE_COMPRESSION` flag carries explicit warnings against use in self-hosted runner or Remote Control environments, limiting its applicability for those deployment models. Some fixes target specific edge cases, such as rendering in very narrow terminal windows or interactions with `git add -N` in repositories lacking commits, indicating residual sensitivity in UI layout logic. The changelog contains a truncated entry ("Fixed auto mode some"), suggesting minor adjustments may be documented elsewhere.

Sources
- [Claude Code v2.1.331 Release](https://github.com/anthropics/claude-code/releases/tag/v2.1.331)

## Sources

- [Official source](https://github.com/anthropics/claude-code/releases/tag/v2.1.331)
