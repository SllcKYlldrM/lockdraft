---
title: >-
  Anthropic Updates Claude Code v2.1.323 with Experimental Code Mode and Plugin
  Versioning
published: 2026-11-14T11:48:28.205Z
draft: false
description: >-
  Claude Code v2.1.323 introduces experimental Code Mode, plugin engine
  constraints, long-hook heartbeats, and memory bug fixes.
tags:
  - AI
  - Developer Tools
  - anthropic
  - ai-news
  - claude-code
  - tool-update
category: Agents
author: LockDraft
sourceLink: 'https://github.com/anthropics/claude-code/releases/tag/v2.1.323'
---

## What changed

Anthropic has released version v2.1.323 of Claude Code, introducing an experimental execution feature, stricter plugin validation, and multiple memory and session fixes.

* **Experimental Code Mode**: Users can opt into Code Mode, an experimental setting where Claude writes JavaScript to call its underlying tools.
* **Plugin Engine Limits and Validation**: Plugins can now specify `engines["claude-code"]` inside `plugin.json`. Claude Code will not install, update, or load plugins outside of their defined version range. Additionally, `claude plugin validate` now checks TypeScript hooks modules for type findings (emitting warnings, or failing when run with `--strict`) and validates `$` nouns that an `engine.create` hook adds, withholds, or replaces.
* **Long-Running Hook Heartbeats**: A 30-second progress heartbeat has been added for `claude -p` and SDK sessions while hooks execute, preventing host environments like Claude Desktop from marking turns as hung.
* **Environment and Managed Settings**: Managed settings now support `CLAUDE_CODE_AUTO_MODE_MODEL` for Claude Desktop sessions on third-party providers. The flag `CLAUDE_CODE_DISABLE_AGENT_PROGRESS_SUMMARIES` (available since version 2.1.318) can be set to `1` to disable subagent summaries and associated write requests. Host applications can also set `CLAUDE_CODE_RESUME_HINT_COMMAND` to customize the resume prompt on exit.
* **UI and Tool Updates**: The Artifact tool now accepts `.docx` file uploads. The interface adds an options menu when usage credits are depleted or disabled, displays a `/diff to close` hint on the diff panel, and alerts users at startup if a Bash allow rule contains a wildcard in a variable value (such as `Bash(PORT=* npm run dev)`).
* **Core Bug Fixes**: Resolves memory spikes when modifying very large files, OOM crashes on `/proc` files or named pipes, unhandled message loss when running `/compact`, and text rendering artifacts caused by wrapped combining marks or accents.

## Why it matters

Code Mode alters how the agent handles tool calling by shifting to scripted JavaScript execution. For plugin developers, strict engine ranges in `plugin.json` prevent unexpected breakages across tool versions, while TypeScript hook validation catches code issues early. The addition of periodic heartbeats addresses timeouts during background execution in wrapper platforms like Claude Desktop.

## What to do next

* **Enable Code Mode**: Review the documentation at `https://code.claude.com/docs/en/code-mode` to opt in or configure organization-wide settings.
* **Update Plugin Configurations**: Add `engines["claude-code"]` bounds to `plugin.json` and run `claude plugin validate --strict` to check TypeScript hooks modules and audit `$` nouns added, withheld, or replaced by `engine.create` hooks.
* **Toggle Agent Summaries**: Set `CLAUDE_CODE_DISABLE_AGENT_PROGRESS_SUMMARIES=1` in your environment if you want to turn off subagent progress updates.

Code Mode remains experimental. Furthermore, integrations relying on Claude Desktop updates (such as turn heartbeats and `CLAUDE_CODE_AUTO_MODE_MODEL`) require a future Claude Desktop build that incorporates version v2.1.323.

For related LockDraft context, see [Anthropic Releases Claude Code v2.1.295 with Strict Hook Controls, Gateway Filters, and MCP Fixes](/posts/anthropic-releases-claude-code-v21295-with-strict-hook-controls-gateway-filters-/).
## Sources

* [Claude Code v2.1.323 Release Notes](https://github.com/anthropics/claude-code/releases/tag/v2.1.323)
