---
title: >-
  Claude Code v2.1.292 Adds Sub-Agent Effort Controls, Mod Caching, and Critical
  Security Patches
published: 2026-10-10T23:56:11.394Z
draft: false
description: >-
  Anthropic updates Claude Code with sub-agent effort controls, mod prompt
  caching, new plugin install flags, and important security patches.
tags:
  - AI Agents
  - Developer Tools
  - anthropic
  - ai-news
  - claude-code
  - tool-update
category: Agents
author: LockDraft
sourceLink: 'https://github.com/anthropics/claude-code/releases/tag/v2.1.292'
---

## What changed

Anthropic released Claude Code v2.1.292, introducing granular execution settings for sub-agents, new extension points for mods, performance enhancements, and security fixes.

Key changes in this release include:

- **Sub-Agent Effort Controls**: The Agent tool now accepts an `effort` parameter, allowing developers to set the precise reasoning or compute effort level when spawning sub-agents.
- **Mod Hooks and Prompt Caching**: Extension developers can hook into the new `prompt.autocomplete` event to insert custom completion options into the prompt input box. Inside `$.model.complete`, mods can now enable prompt caching by passing text blocks to `prompt` and `system` with `cache: true`. Additionally, the `agent.spawn` hook now passes workflow agents alongside their run and index details, allowing mods to block specific workflow executions.
- **Plugin Installation Options**: The CLI command `claude plugin install` now supports a `--marketplace <source>` flag, which adds the specified marketplace under standard policy checks prior to installing the plugin.
- **Custom Backoff Delays**: Operators can set the `CLAUDE_CODE_OVERLOADED_RETRY_BASE_DELAY_MS` environment variable to increase the base retry delay when handling HTTP 529 overloaded errors.

Security and path handling fixes:

- **Network Path Bypass**: Fixed a vulnerability where UNC network paths bypassed file-read permission prompts under `PreToolUse` hook approvals and auto mode.
- **Sandboxing and Path Isolation**: Commands running inside managed sandboxes can no longer read staged `/ultrareview` files stored in `~/.claude/seed-admin`. macOS and Windows file reads for notebooks and PDFs now prevent mid-read symlink replacements from accessing unapproved files outside the target directory.
- **Credential Injection & Policy Protections**: Fixed managed read-deny sandbox paths so mid-session updates properly revoke project grants and halt file-based credential injection. On-disk settings caches that have been tampered with can no longer disable the built-in policy plugin if settings fail to fetch.
- **Windows Short Name Handling**: Deletion operations like `rm -rf` targeting Windows 8.3 short names or alternate path spellings of drive/home folders are now correctly identified and handled as home directory deletions.

Tooling, session, and API fixes:

- **Proxy Rules**: Fixed an issue where setting `HTTPS_PROXY` caused internal API calls for sign-in, policy, feedback, and artifacts to ignore `NO_PROXY` settings.
- **MCP Tool Length**: Tools provided via Model Context Protocol (MCP) with names longer than 128 characters are now omitted individually with a descriptive error message rather than causing the entire request to fail.
- **File Handling**: `@`-mentioned text files larger than 256KB are no longer silently dropped; Claude is now informed of the file size and directed to read the file in segments. Passing non-contiguous page lists (such as "6,9,15") to PDF page reads now returns an error instructing the user to request single pages or continuous ranges.
- **Session State**: Restored plan mode state when resuming via `claude --resume` or `/resume`. Fixed issue where scheduled tasks created after `/resume`, `/branch`, or `/clear` failed to execute, and restored background `/loop` wakeups after process restarts.

## Why it matters

Adding an explicit `effort` parameter to sub-agents gives developers better control over API spend and execution time across complex, multi-agent workflows. Similarly, prompt caching support inside `$.model.complete` cuts latency and token costs for custom mods that reuse large system prompts.

On the security front, patching UNC path read bypasses, mid-read symlink swaps, and Windows 8.3 path handling hardens the agent execution sandbox against unexpected file system access. Fixing the `NO_PROXY` behavior ensures enterprise environments routing traffic through corporate proxies keep sign-in, policy checks, artifact fetching, and user feedback on internal routes when configured. These improvements build directly on earlier platform updates covering [command safeguards and MCP updates](/posts/claude-code-adds-deep-plugin-mods-command-safeguards-and-mcp-protocol-updates/) as well as [terminal layout and diagnostic controls](/posts/claude-code-update-terminal-layout-controls-telemetry-diagnostics-and-session-st/).

## What to do next

Developers using Claude Code in automated environments or building custom mods should update to the latest build to apply these security patches and workflow controls:

1. Update Claude Code to v2.1.292 using your standard installation manager.
2. In sub-agent calls, pass the `effort` parameter to limit or expand compute depth based on task complexity.
3. Update custom mod calls using `$.model.complete` to set `cache: true` on static prompt and system blocks to reduce latency.
4. If using proxies, verify that your `NO_PROXY` configuration correctly accounts for sign-in, policy, feedback, and artifact endpoints.
5. Adjust any automated scripts relying on PDF reads to query single pages or continuous ranges rather than comma-separated lists.

**Limitations & Caveats**: MCP tools with names longer than 128 characters will now be excluded from the model's available tools; tool developers must shorten their identifiers to make them accessible. Additionally, passing non-contiguous page lists to the Read tool for PDFs now raises an explicit error rather than silently returning only the first page in the list.

## Sources

- [Claude Code v2.1.292 Release Notes](https://github.com/anthropics/claude-code/releases/tag/v2.1.292)
