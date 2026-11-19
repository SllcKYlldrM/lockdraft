---
title: >-
  Anthropic Releases Claude Code v2.1.328 with Auto Mode for Opus/Sonnet 4.6 and
  MCP Hook Blocking
published: 2026-11-19T02:08:41.677Z
draft: false
description: >-
  Claude Code v2.1.328 brings auto mode for Opus 4.6 and Sonnet 4.6 to cloud
  platforms, adds blocking MCP hooks, and expands self-hosted metrics.
tags:
  - anthropic
  - AI Agents
  - Developer Tools
  - ai-news
  - claude-code
  - tool-update
category: Agents
author: LockDraft
sourceLink: 'https://github.com/anthropics/claude-code/releases/tag/v2.1.328'
---

## What changed

Anthropic released Claude Code v2.1.328, bringing model execution updates, stricter tool hook behavior, and infrastructure metrics for self-hosted runners.

Key additions and fixes in this release include:

* **Auto Mode on Cloud Gateways:** Added auto mode support for Claude Opus 4.6 and Sonnet 4.6 across Amazon Bedrock, Google Cloud Agent Platform, Microsoft Foundry, and the Claude apps gateway. Interactive sessions configured without an explicit permission mode now start in auto mode by default.
* **MCP Hook Controls:** Added the `"onFailure": "block"` parameter to `mcp_tool` hooks. Similar to existing command and HTTP hooks, any failing MCP hook execution now blocks the underlying action. This expands on the control policies updated in [Claude Code v2.1.295](/posts/anthropic-releases-claude-code-v21295-with-strict-hook-controls-gateway-filters-/).
* **Deferred Tool Execution Control:** Introduced `CLAUDE_CODE_DISABLE_DEFERRED_TOOL_RESUME`, an environment variable allowing host environments to prevent `claude -p --resume` and `--continue` commands from running tool calls deferred by a hook.
* **Self-Hosted Runner Updates:** Added `--repository-folder` to designate repository names under `--capacity 1` setups (resolving symbolic link path issues), added `--hook-label` for orchestrators to pass labels to `spawn-runner` hooks, and added `--metadata key=value` flags for session labeling under `claude --environment`.
* **Telemetry & Metrics:** Added two new metrics to the orchestrator's `/metrics` endpoint: `claude_code_self_hosted_orchestrator_session_queue_wait_by_reason_seconds` to differentiate queue waits between new and re-opened sessions, and `claude_code_self_hosted_orchestrator_sessions_given_up_total` to track failed runner startup attempts by root cause.
* **Command & Parsing Fixes:** Resolved a Zsh error where commands containing leading equal signs (such as `echo ====` or `[ a == b ]`) stopped execution due to path expansion. Fixed automatic context compaction so that it rebuilds system prompts dynamically rather than reusing stale prompts.
* **File Handling Fixes:** Resolved an issue where unreadable scheduled task files caused project task deletion upon saving. Fixed token counting errors on subagents and status spinners that previously double-counted retried responses or stalled during model reasoning.

## Why it matters

For enterprise teams using third-party cloud infrastructure like Amazon Bedrock, Google Cloud, or Azure/Foundry, auto mode parity ensures consistent autonomous execution without needing direct API connections to Anthropic.

The addition of blocking behavior for MCP tool hooks closes a reliability gap in agent workflows. Previously, an MCP hook failure might allow an agent to proceed unhindered; setting `"onFailure": "block"` forces execution pipelines to halt immediately when dependent tools fail.

Finally, the self-hosted runner metrics provide granular data for engineering teams managing agent clusters at scale. Tracking startup abandonments and queue wait reasons makes it easier to diagnose capacity bottlenecks under heavy multi-session workloads.

## What to do next

* Update local CLI installations to v2.1.328 via npm or your configured package distributor.
* Update `mcp_tool` configurations in `.claude/settings.json` to set `"onFailure": "block"` for critical tool dependencies.
* Scrape the new `claude_code_self_hosted_orchestrator_*` Prometheus metrics from self-hosted orchestrator instances to set up alerts for runner spin-up failures.
* If running self-hosted runners using symbolic links under `--capacity 1`, update runner deployment scripts to pass the `--repository-folder` flag.

### Limitations
When running sessions through third-party cloud providers, large tool outputs can still hit prompt length limits. In v2.1.328, Claude Code handles this by discarding the largest tool results rather than crashing the session, which prevents permanent session failure but may truncate context provided to the model.

## Sources
* [Claude Code v2.1.328 Release Notes](https://github.com/anthropics/claude-code/releases/tag/v2.1.328)
