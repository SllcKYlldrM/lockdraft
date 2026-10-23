---
title: >-
  Claude Code v2.1.307 Adds OpenTelemetry Safety Events, API Version Command,
  and MCP Retry Safeguards
published: 2026-10-23T13:52:53.601Z
draft: false
description: >-
  Claude Code v2.1.307 adds the safety_event OpenTelemetry event, updates API
  versioning commands, and fixes MCP connection issues across platforms.
tags:
  - anthropic
  - AI Agents
  - Developer Tools
  - ai-news
  - claude-code
  - tool-update
category: Agents
author: LockDraft
sourceLink: 'https://github.com/anthropics/claude-code/releases/tag/v2.1.307'
---

## What changed

Anthropic has released Claude Code v2.1.307, introducing new commands, refined observability telemetry, and various bug fixes across local environments, Model Context Protocol (MCP) integrations, and self-hosted runners.

### Observability and API Updates
* **New API versioning command**: Added `/claude-api api-version` to transition Claude API integration code to API version `2026-10-21`.
* **OpenTelemetry safety events**: Added the `claude_code.safety_event` OpenTelemetry event. This event fires whenever a tool execution is halted, prompted, or returned due to permission rules, auto mode decisions, safety checks, execution hooks, or sandbox restrictions.
* **Telemetry fixes**: Resolved an issue where OTLP telemetry sent from Claude Desktop sessions behind a Claude apps gateway was rejected when `OTEL_EXPORTER_OTLP_HEADERS` was defined. Additionally, fixed an issue where `CLAUDE_STREAM_FIRST_BYTE_TIMEOUT_MS` was ignored in apps gateway sessions.

### Model and Execution Fixes
* **Model alias handling**: Resolved model-not-found errors when `CLAUDE_CODE_DISABLE_1M_CONTEXT` was enabled alongside model aliases containing the `[1m]` suffix, such as `opus[1m]`.
* **Header transmission**: Stopped sending the `prompt-caching-scope` beta header when working behind custom `ANTHROPIC_BASE_URL` gateways or on Foundry platforms, where the header had no effect.
* **Extended SDK model switch timeouts**: Increased the model switch timeout in `setModel()` from 5 seconds to 15 seconds to prevent agent refusals when API confirmations lag.
* **Tool recovery**: Improved resilience against malformed tool calls by attempting up to two retries before terminating a turn with an error.

### MCP Server and Cloud Session Improvements
* **Idempotent HTTP MCP retries**: HTTP MCP tool calls that drop mid-connection are now retried only if the tool is designated as read-only or idempotent, preventing unintended side effects from duplicate execution.
* **macOS and sleep fixes**: Keychain lock errors on macOS in `claude -p` mode now report specific error causes and automatically reconnect upon unlock without requiring re-authentication. MCP server timeouts resulting from system sleep on macOS or Linux are also resolved.
* **Cloud and runner persistence**: Fixed issues where session restarts in cloud and self-hosted runners reverted `/autocompact` windows or restored conversations previously wiped with `/clear`.
* **Self-hosted runner isolation**: Sessions running with `--use-anthropic-git-proxy` no longer commit left-over `.claude/settings.local.json` files. Additionally, stopping a runner or requeuing a session during its checkout hook no longer leaves orphaned processes running or runner slots locked.

## Why it matters

For engineering teams running AI agents in enterprise workflows or CI/CD pipelines, tracking agent behavior and ensuring transactional safety are critical. The introduction of the `claude_code.safety_event` OpenTelemetry event provides structured visibility into security blocks and permission prompts, making it easier to audit agent policy compliance alongside existing metrics.

Furthermore, restricting automatic network retries strictly to idempotent HTTP MCP tools prevents duplicate write operations or side effects during network interruptions. These updates build on recent stability efforts across the platform, such as [strict hook controls and gateway filters](/posts/anthropic-releases-claude-code-v21295-with-strict-hook-controls-gateway-filters-/) and earlier [command safeguards and protocol updates](/posts/claude-code-adds-deep-plugin-mods-command-safeguards-and-mcp-protocol-updates/).

## What to do next

* **Update local and runner installations**: Upgrade to Claude Code v2.1.307 to pick up the runner process leak fixes and tool call recovery enhancements.
* **Target the new API version**: Execute `/claude-api api-version` within your workspace to shift your Claude API code targeting to `2026-10-21`.
* **Ingest safety telemetry**: Update your OpenTelemetry ingestion pipelines to listen for `claude_code.safety_event` if you track sandbox triggers, permission blocks, or auto-mode decisions.

### Limitations
Automatic retries for interrupted HTTP MCP connections are limited strictly to tools marked as read-only or idempotent. Non-idempotent tool calls that fail midway due to closed socket connections will still fail without an automatic retry, requiring explicit error handling by the agent or operator.

## Sources
- [Claude Code v2.1.307 Release Notes](https://github.com/anthropics/claude-code/releases/tag/v2.1.307)
