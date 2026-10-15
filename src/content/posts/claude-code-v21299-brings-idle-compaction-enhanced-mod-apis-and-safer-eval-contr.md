---
title: >-
  Claude Code v2.1.299 Brings Idle Compaction, Enhanced Mod APIs, and Safer Eval
  Controls
published: 2026-10-15T13:52:46.582Z
draft: false
description: >-
  Anthropic's latest Claude Code update adds idle compaction, granular mod
  hooks, safer plugin evaluations, and several stability fixes.
tags:
  - claude-code
  - tool-update
  - anthropic
  - ai-news
category: Agents
author: LockDraft
sourceLink: 'https://github.com/anthropics/claude-code/releases/tag/v2.1.299'
---

## What changed

Anthropic released Claude Code v2.1.299, focusing on session management efficiency, mod developer tooling, and evaluation safety. The most prominent addition is automatic idle compaction. When a conversation exceeds 200,000 tokens and sits idle for roughly 54 minutes, the system compresses the history right before the one-hour prompt cache expires, preventing redundant processing on the next user message. You can adjust the minimum token threshold using `CLAUDE_CODE_IDLE_COMPACT_MIN_TOKENS` or disable the feature entirely by setting `"idleCompaction": false` in `settings.json`. This requires version v2.1.290 or newer.

For mod authors, the update expands available data. New environment variables like `CLAUDE_CODE_DISABLE_FILE_MENTIONS` let Claude receive only the file paths for `@` mentions rather than loading full contents. The `$.prompt.media` hook now grants access to raw image and document bytes for prompts submitted through managed settings. Additionally, `$.session.identity()` provides authentication context, including organization and email details when `forceLoginOrgUUID` is configured. UI styling for mods received parallel upgrades: `size`, `weight`, `mono`, and `tabular` properties were added to `Text` components and spacing steps (`xs` through `xl`) within `Box` layouts. While `bold` remains functional, it is officially deprecated in favor of `weight`.

Operational and safety controls saw multiple additions. The `claude plugin eval` command now accepts `--disallow-tools` and a `disallowed_tools` configuration field, enabling testers to block built-in utilities like the Agent tool during benchmark runs. The terminal agent view gained `/effort`, `/fast`, and `/model` shortcuts that trigger selection menus and establish defaults for fresh sessions. A safe-mode indicator now appears in the peek panel for background processes launched with `--safe-mode`. Behind the scenes, `--shutdown-drain-sec` gives the self-hosted runner orchestrator a grace period to finish active polling and spawn hooks before terminating on SIGTERM.

## Why it matters

These changes directly address friction points in long-running development workflows and enterprise deployment pipelines. Automatic compaction reduces wasted compute cycles and keeps prompt cache hits reliable, which is critical when agents maintain extensive codebases across multiple turns. The expanded mod APIs (`$.prompt.media`, `$.session.identity()`) bridge gaps for organizations managing deployments through centralized policy files, allowing extensions to handle attachments and verify compliance contexts without workarounds. 

Safety improvements around plugin evaluation and session termination prevent accidental resource exhaustion or credential exposure during testing and orchestration. If you are integrating custom gateways or managing multi-tenant setups, these controls align with the stricter hook validation and routing filters introduced in earlier patches like [Claude Code Adds Deep Plugin Mods, Command Safeguards, and MCP Protocol Updates](/posts/claude-code-adds-deep-plugin-mods-command-safeguards-and-mcp-protocol-updates/).

## What to do next

Update your local CLI to v2.1.299 to access the idle compaction logic and new environment variables. If you manage environments through a Claude Apps gateway, configure `CLAUDE_CODE_ATTRIBUTION_HEADER=0` in the `code` policy's `env` block to suppress attribution blocks, or leverage `CLAUDE_CODE_DISABLE_FILE_MENTIONS` to optimize memory usage during heavy `@` reference usage. Mod developers should audit their CSS/styling rules to migrate away from `bold` toward `weight`, and review `$.prompt.media` implementations for attachment handling. Testers running plugin benchmarks should adopt `--disallow-tools` to isolate third-party functionality from core agent capabilities.

## Limitations and caveats

Idle compaction only triggers above the 200K-token baseline and requires approximately 54 minutes of inactivity before the cache window closes. The feature mandates v2.1.290 as a base, so older installations will not see the optimization. Managed organization settings currently skip certain mod hooks, a behavior documented in `/plugin` and `claude plugin validate` output. Additionally, while the `--shutdown-drain-sec` parameter improves graceful termination, it does not override hard timeouts or external process managers enforcing stricter kill signals.

## Sources

- [Claude Code v2.1.299 Release Notes](https://github.com/anthropics/claude-code/releases/tag/v2.1.299)
