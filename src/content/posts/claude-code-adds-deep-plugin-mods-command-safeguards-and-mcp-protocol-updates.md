---
title: >-
  Claude Code Adds Deep Plugin Mods, Command Safeguards, and MCP Protocol
  Updates
published: 2026-10-02T06:22:44.757Z
draft: false
description: >-
  Anthropic updates Claude Code with extensible Mods, dangerous command
  safeguards, Sonnet 5.5 advisor pairing, and MCP protocol updates.
tags:
  - AI Agents
  - Developer Tools
  - anthropic
  - ai-news
  - claude-code
  - tool-update
category: Agents
author: LockDraft
sourceLink: 'https://github.com/anthropics/claude-code/releases/tag/v2.1.287'
---

## What changed

Anthropic has released an update to Claude Code, introducing a deep customization framework called Claude Mods alongside critical safety fixes and protocol updates. Building on capabilities detailed in previous releases such as [Claude Code v2.1.280](/posts/claude-code-v21280-introduces-opus-55-tightens-auto-mode-and-fixes-agent-caching/), this release focuses on agentic oversight, permission enforcement, and environment stability.

* **Claude Mods and Oversight Agent:** The platform now supports Claude Mods, allowing plugins to alter deeper execution behaviors. It includes a built-in mod called "You should know" (`cc-plugin-you-should-know@builtin`), which runs a secondary agent in the background to flag oversight errors or missed details during execution. Users can activate it via `/plugin enable cc-plugin-you-should-know@builtin` in first-party sessions with telemetry enabled.
* **Command Execution Security Fixes:** Patched a safety bypass where high-risk commands like `rm` targeting the root directory (`/`) or home directory (`~`) lost their mandatory confirmation prompts if the output was redirected to wildcards or home directory paths. Additionally, fixed a permission restriction bug where MCP tools named `__proto__` bypassed organization-level permission ceilings.
* **Model and Advisor Pairing:** Updated the `/advisor` feature so Sonnet 5.5 can now serve as an advisor to Opus 4.7 and Opus 4.8. The system now flags incompatible advisor models up front instead of dropping them silently. Switching between Opus 5.5 and Sonnet 5.5 using `/model` or `opusplan` no longer wipes earlier MCP tool announcements or drops extended thinking context.
* **MCP Protocols and Integrations:** Added support for URL prompts originating from Model Context Protocol (MCP) servers on the 2025-11-25 protocol specification, enabling browser-based flows such as authentication. A built-in `gh api` REST tool was also introduced for self-hosted runners on macOS and Linux operating on Anthropic-managed git environments without the GitHub CLI.
* **Telemetry and Navigation:** The OpenTelemetry `user_prompt` event now includes a `prompt_text` field to accommodate backend telemetry systems that process nested key paths. In the UI, an `n:<text>` filter was added to the agents view to search session names and tasks, expanding matches within collapsed sections and opening the top result upon hitting Enter.

## Why it matters

The introduction of Claude Mods creates a structured path for deep plugin execution, allowing teams to build real-time monitoring tools directly into the agent workflow. The "You should know" side agent adds automated sanity checks while tasks run, reducing manual code auditing.

Fixing the command-line parsing edge case for redirected `rm` commands closes a risk vector where automated agents could inadvertently wipe system files without prompt confirmation. Similarly, plugging the `__proto__` permission ceiling bypass prevents custom tools from accidentally overriding organizational guardrails.

For multi-model workflows, ensuring that model transitions retain thinking history and that Sonnet 5.5 can advise older Opus versions stabilizes long-running reasoning sessions across mixed model deployments.

## What to do next

* **Activate the Monitoring Mod:** To test the background oversight agent, run `/plugin enable cc-plugin-you-should-know@builtin` inside a telemetry-enabled first-party session.
* **Update MCP Configs:** If an existing MCP server fails to connect following this update, add `"bareElicitationCapability": true` to its entry in your MCP configuration file.
* **Audit Telemetry Filters:** If your organization captures OpenTelemetry logs and redacts or masks the `prompt` field, update your processing pipelines to drop or mask the newly introduced `prompt_text` field as well.
* **Windows Shell Configuration:** Windows users should note that denying permission to the Bash tool now triggers a startup warning if PowerShell is also disabled, preventing situations where Claude Code is left without an available shell tool.

### Limitations

The built-in "You should know" mod is limited to first-party sessions running with telemetry active. The new built-in `gh api` capability on self-hosted runners supports REST endpoints only and requires Anthropic-managed git setups.

## Sources

* [Claude Code Release Notes](https://github.com/anthropics/claude-code/releases/tag/v2.1.287)
