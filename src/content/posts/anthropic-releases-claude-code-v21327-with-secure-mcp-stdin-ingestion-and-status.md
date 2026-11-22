---
title: >-
  Anthropic Releases Claude Code v2.1.327 with Secure MCP Stdin Ingestion and
  Status Diagnostics
published: 2026-11-22T07:34:31.076Z
draft: false
description: >-
  Claude Code v2.1.327 adds stdin parsing for MCP server credentials, GitHub App
  install confirmations, and fixes for workspace file deletion.
tags:
  - AI Agents
  - Developer Tools
  - anthropic
  - MCP
  - ai-news
  - claude-code
category: Agents
author: LockDraft
sourceLink: 'https://github.com/anthropics/claude-code/releases/tag/v2.1.327'
---

## What changed

Anthropic has released Claude Code v2.1.327, introducing security controls for configuration files, expanded diagnostic reporting, and bug fixes across workspace and remote session management.

Key updates in this release include:

* **Credential Protection for MCP Configuration:** Added `claude mcp add-json <name> -` to ingest MCP server JSON configurations directly from stdin. This allows developers to pass API tokens without leaving plaintext secrets in command-line shell histories. This command must be executed from an external terminal and is unavailable inside an active Claude Code interactive session.
* **Confirmation Prompts and Safeguards:** The `/install-github-app` command now prompts for confirmation before introducing modifications to a repository. Additionally, the `/export` command now asks before overwriting existing files, while `/export <name>` preserves existing targets and provides execution instructions.
* **Enhanced Status and Configuration Visibility:** The `/status` view now explicitly enumerates broken agent, skill, command, and output style files, keybinding errors, sandbox unavailability, ignored permission settings, and hook matchers that fail to match. The `/config` menu displays inline notes when upper-level configuration rows override specific settings.
* **Gateway and Enterprise Attribution:** Managed settings now append an `x-claude-code-managed-settings-checksum` header to gateway hints when `CLAUDE_CODE_GATEWAY_HINT_HEADERS=1` is set. Sessions can also map to administrative billing groups via the `attributionProject` configuration setting when using Claude apps gateways configured with `admin.billing_group_tag`.
* **Workspace and Execution Fixes:** Stopping a Remote Control server in worktree mode no longer deletes git-ignored files such as `.env`. Self-hosted runners initialized with `--use-anthropic-git-proxy` will no longer delete non-empty global Git configuration directories targeted by `GIT_CONFIG_GLOBAL`. Editing `.mcp.json` via `claude mcp add` or `claude mcp remove` at project scope no longer strips unrelated top-level keys like `$schema` or third-party `servers` entries.
* **TUI and Execution Controls:** Introduced `/tui classic` as the explicit command for the non-fullscreen terminal UI renderer (with `/tui default` remaining supported). Fixed auto-mode execution issues involving PowerShell wildcard script paths such as `PowerShell(.\scripts\build.ps1 *)`.

## Why it matters

Command-line telemetry and shell histories often accidentally capture sensitive API tokens during MCP setup. Providing a stdin ingestion flag (`-`) resolves a common credential leak vector when setting up custom model context protocol servers.

File destruction bugs—such as wiping `.env` files upon stopping remote worktree instances or clearing project-level `$schema` definitions when mutating `.mcp.json`—pose real operational friction for automation practitioners. Resolving these directory cleanup behaviors prevents accidental code and environment loss. These stability improvements build upon previous infrastructure hardening seen in [Claude Code v2.1.295](/posts/anthropic-releases-claude-code-v21295-with-strict-hook-controls-gateway-filters-/) and sandbox fixes in [Claude Code v2.1.309](/posts/anthropic-releases-claude-code-v21309-with-security-patches-skill-namespacing-an/).

Furthermore, adding granular diagnostics to `/status` helps teams debug unparseable agent configurations or silent permission mismatches directly within the CLI workflow.

## What to do next

* **Update Claude Code:** Install version 2.1.327 through your package manager or CLI update path.
* **Pipe Sensitive MCP Credentials:** Update deployment scripts to use `cat secret.json | claude mcp add-json <name> -` instead of passing plaintext strings in terminal commands.
* **Audit Tool Mismatches:** Run `/status` inside existing projects to inspect for unlinked hook matchers, broken keybindings, or unparsed custom agent definitions.

## Caveats and limitations

* The new `claude mcp add-json <name> -` syntax cannot be called inside an active, interactive Claude Code session; it must be executed directly from your host shell.
* Organizations enforcing scope boundaries via `forceLoginOrgUUID` on nested `claude` instances using independent tokens should note that commands no longer automatically inherit `CLAUDE_CODE_OAUTH_SCOPES` and must set them explicitly if required.

## Sources

* [Claude Code v2.1.327 Release Notes](https://github.com/anthropics/claude-code/releases/tag/v2.1.327)
