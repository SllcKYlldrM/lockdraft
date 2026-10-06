---
title: >-
  Claude Code v2.1.290 Simplifies Managed Agent Onboarding and Upgrades Plugin
  Hooks
published: 2026-10-06T01:33:10.686Z
draft: false
description: >-
  Claude Code v2.1.290 introduces managed agent onboarding, enhanced plugin
  permission controls, and critical fixes for long sessions and WebFetch.
tags:
  - claude-code
  - ai-agents
  - anthropic
  - developer-tools
  - ai-news
  - tool-update
category: Agents
author: LockDraft
sourceLink: 'https://github.com/anthropics/claude-code/releases/tag/v2.1.290'
---

## What changed

Anthropic has released Claude Code v2.1.290, introducing new onboarding workflows for managed agents, tighter plugin integration hooks, and a suite of bug fixes targeting long-running sessions and workspace security.

### Managed Agent Onboarding and CLI Usability
This release introduces command-line support for setting up the Managed Agents pattern. Developers can now run `/claude-api managed-agents-onboard <url>` to configure files via `ant apply`, or deploy Console quickstarts (such as `deep-researcher`) with the `ant` CLI using `/claude-api managed-agents-onboard <quickstart-name>`. 

Additionally, session management is more flexible: the commands `claude attach <name>` and `claude logs <name>` now accept a partial session name instead of requiring the full session ID. A new "Deny" button has also been added to the Claude apps gateway sign-in page to instantly terminate pending terminal sign-in requests.

### Enhanced Plugin and Mod Hooks
Building on earlier plugin capability expansions, v2.1.290 refines how custom mods interact with the tool execution lifecycle:
* **Tool Tracking:** The result of a mod's `turn.step` hook now includes `serverToolUses`, detailing the specific tool calls executed by the advisor (including ID, name, input, start, and end parameters).
* **Subagent Permissions:** The `tool.check` plugin hook event now receives an `agentId`, allowing mods to differentiate permission checks originating from a subagent versus the main session.
* **Enterprise Guardrails:** The `tool.check` hook can now read a `ceiling` property, which specifies the explicit approval level an organization requires for a given tool.
* **Theme Typings:** The plugin hook typings now feature `ThemeKey` and `Color` types, enabling editors to resolve theme colors for mod drawings.
* **Validation:** The `claude plugin validate` command now outputs whether registered gating hooks include a `.catch` block, visible under the `gatingHooks` field when using the `--json` flag.

### Reliability and Security Fixes
Version 2.1.290 resolves several stability regressions, particularly in large codebases and multi-turn conversations:
* **Long Session Failures:** Fixed an issue where long sessions containing hundreds of images became unprocessable by the model. 
* **Content Filter Retries:** If an output content filter stops Claude mid-thought, the system now retries the request once rather than immediately failing the turn.
* **Prompt Caching:** Resumed subagents and teammates no longer lose their prior thinking state or prompt cache when a message is received mid-run.
* **WebFetch Limits:** The `WebFetch` tool no longer silently truncates web pages past 100,000 characters. It now alerts the user to the unread volume and accepts an `offset` parameter to continue reading.
* **Workspace Isolation:** Fixed a security bypass where symlinked project configuration files (like `CLAUDE.md`, `AGENTS.md`, or custom rules) pointing outside the working directories could load despite `permissions.blockReadsOutsideWorkingDirectories` or active `Read` deny rules.
* **Plan Mode Guardrails:** Plan mode will no longer allow the auto-mode classifier to approve non-read-only connector tools that carry a server-pushed ask policy.

---

## Why it matters

These updates address critical pain points for developers integrating Claude Code into production environments and enterprise codebases. 

By adding `agentId` and `ceiling` properties to plugin hooks, Anthropic is giving teams finer control over how subagents request permissions. This complements the security frameworks established in [prior Claude Code updates](/posts/claude-code-adds-deep-plugin-mods-command-safeguards-and-mcp-protocol-updates/), making it easier to enforce organizational guardrails without blocking developer velocity.

Furthermore, fixes to prompt caching and the `WebFetch` tool directly improve the economics and reliability of running deep-research tasks. Retaining cache state during mid-run interruptions prevents costly cache misses, while the `WebFetch` offset parameter prevents silent data loss during large documentation scrapes.

---

## What to do next

To update to the latest version of Claude Code, run your package manager's update command for the global `@anthropic-ai/claude-code` package.

If you are building custom tooling or platform integrations, review your mod implementations to take advantage of the new `ThemeKey` and `Color` typings, and run `claude plugin validate --json` to verify that your gating hooks are properly configured with `.catch` blocks to prevent unhandled promise rejections.

---

## Sources

* [Claude Code v2.1.290 Release Notes](https://github.com/anthropics/claude-code/releases/tag/v2.1.290)
