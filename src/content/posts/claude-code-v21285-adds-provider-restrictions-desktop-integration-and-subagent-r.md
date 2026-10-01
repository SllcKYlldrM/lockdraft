---
title: >-
  Claude Code v2.1.285 Adds Provider Restrictions, Desktop Integration, and
  Subagent Reliability Fixes
published: 2026-10-01T00:15:05.592Z
draft: false
description: >-
  v2.1.285 introduces provider restrictions, desktop CLI flags, and resolves
  subagent permission and remote session bugs.
tags:
  - claude-code
  - ai-agents
  - ai-news
  - tool-update
category: Agents
author: LockDraft
sourceLink: 'https://github.com/anthropics/claude-code/releases/tag/v2.1.285'
---

## What changed

Anthropic released Claude Code v2.1.285, focusing on stricter environment controls, smoother desktop workflows, and deeper fixes for background subagents and remote sessions.

New capabilities include `CLAUDE_CODE_DISABLE_WEB_FETCH` to completely block the WebFetch tool, and `CLAUDE_CODE_NONSTREAMING_TIMEOUT_RETRIES` to cap automatic re-sends when a non-streaming fallback times out. A new `claude --desktop` command launches the desktop application targeting the current working directory or resumes an existing session using `--continue` or `--resume <id>`. Plugin management received two upgrades: `claude plugin configure <plugin>` now displays missing options and accepts values via `--values-stdin`, while `claude plugin install --config` supports `<server>.<key>=<value>` syntax to pre-configure bundled `.mcpb` MCP servers without navigating the interactive menu. Additionally, the `allowedProviders` managed setting lets administrators restrict which endpoints a machine can target, including Anthropic, Bedrock, Vertex AI, Foundry, Mantle, custom endpoints, and AWS gateways.

The release also patches several stability and correctness issues. Background subagents created with `CLAUDE_CODE_FORK_SUBAGENT=1` now properly inherit their parent's permission modes and run agent calls in the foreground. Plugin installations over SSH correctly respect `GIT_SSH` and `core.sshCommand`, and the installer refuses packages that differ only by punctuation or casing to prevent cache collisions. Remote Control gained retry logic for failed file attachments, corrected message read-state tracking, and ensures queued messages survive terminal closures. Other fixes address redacted log leaks, sandbox auto-approval false positives on inline scripts, mid-session MCP server cleanup, and a corrected help string for `claude remote-control --help` that previously misstated the default behavior for the `--[no-]chrome` flag.

## Why it matters

These changes shift Claude Code toward more predictable enterprise and automated workflows. Restricting API providers and disabling web fetching reduces blast radius in restricted networks. The desktop CLI flag and improved session resumption make local-to-desktop handoffs seamless. Subagent reliability improvements—especially around permission inheritance and foreground execution—prevent silent failures in complex orchestration chains. Finally, tightening plugin installation validation and fixing Remote Control state tracking reduces friction for teams managing shared environments or headless CI/CD pipelines.

## What to do next

Update your CLI to v2.1.285 and audit any `allowedProviders` configurations if you manage multi-account deployments. Test `CLAUDE_CODE_DISABLE_WEB_FETCH` in isolated environments before applying it to production automation runners. If you rely on background subagents, verify that `CLAUDE_CODE_FORK_SUBAGENT=1` now returns expected results without manual intervention. For plugin-heavy setups, use the new `--config` syntax to bake MCP server credentials into installation scripts, eliminating manual configuration steps. Note that recent releases have continued refining auto-mode and agent caching behaviors, so reviewing [Claude Code v2.1.280 Introduces Opus 5.5, Tightens Auto-Mode, and Fixes Agent Caching](/posts/claude-code-v21280-introduces-opus-55-tightens-auto-mode-and-fixes-agent-caching/) may provide useful context for ongoing pipeline adjustments.

Caveats: Sessions will still halt if they encounter unparseable managed settings files or general read failures; only OS-level denials are bypassed with a warning. Cloud sessions and `/remote-env` reads remain capped at retrieving only the twenty most recent environments per account. Non-streaming timeout retries are strictly limited by the new environment variable, which may slow recovery during prolonged network instability.

Sources:
- [Claude Code v2.1.285 Release Notes](https://github.com/anthropics/claude-code/releases/tag/v2.1.285)

## Sources

- [Official source](https://github.com/anthropics/claude-code/releases/tag/v2.1.285)
