---
title: >-
  Claude Code v2.1.302 Updates Auto-Mode Controls, Memory Limits, and Plugin
  Stability
published: 2026-10-19T15:55:36.550Z
draft: false
description: >-
  Claude Code v2.1.302 adds model control for auto-mode classifiers, caps image
  reads at 128MB, stabilizes plugin workflows, and patches session persistence
  bugs.
tags:
  - claude-code
  - ai-agents
  - tool-update
  - anthropic
  - ai-news
category: Agents
author: LockDraft
sourceLink: 'https://github.com/anthropics/claude-code/releases/tag/v2.1.302'
---

## What changed

Anthropic released Claude Code v2.1.302 with targeted adjustments to session management, resource handling, and plugin infrastructure. Key additions include the `CLAUDE_CODE_AUTO_MODE_MODEL` environment variable, which allows explicit selection of the model used by the client-side auto mode classifier. Server-side routing logic remains unaffected.

The update introduces an `Idle compaction` toggle directly in `/config`, accompanied by updated prompts that explain how to disable the feature after it runs. A permanent notice has also been added to `/design-sync` and `/design-login` indicating that the standalone Claude Design interface (claude.ai/design) will shut down on December 14, 2026.

Memory safety received a hard cap: the Read tool now rejects image files, pipes, or device nodes exceeding 128 MB, preventing unbounded memory consumption. Several backend routing and caching issues were resolved, including a prompt cache miss triggered when mid-session tools are reloaded via ToolSearch or post-compaction, and a configuration drift where `/autocompact` and `/effort` wrote to incorrect models when gateways prefixed Opus 4 or 4.1 identifiers.

Plugin and shell integration saw multiple stability patches. Git reftable format defaults no longer cause marketplaces to re-clone on refresh or report unknown versions. The PowerShell tool correctly resolves executables in plugin bin directories, and pipeline failures when piping search commands like rg or grep into Select-Object are eliminated. Config write race conditions that previously dropped changes or left tmp files are resolved.

Session tracking and billing accuracy improved through fixes for cloud session cost counters resetting after process resumption, and prompt suggestions incorrectly draining credits on metered models. Telemetry was corrected to restore classifier_category to OpenTelemetry tool_decision events and properly handle attribute limits. UI refinements ensure backtick-wrapped URLs render as single clickable links across line breaks, and MCP servers negotiating protocol version 2026-07-28 now function correctly even when omitting resultType, ttlMs, or cacheScope.

Platform-specific patches address Windows file write refusals on exFAT and FAT32 volumes, worktree creation failures under git 2.56+ with orphaned .git pointers, and self-hosted runner git fetch errors tied to reftable storage.

## Why it matters

These changes directly reduce runtime friction for developers managing complex agent sessions. The 128 MB read limit prevents out-of-memory crashes when processing large binary assets or logs, while the CLAUDE_CODE_AUTO_MODE_MODEL flag gives operators deterministic control over local classifier behavior without altering backend gateway routing. Plugin stability improvements resolve long-standing edge cases around modern git metadata formats and cross-shell execution, which previously caused silent data loss or broken toolchains. Billing and telemetry corrections ensure accurate usage attribution and reliable observability pipelines. For teams relying on automated MCP integrations, the protocol 2026-07-28 compatibility patch eliminates silent tool call failures that broke earlier server implementations.

## What to do next

- Upgrade to v2.1.302 using your standard installation method.
- Set CLAUDE_CODE_AUTO_MODE_MODEL if you require explicit client-side classifier routing.
- Review /config to adjust idle compaction preferences based on your workflow.
- Validate MCP server definitions against protocol 2026-07-28 requirements, particularly resultType, ttlMs, and cacheScope fields.
- On Windows, verify project paths on exFAT/FAT32 drives are functioning correctly, and check git worktrees if upgrading past 2.56.
- Audit plugin installations to ensure reftable compatibility and confirm config persistence.

### Limitations and caveats

The CLAUDE_CODE_AUTO_MODE_MODEL environment variable exclusively controls client-side classification and does not override server-side model selection. The standalone Claude Design platform will be fully decommissioned on December 14, 2026, requiring migration to claude.ai/design/settings for account management. Some session and telemetry fixes require a full restart of the Claude Code process or workspace refresh to clear stale caches and finalize pending configuration writes.

For additional context on plugin architecture and MCP protocol handling, see our coverage of Claude Code Adds Deep Plugin Mods, Command Safeguards, and MCP Protocol Updates (/posts/claude-code-adds-deep-plugin-mods-command-safeguards-and-mcp-protocol-updates/).

**Sources**
- [Claude Code v2.1.302 Release Notes](https://github.com/anthropics/claude-code/releases/tag/v2.1.302)

For related LockDraft context, see [Anthropic Releases Claude Code v2.1.295 with Strict Hook Controls, Gateway Filters, and MCP Fixes](/posts/anthropic-releases-claude-code-v21295-with-strict-hook-controls-gateway-filters-/).

## Sources

- [Official source](https://github.com/anthropics/claude-code/releases/tag/v2.1.302)
