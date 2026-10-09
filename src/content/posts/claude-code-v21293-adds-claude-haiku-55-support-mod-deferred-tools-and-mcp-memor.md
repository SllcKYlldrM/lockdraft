---
title: >-
  Claude Code v2.1.293 Adds Claude Haiku 5.5 Support, Mod Deferred Tools, and
  MCP Memory Fixes
published: 2026-10-09T06:49:31.273Z
draft: false
description: >-
  Claude Code v2.1.293 adds Claude Haiku 5.5 support, new mod options
  (isDeferred, agentType), and fixes memory leaks and context compaction bugs.
tags:
  - anthropic
  - AI Agents
  - Developer Tools
  - ai-news
  - claude-code
  - tool-update
category: Agents
author: LockDraft
sourceLink: 'https://github.com/anthropics/claude-code/releases/tag/v2.1.293'
---

## What changed

Anthropic has released Claude Code v2.1.293, introducing support for the new Claude Haiku 5.5 model, extending mod developer tools, and delivering a batch of bug fixes across background sessions, subagents, and memory management.

Key updates in this release include:

* **Claude Haiku 5.5 Integration**: Added `claude-haiku-5-5` as the standard Haiku model option on the Anthropic API. It features a 1M token context window with pricing set at $0.10 input and $0.50 output per million tokens ($0.50 input / $2.50 output for prompts exceeding 100K tokens).
* **Plugin Mod API Additions**: Mod developers can now add `isDeferred: false` when calling `$.tool.register`. This includes the tool's schema directly in the initial system prompt rather than hiding it behind dynamic tool search. Additionally, the `subagentStatusLine` event payload now includes an `agentType` parameter to distinguish custom subagent instances, and `claude plugin test` adds `mock.session` so tests can read rows appended via `$.session.append`.
* **Context Compaction & Loop Fixes**: Resolved a bug where Claude would misinterpret past actions completed prior to context compaction, causing it to redundantly repeat or retract completed tasks.
* **MCP Memory Leak Fix**: Fixed a leak where HTTP Model Context Protocol (MCP) connections retained all transmitted request history in memory until the connection fully closed.
* **Session Navigation & Terminal State**: Fixed navigation issues where pressing `←` to background a session would lose queued messages or trigger backgrounding while unsent prompt text or user prompts were active. Fixed an issue in `/model` where left/right arrow navigation wrapped past minimum/maximum effort bounds and unintentionally saved "Low" effort as the model default.
* **Tool and Permission Handling**: Fixed instances where subagents incorrectly reported built-in tools as disabled session-wide when only the agent's individual tool list omitted them. Fixed issues where missing `SendMessage` permissions caused errors when prompting subagents.
* **Review and Authentication Reliability**: Corrected `/ultrareview` failures on Linux involving nested repositories or split-index files, and prevented administrative CLI commands (`claude logs`, `stop`, `kill`, `daemon`) from signing out users when credentials hit expiration windows.

## Why it matters

Adding `claude-haiku-5-5` provides a high-context, low-cost option ($0.10/Mtok base) for subagents and lightweight background operations where full Claude Sonnet capabilities are unnecessary. 

For extension developers building on [Claude Code's plugin mod system](/posts/claude-code-adds-deep-plugin-mods-command-safeguards-and-mcp-protocol-updates/), the `isDeferred` registration flag gives explicit control over tool visibility. Skipping deferred tool search ensures core custom tools are instantly available to the model upon session initialization.

Long-running terminal sessions and automated background daemons benefit from memory leak fixes in HTTP MCP client adapters, as well as resolved context compaction issues that previously caused agents to duplicate work after context truncations. Improvements to terminal event handling also reduce accidental disconnects seen in earlier releases covering [terminal layout and session stability](/posts/claude-code-update-terminal-layout-controls-telemetry-diagnostics-and-session-st/).

*Limitations & Caveats*: Using `isDeferred: false` exposes tool schemas directly in the base system prompt, which increases the baseline prompt token count for every turn. Furthermore, while Haiku 5.5 maintains a low baseline cost, context usage above 100K tokens increases pricing fivefold ($0.50 input / $2.50 output per Mtok).

## What to do next

1. **Update Claude Code**: Upgrade your local installation using your package manager or command-line updater.
2. **Configure Models**: Set default light tasks or subagents to use `claude-haiku-5-5` in your configuration or agent definitions.
3. **Refactor Plugin Mods**: For custom tools that need immediate availability without undergoing tool search lookup, add `isDeferred: false` to your `$.tool.register` definitions.
4. **Update Subagent Monitoring**: Use the new `agentType` field in `subagentStatusLine` event listeners to build differentiated status indicators for custom agent workflows.

## Sources

* [Claude Code v2.1.293 Release Notes](https://github.com/anthropics/claude-code/releases/tag/v2.1.293)
