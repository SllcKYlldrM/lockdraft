---
title: >-
  Claude Code v2.1.326 Fixes PID Recycling Bugs, Deep Settings Crashes, and Tool
  Decision Logging
published: 2026-11-20T17:29:33.629Z
draft: false
description: >-
  Claude Code v2.1.326 brings Code Mode support for agent teams, telemetry
  options, process isolation fixes, and settings validation caps.
tags:
  - AI Agents
  - Developer Tools
  - anthropic
  - automation
  - ai-news
  - claude-code
category: Agents
author: LockDraft
sourceLink: 'https://github.com/anthropics/claude-code/releases/tag/v2.1.326'
---

## What changed

Anthropic has released Claude Code version v2.1.326, focusing on runtime stability, settings validation, and environment safety across multi-agent and CLI workflows.

### Agent Teams and Execution Modes
- **Code Mode for Teams**: Code Mode can now be toggled on while agent teams are active. Existing team sessions configured for Code Mode will launch directly into it.
- **Process & Session Handling**: Fixed a critical background service issue where recycled process IDs (PIDs) could cause Claude Code to terminate unrelated user processes, such as active SSH sessions. Background sessions also maintain exported LLM gateway variables across shell crashes or directory re-opens, halting before execution if the gateway is missing.
- **Linux Sandbox Updates**: Resolved issue where sandboxed Linux commands failed when home or configuration paths resolved via symlinks into `/net`. Addressed leftover lock files (such as `.git/config.lock`) when interrupted during sandboxed runs.

### Command Inspection and Permissions
- **Bash Execution Auditing**: Commands that modify or delete files—such as `find -delete`, `cat a > b`, and `sort -o`—are no longer miscategorized in transcripts as simple search or read operations. Spurious "Dangerous rm operation" prompts on unreadable commands without `rm` were also resolved.
- **File Denial Rules**: The `cp` tool is no longer blocked when an `Edit` deny rule applies strictly to the source file.
- **Settings Validation**: Configuration files nested deeper than 64 levels will now be truncated with a warning rather than causing crashes or partial applications. Unwritable settings files resulting from `/permissions` or `/add-dir` commands now generate explicit terminal warnings.

### Observability and UI Polish
- **OpenTelemetry Enhancements**: Introduced the `OTEL_RESOURCE_INCLUDE_HOST` environment variable (disabled by default) to attach `host.name` and `host.id` to resource attributes. Fixed missing `tool_decision` events and `permission_denials` entries when managed `PreToolUse` hooks reject a direct tool request.
- **Diagnostic Tools**: Running `/status` now explicitly lists features disabled by providers or environment variables like `DISABLE_TELEMETRY`.
- **Interface Updates**: Users can press `Ctrl+O` to display hidden startup notices, and subagent views now display an `esc to stop` footer hint when cancellation is available.

Following earlier releases such as [Claude Code v2.1.325](/posts/anthropic-patches-zstd-decoding-vulnerability-and-subagent-model-scoping-in-clau/) and [Claude Code v2.1.309](/posts/anthropic-releases-claude-code-v21309-with-security-patches-skill-namespacing-an/), this patch continues refining safety boundaries and administrative controls.

## Why it matters

Misclassifying destructive terminal commands in transcripts poses serious security risks for automated agent sessions. By correctly capturing file overwrites (`cat a > b`) and deletions (`find -delete`), v2.1.326 ensures audit logs accurately reflect agent actions.

Fixing process ID reuse prevents background agent services from abruptly killing unrelated system tasks, which is critical for developers running multi-tenant or multi-session shell environments. Additionally, capping configuration file nesting at 64 levels eliminates subtle crash vectors in large, managed enterprise deployments.

## What to do next

- **Update Claude Code**: Fetch the latest release via your standard package setup or binary installer.
- **Check Observability Setup**: If host-level tracking is required for telemetry pipelines, export `OTEL_RESOURCE_INCLUDE_HOST=true` in your shell environment.
- **Verify Permissions Status**: Run `/status` inside your Claude Code session to inspect active environment variables and managed policy overrides.

## Sources

- [Claude Code v2.1.326 Release Notes](https://github.com/anthropics/claude-code/releases/tag/v2.1.326)
