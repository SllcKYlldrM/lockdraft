---
title: >-
  Claude Code v2.1.329 Improves Hook Diagnostics, OpenTelemetry Support, and
  File Handling Reliability
published: 2026-11-26T00:50:16.052Z
draft: false
description: >-
  Claude Code v2.1.329 adds hook failure warnings, enables OpenTelemetry in Code
  Mode, and patches critical file-saving and memory leak bugs.
tags:
  - claude-code
  - tool-update
  - anthropic
  - ai-news
category: Agents
author: LockDraft
sourceLink: 'https://github.com/anthropics/claude-code/releases/tag/v2.1.329'
---

## What changed
This release introduces diagnostic improvements and stability patches across the CLI and desktop environments. The trust dialog now explicitly flags where folder-level hooks are declared, and non-interactive hosts like Claude Desktop will surface warnings when managed hooks fail to initialize. Session management received updates: `/tasks` now aggregates scheduled jobs, `/loop` wakeups, goals, and conversation forks, with an `x` command that halts individual tasks after confirmation. 

For observability, Code Mode can now run alongside OpenTelemetry. Every tool invocation exports telemetry events, though active tracing remains disabled by default. Network resilience improved through `/mcp` server pages, which display a "Server message" row containing JSON-RPC errors when remote HTTP endpoints reject connections. The `/status` dashboard also lists managed marketplaces that skip automatic updates, along with the specific reasons.

Several file-handling and configuration bugs were addressed. Accepted IDE diffs now correctly preserve the last newline and byte order mark (BOM), preventing corruption when editing via VS Code. The `/terminal-setup` command no longer damages VS Code keybinding files containing unclosed strings or block comments. Additionally, `~/.claude.json` avoids being wiped to defaults during network stalls or file locks. The `/code-review` command now relies on `gh pr diff` for accurate pull request analysis instead of checking the wrong branch.

## Why it matters
Reliability in automated coding workflows depends on predictable state management and accurate error reporting. The previous version of this tool occasionally corrupted local configuration files or silently dropped metadata like BOMs, forcing manual recovery. By guaranteeing newline and BOM preservation during diff acceptance, developers can safely rely on IDE-mediated edits without losing formatting or encoding metadata.

Memory and process stability have also been tightened. Runaway loops in Code Mode now enforce strict memory limits, and background shell commands no longer retain historical conversation context until termination. Remote control operations and compacted sessions similarly avoid lingering memory consumption. On macOS, the persistent sign-out loop tied to Keychain permissions is resolved; the affected session now stops at expiry and prints the exact reason, leaving other authenticated sessions intact.

Enhanced diagnostics reduce troubleshooting time. When MCP servers drop connections or return protocol mismatches, the CLI now handles reconnection attempts automatically and surfaces the underlying JSON-RPC failures directly in the dashboard. Hook loading failures are immediately visible rather than silently ignored, aligning with earlier strict control implementations.

## What to do next
1. Upgrade to v2.1.329 via your package manager or distribution channel.
2. Review `/status` to identify any managed marketplaces bypassing auto-updates, and adjust your dependency strategy accordingly.
3. Enable OpenTelemetry in Code Mode if you need fine-grained tool-call tracing, keeping in mind that standard tracing overrides this setting.
4. Verify hook declarations in your project directories, as the updated trust dialog will now highlight their sources.

For context on previous security and sandbox hardening, see our coverage of [Anthropic Releases Claude Code v2.1.309 with Security Patches, Skill Namespacing, and Sandbox Fixes](/posts/anthropic-releases-claude-code-v21309-with-security-patches-skill-namespacing-an/). If you previously implemented strict hook controls or gateway filters, note that this release builds on those patterns with more explicit failure notifications. See [Anthropic Releases Claude Code v2.1.295 with Strict Hook Controls, Gateway Filters, and MCP Fixes](/posts/anthropic-releases-claude-code-v21295-with-strict-hook-controls-gateway-filters-/).

## Limitations
OpenTelemetry instrumentation in Code Mode remains disabled when full tracing is active. Self-hosted runners using `--push-outcome-on-release` should verify branch cleanup behavior, as early iterations of this flag occasionally deleted session branches on git hosts. Some CLI commands still require explicit user confirmation before halting background tasks.

Sources:
- [Claude Code v2.1.329 Release Notes](https://github.com/anthropics/claude-code/releases/tag/v2.1.329)

## Sources

- [Official source](https://github.com/anthropics/claude-code/releases/tag/v2.1.329)
