---
title: >-
  Claude Code v2.1.304 Adds Managed Agent Security Audits and Refines Mod
  Controls
published: 2026-10-20T05:25:15.241Z
draft: false
description: >-
  Anthropic releases Claude Code v2.1.304 with managed agent security checks,
  mod controls, auto-mode expansions, and key bug fixes.
tags:
  - AI
  - Developer Tools
  - anthropic
  - automation
  - ai-news
  - claude-code
category: Agents
author: LockDraft
sourceLink: 'https://github.com/anthropics/claude-code/releases/tag/v2.1.304'
---

## What changed

Anthropic has released Claude Code v2.1.304, introducing new mod control flags, configuration commands, platform expansions, and bug fixes across CLI and cloud execution environments.

### Extension and plugin governance
- **Strict human permission enforcement**: Plugin mods can now return `decider: "person"` in a `tool.check` response. This restricts approvals strictly to interactive prompt dialogs or host callbacks, automatically refusing the action with the mod's specified reason if no human is available to decide.
- **Read-only state detection**: Mod developers can check `e.isReadOnly` on `tool.check` events to determine if an incoming tool call is read-only.
- **Hook execution transparency**: Transcripts now record an explicit line whenever an earlier plugin skips a mod's hook, identifying both the plugin name and the skipped event.
- **Audit utilities**: Introduced `/claude-api managed-agents-secure`, a diagnostic command that benchmarks a Managed Agent's settings against Anthropic's published security guide without modifying existing settings.

### Environment and auto-mode updates
- **Expanded auto-mode availability**: The `/auto-mode-setup` command—which analyzes project context and recent sessions to train auto mode on local environments—is now supported on Amazon Bedrock, Google Cloud Vertex AI, Palantir Foundry, Claude apps gateways, and telemetry-disabled environments.
- **Context and usage warnings**: Pro and Max plan users now receive a warning when resuming an inactive conversation that would consume a substantial portion of their 5-hour usage cap, prompting them to either resume or start a fresh session that references the previous history.
- **Transcript compaction visibility**: Summary views (accessible via `Ctrl+O`) now list the names of tools called earlier in the session alongside the compacted summary.

### Critical fixes
- **Command execution and safeguards**: Extended filesystem deletion warnings (`rm -r`) to root-level mount locations such as `/Volumes`, `/media`, and WSL's `/mnt/c`. Fixed Linux sandbox crashes caused by non-character-class brackets in `sandbox.filesystem.denyRead` path globs (e.g., `[user-id]` route directories).
- **Unattended and cloud executions**: Fixed an issue where scheduled Cowork cloud sessions suffered 5-minute timeouts per subagent when `WebFetch` calls requested URL approvals without a human operator. Fixed a bug where headless sessions continued running past `--max-turns` or manual stop signals due to spawned subagents.
- **Integration and gateway fixes**: Removed unsupported `context_management: Extra inputs are not permitted` fields when communicating behind custom LLM gateways. Resolved thread blocking where model switches and message inputs queued behind background context checks in SDK and desktop environments.

These updates expand on previous control mechanism improvements seen in [Claude Code v2.1.295](/posts/anthropic-releases-claude-code-v21295-with-strict-hook-controls-gateway-filters-/) and earlier [plugin mod system enhancements](/posts/claude-code-adds-deep-plugin-mods-command-safeguards-and-mcp-protocol-updates/).

## Why it matters

For teams deploying autonomous subagents or scheduled cloud workflows, the fix to unattended `WebFetch` approvals eliminates compound 5-minute delays during automated runs. Similarly, the addition of `decider: "person"` allows extension developers to prevent background subagents from executing sensitive actions when a human reviewer is absent.

In enterprise setups using custom LLM proxy servers or alternative cloud infrastructure (Bedrock, Vertex, Foundry), payload handling fixes and broader command availability ensure that auto-mode setups and telemetry options operate consistently without gateway errors.

## What to do next

1. **Update the CLI**: Upgrade to version 2.1.304 via your package manager or installation script.
2. **Audit Managed Agents**: If running Managed Agents, execute `/claude-api managed-agents-secure` in your terminal to review your current posture against Anthropic's security recommendations.
3. **Configure Mod Rules**: Update custom mod code to leverage `decider: "person"` for sensitive destructive operations where human confirmation must be strictly required.
4. **Run Auto Mode Setup**: Developers using Bedrock, Vertex, or enterprise gateways can now run `/auto-mode-setup` to index local repository patterns for automated turns.

## Caveats

- The `/claude-api managed-agents-secure` command is strictly an audit tool; it reports configuration gaps relative to Anthropic's recommendations but does not alter or remediate settings automatically.
- When resuming large, inactive conversations on Pro or Max plans, pay close attention to the new usage warning, as re-loading extensive context windows can draw down a significant fraction of the 5-hour usage allocation.

## Sources

- [Claude Code v2.1.304 Release Notes](https://github.com/anthropics/claude-code/releases/tag/v2.1.304)
