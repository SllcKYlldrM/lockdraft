---
title: >-
  Anthropic Releases Claude Code v2.1.311 with Self-Hosted Runner Flags and
  Auto-Compaction Fixes
published: 2026-10-28T06:22:04.822Z
draft: false
description: >-
  Claude Code v2.1.311 fixes 200K token compaction errors, improves subagent MCP
  connectivity, and adds hold parameters for self-hosted runners.
tags:
  - AI Agents
  - Developer Tools
  - anthropic
  - ai-news
  - claude-code
  - tool-update
category: Agents
author: LockDraft
sourceLink: 'https://github.com/anthropics/claude-code/releases/tag/v2.1.311'
---

## What changed

Anthropic has released Claude Code v2.1.311, introducing control flags for self-hosted environments alongside bug fixes for token compaction, subagent lifecycles, and tool execution.

### Self-Hosted Runner Controls
The update introduces two new parameters for `self-hosted-runner`: `--hold-idle-file` and `--max-hold-min`. These settings allow idle runner sessions to remain active while host systems complete processes spawned during execution.

### Token Management and File State
- **Context Compaction:** Standard-context sessions that cross the 200K token threshold previously failed with an error stating that usage credits were required for a 1M context. Claude Code now automatically compacts conversation history and continues execution.
- **Memory Refresh Fixes:** Fixed an issue where Claude read stale `MEMORY.md` and `CLAUDE.md` content following auto-compaction if those files had been modified earlier in the session.
- **Startup Freezes:** Solved extended freezes occurring during session launch or file reads when `CLAUDE.md` contained excessively long list items.

### Subagents and MCP Integration
- **Late-Connecting MCP Servers:** Subagents can now access Model Context Protocol (MCP) tools from servers that finish initializing after the subagent has already started.
- **Hook Execution Frequency:** Fixed `SubagentStop` hooks firing roughly twice per minute per active subagent; hooks now execute once upon completion.
- **Isolated Worktree Retention:** Fixed an issue where a parent subagent's isolated Git worktree was deleted while a spawned background subagent was still actively working inside it.
- **Path Configuration:** Relative Model Context Protocol commands (`claude mcp add`, `claude mcp remove`, and `/mcp`) executed inside subdirectories now correctly record the repository root entry in `~/.claude.json` instead of local folder paths. Duplicate error prefixes like `ENOENT: ENOENT:` in `claude mcp list` and `get` outputs have also been resolved.

### Tool Performance and Network Timeouts
- **Large File Edits:** Resolved up to 5-second stalls in the `Write` and `Edit` tools when modifying thousands of lines. These tools previously reported 0 lines changed upon completion.
- **Cloud Session Timeouts:** In Cowork cloud sessions, `WebFetch` and `WebSearch` calls no longer hang indefinitely on stalled remote connections; requests now time out after 300 seconds.
- **Interruption Responsiveness:** Interrupting an operation now takes effect immediately during pending MCP resource reads or background skill downloads, rather than waiting for network timeouts.
- **File Ignore Rules:** The `@` file selector now correctly respects inclusion negations (such as `!file`) defined in `.ignore` and `.rgignore` files.

### CLI and Daemon Diagnostics
- **Daemon Management:** The CLI now directs users to run `claude daemon stop --any` to stop background services, replacing references to the deprecated `claude daemon restart` command.
- **Environment Diagnostics:** Corrected inaccurate shell reporting in the environment block (for example, reporting `fish` when the `Bash` tool executes commands via `zsh`).
- **Respawn Checks:** Running `claude respawn <id>` now checks whether the target background session ID exists before initializing the background service.

## Why it matters

For enterprise teams running autonomous developer workflows, token compaction bugs previously caused unrecoverable pipeline failures mid-task when context sizes scaled past 200K tokens. Fixing this ensures long-running agent tasks complete cleanly.

Additionally, subagent worktree cleanup bugs and out-of-sync MCP server states previously caused silent failures in multi-agent configurations. Following recent architecture updates covered in [Claude Code v2.1.309](/posts/anthropic-releases-claude-code-v21309-with-security-patches-skill-namespacing-an/) and [Claude Code v2.1.295](/posts/anthropic-releases-claude-code-v21295-with-strict-hook-controls-gateway-filters-/), v2.1.311 continues to stabilize agent orchestration, execution safety, and system-level configuration handling.

## What to do next

1. Update your Claude Code installation using your environment's package manager.
2. If using self-hosted runners that launch asynchronous background processes, update your execution scripts to include `--hold-idle-file` and define maximum retention windows with `--max-hold-min`.
3. If local background services fail to respond, use `claude daemon stop --any` to reset active background sessions.

## Sources
- [Claude Code v2.1.311 Release Notes](https://github.com/anthropics/claude-code/releases/tag/v2.1.311)
