---
title: >-
  Anthropic Releases Claude Code v2.1.319 with Background MCP Tasks, Gateway
  Updates, and Diff Fixes
published: 2026-11-07T00:26:44.334Z
draft: false
description: >-
  Claude Code v2.1.319 adds terminal MCP task backgrounding, structured gateway
  logging, automatic permission denials, and diff rendering fixes.
tags:
  - AI Agents
  - Developer Tools
  - anthropic
  - ai-news
  - claude-code
  - tool-update
category: Agents
author: LockDraft
sourceLink: 'https://github.com/anthropics/claude-code/releases/tag/v2.1.319'
---

## What changed

Anthropic has released Claude Code version 2.1.319, introducing changes to asynchronous tool execution, gateway configuration, permission controls, and session diff rendering.

* **Background MCP Tasks**: Model Context Protocol (MCP) server tool calls running as tasks in the terminal now move to the background immediately, notifying Claude upon completion. Developers can set the `CLAUDE_CODE_DISABLE_MCP_TASK_BACKGROUND` environment variable to force Claude Code to block and wait inside the tool call. The release also fixes connection failures and empty responses for older MCP servers using legacy handshakes.
* **Auto Mode and Gateway Behavior**: When telemetry or feature flags are disabled behind an LLM gateway, uncheckable server calls are denied or prompted rather than falling back to the local classifier. Setting `CLAUDE_CODE_AUTO_MODE_SERVER=0` preserves local classifier fallback. Setting `CLAUDE_CODE_AUTO_MODE_SERVER=1` forces server-side auto mode checks even if `CLAUDE_CODE_DISABLE_EXPERIMENTAL_BETAS` is set. Amazon Bedrock, Google Cloud Vertex AI, and Palantir Foundry integration behavior remains unchanged.
* **Permission and Flag Controls**: A new `permissions.denyInsteadOfPrompting` setting automatically denies tool calls that would otherwise wait on user permission prompts, allowing terminal sessions, subagents, and teammates to continue without manual intervention. Developers can also set `CLAUDE_CODE_DISABLE_FEATURE_FLAGS` to block feature-flag fetching while maintaining telemetry.
* **Claude Apps Gateway Upgrades**: Gateway operators gain JSON-formatted operational logging (`CLAUDE_GATEWAY_LOG_FORMAT=json`), custom browser and login screen notices via `login_notice`, pooled budget prioritization (`admin.pooled_conflict_rule` and `admin.pooled_priority_order`), and spend metrics on `/usage` for uncapped users. Startup warnings now flag model ID conflicts across policies as well as configurations missing `desktopHome` ahead of Claude Desktop's November 10 update.
* **Developer Workflow and Performance Tools**: Added `/claude-api latency-optimize` to identify latency bottlenecks in API code and test settings against test evaluations. The `/tasks` view includes an "Earlier in this session" list for reopening finished subagents. Session authentication warnings now alert developers when `ant auth login` credentials bill usage directly to a Claude Console organization, and a fix resolves repeated 401 authorization refresh failures.
* **Bug Fixes**: Resolved an issue where `/diff` opened blank in sessions where 64 or more turns edited files. Fixed `/diff` and claude.ai diff viewing failures caused by a top-level repository file or directory named `HEAD`. Fixed slash commands executed with leading spaces, tabs, or newlines being passed as plain text.

## Why it matters

Moving long-running MCP tool executions to background tasks prevents terminal agent workflows from blocking prompt loops. For teams running custom enterprise gateways, structured JSON logs simplify integration with observability pipelines, building on previous enterprise governance updates in [Claude Code v2.1.295](/posts/anthropic-releases-claude-code-v21295-with-strict-hook-controls-gateway-filters-/) and self-hosted runner settings added in [Claude Code v2.1.311](/posts/anthropic-releases-claude-code-v21311-with-self-hosted-runner-flags-and-auto-com/).

The fix to `/diff` resolves UI failures during extended editing sessions with 64 or more file-modifying turns, ensuring developers can inspect changes across long-running autonomous workflows.

## What to do next

* **Update the CLI**: Install v2.1.319 using your package manager or CLI update path.
* **Adjust Auto Mode Gateway Settings**: If running Claude Code behind an LLM gateway with telemetry disabled, set `CLAUDE_CODE_AUTO_MODE_SERVER=0` if you require local classifier fallback.
* **Configure Unattended Execution**: Set `permissions.denyInsteadOfPrompting` in configurations where subagents or teammates should fail fast on prompt-bound tools rather than hang.
* **Enable JSON Logging**: Set `CLAUDE_GATEWAY_LOG_FORMAT=json` on Claude apps gateways to ingest operational log fields (`severity`, `time`, `message`) into central log aggregators.
* **Caveats**: In cloud sessions, timers started via `/loop` will stop if their container stops. Note that Amazon Bedrock, Vertex AI, and Foundry deployments do not require the `CLAUDE_CODE_AUTO_MODE_SERVER=0` workaround for auto mode behavior.

## Sources

* [Claude Code v2.1.319 Release Notes](https://github.com/anthropics/claude-code/releases/tag/v2.1.319)
