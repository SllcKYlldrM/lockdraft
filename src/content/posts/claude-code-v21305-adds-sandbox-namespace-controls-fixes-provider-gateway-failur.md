---
title: >-
  Claude Code v2.1.305 Adds Sandbox Namespace Controls, Fixes Provider Gateway
  Failures
published: 2026-10-22T14:08:39.001Z
draft: false
description: >-
  Claude Code v2.1.305 adds Linux user namespace options, fixes Bedrock/Vertex
  tool search regressions, and updates MCP permission rules.
tags:
  - anthropic
  - AI Agents
  - Developer Tools
  - ai-news
  - claude-code
  - tool-update
category: Agents
author: LockDraft
sourceLink: 'https://github.com/anthropics/claude-code/releases/tag/v2.1.305'
---

## What changed

Anthropic released Claude Code v2.1.305, introducing configuration options for Linux sandboxing, addressing provider gateway regressions, and updating Model Context Protocol (MCP) server handling.

Key additions and fixes in this release include:

- **Linux Sandbox Namespace Controls**: Added the `sandbox.allowNestedUserNamespaces` configuration key. This allows commands running in a Linux sandbox to spawn user namespaces, which is required for tools like Chromium and rootless Podman, though enabling it bypasses the sandbox's default file isolation protections.
- **Unattended Watchdog Re-checks**: Introduced `CLAUDE_CODE_RETRY_WATCHDOG_USAGE_LIMIT_RECHECK_MS` for the `CLAUDE_CODE_RETRY_WATCHDOG` unattended mode, allowing the runner to detect when usage limits clear prior to their scheduled reset time.
- **Gateway and Provider Fallbacks**: Fixed a regression introduced in version 2.1.304 where requests failed on AWS Bedrock, Google Cloud Vertex AI, or behind enterprise gateways that rejected tool search requests or omitted `ToolSearch` from `--tools`. Claude Code now automatically retries the request without tool search.
- **Workflow Journal Resumption**: Resuming a workflow now correctly loads previously executed `pipeline()` and `parallel()` agents from the execution journal instead of re-running them.
- **Model Settings and Case Sensitivity**: Fixed an issue where `/effort` and `/autocompact` commands failed to apply when model names differed by letter case or included a `[1m]` tag relative to `modelOverrides` values.
- **MCP Server Management**: Modified `allowedMcpServers` so `managed-mcp.json` stdio servers using `${VAR}` syntax solely within `env` are no longer filtered out. Enterprise teams wanting to block these must now explicitly list them under `deniedMcpServers`. Additionally, path-mounted plugins in Claude Desktop now strip `allowed-tools` if organizational policy enforces `allowManagedPermissionRulesOnly`.
- **Self-Hosted Runner Fixes**: Resolved a regression from version 2.1.300 where start scripts failed with `Resource temporarily unavailable` when `TERM` was set, and fixed a version 2.1.296 regression affecting git credential programs relying on `GIT_CONFIG`.
- **UI and Prompt Updates**: Updated the `/artifacts` deletion prompt to accept `1` or `Enter` to keep, `2` to delete, and `Esc` to cancel (`y` and `n` are no longer accepted). In `/usage`, actionable system warnings can now be automatically resolved by pressing `f`.

## Why it matters

For developers building complex workflows on enterprise platforms like Vertex AI and Bedrock, the tool search fix restores stability following gateway filtering changes introduced across recent releases like [Claude Code v2.1.295](/posts/anthropic-releases-claude-code-v21295-with-strict-hook-controls-gateway-filters-/). 

Similarly, adding `sandbox.allowNestedUserNamespaces` addresses a long-standing constraint for developers using browser automation (Chromium) or container tooling inside Linux sandboxes. The change to workflow resumption also ensures multi-agent pipelines do not burn redundant tokens by re-executing steps that were previously logged in the local journal, aligning with recent updates focused on [session stability and terminal diagnostic controls](/posts/claude-code-update-terminal-layout-controls-telemetry-diagnostics-and-session-st/).

## What to do next

1. **Update Claude Code**: Upgrade to v2.1.305 via your global package installation or CLI runner.
2. **Configure Linux Sandboxes**: If your agent tasks require running rootless Podman containers or headless Chromium browsers inside Linux sandboxes, add `sandbox.allowNestedUserNamespaces` to your settings, noting the security trade-offs.
3. **Review MCP Allowlist Configuration**: If you maintain `managed-mcp.json` configurations using environment variable expansion, review whether unwanted stdio servers now auto-load upon upgrade, and restrict them using `deniedMcpServers` if necessary. See earlier coverage on [MCP protocol updates](/posts/claude-code-adds-deep-plugin-mods-command-safeguards-and-mcp-protocol-updates/) for underlying permission models.
4. **Update Shortcuts**: Note the breaking keybinding change for interactive artifact deletion (`1`/`Enter` to keep, `2` to delete).

## Caveats

- Enabling `sandbox.allowNestedUserNamespaces` explicitly bypasses file protection mechanisms provided by the Linux sandbox environment. Use it only when nested namespaces are required by your tooling.
- Traditional `y`/`n` responses are no longer recognized by the `/artifacts` deletion prompt, which may affect manual habits in terminal sessions.

## Sources

- [Claude Code v2.1.305 Release Notes](https://github.com/anthropics/claude-code/releases/tag/v2.1.305)
