---
title: >-
  Claude Code v2.1.321 Adds Fable 5.2, Remote Control Settings, and Network Edit
  Fixes
published: 2026-11-13T12:40:37.274Z
draft: false
description: >-
  Anthropic updates Claude Code to v2.1.321, adding Claude Fable 5.2, remote
  control settings flags, sandbox security patches, and network path fixes.
tags:
  - AI Agents
  - Developer Tools
  - anthropic
  - ai-news
  - claude-code
  - tool-update
category: Agents
author: LockDraft
sourceLink: 'https://github.com/anthropics/claude-code/releases/tag/v2.1.321'
---

## What changed

Anthropic has released Claude Code v2.1.321, introducing support for new models, configuration options, security patches, and file-system bug fixes across local and remote environments.

Key updates in this release include:

* **Claude Fable 5.2 Integration**: Added `claude-fable-5-2` as the default Fable model. It features a 1-million-token context window, priced at $8 per million input tokens, $40 per million output tokens, and $0.20 per million tokens for prompt cache reads.
* **Remote Control Settings Configuration**: The `claude remote-control` command now accepts a `--settings <file>` flag to apply a unified settings configuration across all spawned sessions. If the specified file is modified on disk, new sessions are blocked until `claude remote-control` is restarted.
* **Sandbox and Security Patches**: Resolved an issue where Model Context Protocol (MCP) OAuth flows leaked secrets, such as refresh tokens, to unverified hosts following a server redirect. Fixed sandbox bypasses where read-only Bash commands executed without user prompts, corrected folder context evaluation during Bash file write checks, and enforced deny rules and protected-file prompts when `cp` or `mv` commands target directories. These follow previous security hardening efforts in [v2.1.309](/posts/anthropic-releases-claude-code-v21309-with-security-patches-skill-namespacing-an/).
* **Network Directory and File Editing Fixes**: Addressed destructive editing bugs occurring over UNC shares, WSL folders, and `/net` mounts. Fixed `NotebookEdit` calls deleting or overwriting the initial notebook cell when no cell index was specified. Resolved `Edit` failures that replaced entire files on empty `old_string` inputs or treated notebooks as plain text on network mounts.
* **Hook and Environment Stability**: Building on the [hook controls in v2.1.295](/posts/anthropic-releases-claude-code-v21295-with-strict-hook-controls-gateway-filters-/), this release fixes Windows `FileChanged` hooks stalling on lowercase drive letters when monitoring `watchPaths`. Resolved conflicts between `PreToolUse` hooks (`ask` and `defer` reasons) and corrected large hook output files overwriting unrelated outputs from the same tool call. Cloud sessions no longer match parent processes during `pkill`, `pgrep`, or `pidwait` operations.

## Why it matters

Developers running Claude Code across network drives, containers, or remote environments frequently face platform-specific edge cases. The fixes to `NotebookEdit` and path resolution prevent accidental data destruction on WSL and SMB/UNC mounts. 

For enterprise operators, the new `--settings` flag in `claude remote-control` enables stricter policy enforcement across remote sessions, while the OAuth redirect fix eliminates a high-risk credential exposure vector when connecting to external MCP servers.

## What to do next

1. Update to the latest release using your package manager or CLI updater.
2. If using remote management, supply `--settings <file>` when initializing `claude remote-control` to enforce global session parameters.
3. Verify custom MCP server integrations that rely on OAuth flows to ensure redirects operate cleanly without dropping tokens.

### Limitations
When using `--settings <file>` under `claude remote-control`, hot-reloading is intentionally disabled: editing the configuration file halts new session creation until the underlying background daemon process is completely restarted.

## Sources

* [Claude Code v2.1.321 Release Notes](https://github.com/anthropics/claude-code/releases/tag/v2.1.321)
