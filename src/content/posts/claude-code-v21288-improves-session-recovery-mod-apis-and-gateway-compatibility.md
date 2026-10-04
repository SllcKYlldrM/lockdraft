---
title: >-
  Claude Code v2.1.288 Improves Session Recovery, Mod APIs, and Gateway
  Compatibility
published: 2026-10-04T14:27:25.689Z
draft: false
description: >-
  Claude Code v2.1.288 introduces UI selection APIs, cleared prompt recovery,
  code review controls, and key fixes for gateway structured outputs.
tags:
  - AI
  - Developer Tools
  - automation
  - anthropic
  - ai-news
  - claude-code
category: Agents
author: LockDraft
sourceLink: 'https://github.com/anthropics/claude-code/releases/tag/v2.1.288'
---

## What changed

Anthropic released Claude Code v2.1.288, introducing new terminal interface capabilities, expanded command configurations, and stability fixes spanning cloud environments, plugins, and session management.

Key additions and modifications in this release include:

* **UI Mods and Interface Navigation:** UI mods can now call `$.ui.selection()` to retrieve text selected in fullscreen mode, including the associated transcript row when applicable. Terminal keyboard shortcuts now include `Ctrl+F` for searching sessions by name and `Alt+↑`/`Alt+↓` for jumping between agent groups, with both keybindings customizable in `keybindings.json`. Additionally, pressing the Up arrow on an empty prompt restores text or images previously cleared with `Ctrl+C`.
* **Code Review Settings:** The `/code-review` tool now supports `--max-findings <n>|all` to control how many findings are reported. The selection remains active until reset using `--max-findings default`.
* **Gateway and MCP Enhancements:** An explicit re-authentication prompt now appears when an MCP server requests additional OAuth scopes during a tool execution. For environments deployed on Mantle or behind proxy gateways that reject structured outputs, setting `CLAUDE_CODE_DISABLE_STRUCTURED_OUTPUTS` prevents failures in memory recall, session titling, and prompt hooks.
* **Session Resilience and Auto Mode Fixes:** Mid-response API timeouts no longer fail entire execution turns; subagents and non-interactive sessions continue processing partial responses, while thinking-only turns are automatically retried. Long sessions reporting zero token usage now trigger auto-compaction rather than erroring with "Prompt is too long." Fixes also prevent `--resume` from dropping recently restored files or losing thinking history generated on version 2.1.286 or earlier.
* **Plugin and Tooling Fixes:** Plugin LSP configurations now correctly expand `${user_config.*}` and `${CLAUDE_PLUGIN_ROOT}` variables rather than passing raw strings. Plugin installs using `git-subdir` now succeed on Git versions prior to 2.39 (such as Git 2.34 on Ubuntu 22.04). In cloud environments lacking a preinstalled GitHub CLI, Claude Code provides a built-in `gh api` tool.

## Why it matters

This update focuses on reducing failure points across long-running autonomous workflows, custom developer environments, and enterprise infrastructure.

Building on earlier mod and safety improvements detailed in [Claude Code Adds Deep Plugin Mods, Command Safeguards, and MCP Protocol Updates](/posts/claude-code-adds-deep-plugin-mods-command-safeguards-and-mcp-protocol-updates/), version 2.1.288 resolves edge-case bugs in plugin execution—such as unparsed diff elements breaking plugin views and background timers terminating when plugins reload.

For team setups and infrastructure integrations—a focus of recent stability releases like [Claude Code Update: Terminal Layout Controls, Telemetry Diagnostics, and Session Stability Fixes](/posts/claude-code-update-terminal-layout-controls-telemetry-diagnostics-and-session-st/)—the addition of `CLAUDE_CODE_DISABLE_STRUCTURED_OUTPUTS` addresses gateway incompatibility issues directly. Meanwhile, session compaction and transcript rewrite fixes protect state integrity during long-running agent interactions.

## What to do next

To adopt these changes in your environment:

1. Update your Claude Code installation to version 2.1.288 using your standard upgrade process.
2. If operating behind custom corporate proxies, Amazon Bedrock, or Mantle setups that disallow structured model outputs, set `CLAUDE_CODE_DISABLE_STRUCTURED_OUTPUTS` in your shell environment.
3. Leverage `$.ui.selection()` in custom UI mods to capture user terminal selections.
4. Adjust finding volume in automated reviews by running `/code-review --max-findings <n>` or `/code-review --max-findings all`.

### Limitations and Caveats
Disabling structured outputs via `CLAUDE_CODE_DISABLE_STRUCTURED_OUTPUTS` ensures compatibility with strict gateways, but it may alter how memory recall and prompt hooks process model responses. Additionally, while `git-subdir` support has been backported to work with Git releases prior to 2.39, updating host system dependencies remains recommended where feasible.

## Sources
* [Claude Code v2.1.288 Release Notes](https://github.com/anthropics/claude-code/releases/tag/v2.1.288)
