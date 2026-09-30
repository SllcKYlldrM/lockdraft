---
title: >-
  Claude Code v2.1.284 Updates Auto-Mode Prompts, Gateway Spend Tracking, and
  MCP Reconnection
published: 2026-09-30T13:53:50.061Z
draft: false
description: >-
  Claude Code v2.1.284 updates auto-mode prompts, adds gateway spend tracking,
  streamlines MCP reconnection, and patches SDK stability issues.
tags:
  - claude-code
  - anthropic
  - ai-agents
  - developer-tools
  - ai-news
  - model-release
category: Agents
author: LockDraft
sourceLink: 'https://github.com/anthropics/claude-code/releases/tag/v2.1.284'
---

## What changed

Claude Code v2.1.284 introduces model routing adjustments, gateway visibility upgrades, and several stability patches for automated workflows.

The default Sonnet model on the Anthropic API is now Claude Sonnet 5.5 (`claude-sonnet-5-5`). It ships with a 1 million token context window and pricing set at $2/$10 per Mtok, with cache reads priced at $0.20/Mtok. 

Auto-mode behavior received a targeted prompt addition. When the system requests a file read outside the configured working directory, users can now select "Yes, but ask again next time." This grants permission for the immediate operation while preserving the safety checkpoint for future cross-directory reads.

Usage monitoring improved through the Claude apps gateway. The status line and `/usage` command now render monthly spend limits as explicit dollar amounts (for example, "$271.40 / $500.00 spent this month"). Under the hood, the `rate_limits.spend_limit` object exposes `used_usd`, `limit_usd`, and `period` fields. The gateway also surfaces startup warnings when a managed policy defines an empty `availableModels` list or omits the startup model without configuring `model` or `enforceAvailableModels`.

Terminal and infrastructure controls expanded with `/mcp reconnect all`, allowing batch retries for all disconnected or authentication-pending MCP servers. The effort slider now maps to rebinding actions (`effortSlider:decreaseEffort`, `increaseEffort`, and `toggleUltracode`) so users can remap arrow and Tab keys via `keybindings.json`. Claude apps subscribers gain `/rate-limit-options` in both `/help` and the command palette for quicker access to usage-limit notices.

Enterprise deployments receive certificate client authentication (`private_key_jwt`) support between the gateway and identity providers that issue certificate credentials instead of client secrets. Telemetry forwarding to Google Cloud OTLP endpoints can now leverage gateway credentials using `auth: { google: {} }` within `telemetry.forward_to` destinations.

Stability patches address several edge cases. Malformed response streams previously exposed raw parsing errors like "JSON Parse error" or injected "undefined" into answers; these now trigger proper interruption reporting. Overloaded or server-error responses following a thinking block no longer terminate the turn prematurely. Persistent "Prompt is too long" states after initial compaction trigger a secondary compaction cycle that trims older conversation history. Session fallback messages now display the proper model-unavailable notice with a Learn more link instead of bare error strings.

The Agent SDK fixes a crash loop triggered by user messages containing malformed image sources; invalid images are replaced with an explanatory note rather than causing subsequent turns to fail. MCP tool calls in resumed sessions now wait up to 10 seconds for server readiness before throwing "No such tool available." Plan-usage endpoint rate-limits and login rejections trigger exponential backoff across `/usage`, `/extra-usage`, and IDE usage views. `claude mcp add` correctly refuses server registrations when managed settings restrict MCP to plugins only. The `/plugin` configure screen enforces type validation for boolean and number fields, and navigation keys now toggle field values instead of switching tabs. Foundry endpoint host validation rejects non-plain resource names for `ANTHROPIC_FOUNDRY_RESOURCE`. Shell mode backspace and Ctrl+U editing no longer break when the down arrow selects hidden background-task pills. Bash tool execution on Windows resolves conflicts with multiple plugin `bin/` directories.

## Why it matters

The auto-mode prompt refinement balances convenience with boundary enforcement, reducing friction for legitimate repository-wide reads while preventing silent scope drift. Gateway spend tracking and usage backoff logic eliminate billing blind spots and stop runaway polling during quota exhaustion, which is critical for cost-controlled automation pipelines. The `private_key_jwt` and Google Cloud OTLP telemetry options reduce integration overhead for teams deploying agents behind strict identity gateways. SDK stability patches resolve recurring crash loops caused by invalid media payloads, making CI/CD and headless agent runs more predictable.

## What to do next

Update your environment to v2.1.284 to access the Sonnet 5.5 default and batch reconnection commands. Map custom effort slider bindings in `keybindings.json` if you prefer non-default keyboard shortcuts. Test the `/mcp reconnect all` workflow against your current authentication configurations to verify seamless server recovery. Audit your gateway policy definitions to ensure `availableModels` and startup model settings align with the new warning triggers, and validate any certificate-based identity provider integrations. 

**Limitations**
The effort slider keybinding actions require manual configuration in `keybindings.json` and do not apply globally until saved. The 10-second timeout for resumed MCP sessions may introduce brief execution delays if backend servers experience extended handshake latency. The gateway spend limit display and usage backoff logic only activate when running v2.1.284 or later. Managed policies that restrict MCP functionality to plugins will continue to block `claude mcp add` registrations until permissions are adjusted.

*Further reading*
- [Claude Code Update: Terminal Layout Controls, Telemetry Diagnostics, and Session Stability Fixes](/posts/claude-code-update-terminal-layout-controls-telemetry-diagnostics-and-session-st/)
- [Claude Code v2.1.280 Introduces Opus 5.5, Tightens Auto-Mode, and Fixes Agent Caching](/posts/claude-code-v21280-introduces-opus-55-tightens-auto-mode-and-fixes-agent-caching/)

### Sources
- [Claude Code v2.1.284 Release Notes](https://github.com/anthropics/claude-code/releases/tag/v2.1.284)
