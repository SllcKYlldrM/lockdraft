---
title: >-
  Anthropic Releases Claude Code v2.1.318 with Mod Effort Controls and Gateway
  IAM Attribution
published: 2026-11-08T00:01:45.434Z
draft: false
description: >-
  Claude Code v2.1.318 adds effort controls for subagents, AWS IAM role
  assumption for gateways, and fixes process cleanup and auth lock bugs.
tags:
  - Developer Tools
  - anthropic
  - ai-news
  - claude-code
  - tool-update
category: Agents
author: LockDraft
sourceLink: 'https://github.com/anthropics/claude-code/releases/tag/v2.1.318'
---

## What changed

Anthropic released Claude Code v2.1.318, bringing granular cost and execution controls to extension mods, expanding gateway identity features, and fixing multiple process lifecycle and configuration locking bugs.

### Extension Mods and Upstream Routing
* **Subagent effort controls**: Developers can now specify an `effort` parameter inside a mod's `$.model.fork` config. This allows side jobs to run at `low` effort regardless of the main session's effort setting, with the API response reporting the effort level used.
* **Gateway IAM attribution**: Upstream `mantle` gateways handling Claude app traffic now support `assume_role`. This enables AWS role assumption across different accounts and allows per-developer cost attribution.
* **Mod approval tracking**: The runtime now logs user answers when Claude Code prompts to enable mods written during an active session.

### Authentication and Expiration Telemetry
* **Token expiration fields**: Added `loginExpiresAt` to `claude auth status` and `credential_expires_at` to `claude -p` JSON output.
* **Expiration warnings**: `claude -p` text output now prints a one-line warning to `stderr` starting 10 days before a stored claude.ai sign-in expires.
* **Auth lock and file fixes**: Resolved silent configuration drops on shared network home directories during `/logout`, `claude auth logout`, and setting updates. Fixed an issue where signing into an account on another terminal or host marked existing sessions on the same shared home as `Not logged in`.

### Reliability and Bug Fixes
* **Session continuation**: Fixed a regression introduced in v2.1.314 where `--continue` lost prior conversation history after exhausting retries on a malformed tool call. (For context on earlier environment and runner changes, see coverage of [v2.1.311](/posts/anthropic-releases-claude-code-v21311-with-self-hosted-runner-flags-and-auto-com/) and [v2.1.295](/posts/anthropic-releases-claude-code-v21295-with-strict-hook-controls-gateway-filters-/)).
* **Process lifecycle and binary cleanup**: Fixed `spawn ENOENT` errors on background daemons, self-hosted runners, and `claude remote-control` hosts caused by version cleanup deleting active binaries. Fixed background cleanup treating processes owned by other users (such as `sudo claude`) as dead.
* **MCP server management**: `claude mcp add` and `remove` now wait for config locks or exit with status code 1. Stdio MCP servers that exit during initial version probing are no longer re-probed on every start, and servers that crash within 3 seconds of startup are pinned to the legacy handshake for 7 days.
* **Cloud and runner execution**: Fixed shell commands executing in the startup folder instead of the requested target directory following cloud session restarts. Environment variables written to `CLAUDE_ENV_FILE` by `Setup` hooks now correctly pass to the Bash tool in cloud environments.
* **Mac resource usage**: Resolved an issue where macOS sessions running numerous Bash commands stalled due to unbounded memory growth.

## Why it matters

For teams deploying Claude Code across enterprise infrastructure, `assume_role` support on `mantle` gateways simplifies multi-account AWS architectures and provides clean cost attribution back to individual developer accounts.

The addition of `effort` parameters to `$.model.fork` offers precise cost control over secondary tasks. Heavy reasoning sessions can now spawn quick sub-tasks configured at `low` effort, avoiding unnecessary token consumption for trivial side jobs.

Fixes around file locks, daemon binary deletion, and shared home directory behavior stabilize automated pipelines and multi-tenant setups where network storage or background daemons previously caused silent failures or dropped credentials.

## Limitations
While `claude mcp add` and `remove` commands now wait for file locks or exit with code 1, a server save can still be overwritten if another process writes a new configuration immediately after the lock is released.

## What to do next
1. **Upgrade Claude Code**: Update your CLI installation to v2.1.318 via your standard package manager.
2. **Audit Subagent Mods**: Update custom subagent definitions to pass `effort: low` inside `$.model.fork` for lightweight background steps.
3. **Monitor Credential Expiry**: Update automated scripts running `claude -p` to parse `credential_expires_at` from the JSON response to automate re-authentication.
4. **Configure AWS Gateways**: If using `mantle` upstreams, configure `assume_role` settings to begin tracking per-developer AWS spending.

## Sources
* [Claude Code v2.1.318 Release Notes](https://github.com/anthropics/claude-code/releases/tag/v2.1.318)
