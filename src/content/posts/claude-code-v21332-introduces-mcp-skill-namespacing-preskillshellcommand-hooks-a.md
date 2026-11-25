---
title: >-
  Claude Code v2.1.332 Introduces MCP Skill Namespacing, PreSkillShellCommand
  Hooks, and Pipe Timeouts
published: 2026-11-25T03:48:44.777Z
draft: false
description: >-
  Claude Code v2.1.332 introduces MCP skill namespacing, a PreSkillShellCommand
  hook event, pipe read timeouts, and context compaction fixes.
tags:
  - AI Agents
  - MCP
  - Developer Tools
  - ai-news
  - claude-code
  - tool-update
category: Agents
author: LockDraft
sourceLink: 'https://github.com/anthropics/claude-code/releases/tag/v2.1.332'
---

## What changed

Anthropic released Claude Code v2.1.332, bringing beta support for namespaced Model Context Protocol (MCP) skills, expanded hook events, and reliability fixes for context management and background processes.

Key additions and modifications include:

* **MCP Skill Integration**: MCP server skills are now exposed in the `/` command interface using a `server:skill` naming format, expanding on earlier [skill namespacing updates](/posts/anthropic-releases-claude-code-v21309-with-security-patches-skill-namespacing-an/). Standard skills maintain their existing plain names.
* **PreSkillShellCommand Hook**: A new hook trigger, `PreSkillShellCommand`, enables automated verification pipelines to evaluate and decline inline shell executions requested by skills or commands during initialization.
* **Failed Auth Handling**: The `claude auth login` command now correctly exits with status code 1 and prints diagnostic advice (such as checking disk space or removing stale lock files) if credentials cannot be written to disk, replacing a bug where it falsely printed a successful login message.
* **Named Pipe Read Timeouts**: File read operations, `@`-mentions, and transcript compaction tasks now enforce a 20-second timeout when blocked by unwritten named pipes, such as `.env` files mounted by locked external secret managers.
* **Context Compaction and Truncation**: Addressed context overflow loops where auto-compaction caused turns to end with `Prompt is too long`. Summary compaction attempts will retry up to three times before requesting shorter output, and hook output logs exceeding 50,000 characters are automatically truncated to prevent context spikes.
* **Terminal and Process Buffering**: Fixed terminal lockups caused by noisy local MCP stdout output streams that previously intercepted standard signals like `Ctrl+C`. Resolved long freezes when parsing `@`-mentions followed by extended unformatted strings, such as minified CSS containing base64 fonts.
* **Worktree and Session Rules**: Fixed double-sending of `CLAUDE.md` and project rules files after transitioning into `.claude/worktrees` subdirectories. Added an OpenTelemetry `assistant_response` event to track text dispatched through message tools.

## Why it matters

The introduction of `PreSkillShellCommand` extends existing [hook enforcement features](/posts/anthropic-releases-claude-code-v21295-with-strict-hook-controls-gateway-filters-/), letting developers prevent third-party MCP skills from silently running unvetted shell scripts upon loading. 

Additionally, handling silent named pipes with a hard 20-second timeout addresses automated pipeline hangs where secrets managers or container mounts block standard file read loops. Resolving output stream freezes and context limit failures improves execution stability in large monorepos containing heavy stdout logging or minified assets.

## What to do next

Developers can update to version 2.1.332 through their primary package manager. 

* **Audit Hook Configurations**: Implement `PreSkillShellCommand` in project hooks to intercept command execution requests prior to skill execution.
* **Check Secret Manager Mounts**: Verify that CI/CD pipelines mounting `.env` or custom pipes finish writing within 20 seconds to prevent file read timeouts.
* **Inspect Session Saving Warnings**: If using the Desktop or VS Code interfaces, use `/compact` when notified that earlier transcript turns could not be saved to storage.

## Limitations

Projects using settings files configured with the `PreSkillShellCommand` hook event on Claude Code versions 2.1.331 or older will trigger a pop-up warning dialog at client startup until those installations are updated.

## Sources

* [Claude Code v2.1.332 Release Notes](https://github.com/anthropics/claude-code/releases/tag/v2.1.332)
