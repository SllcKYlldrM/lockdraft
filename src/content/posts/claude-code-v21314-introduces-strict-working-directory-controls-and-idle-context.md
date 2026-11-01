---
title: >-
  Claude Code v2.1.314 Introduces Strict Working Directory Controls and Idle
  Context Compaction
published: 2026-11-01T06:54:33.001Z
draft: false
description: >-
  Claude Code v2.1.314 adds strict directory write blocks, idle context
  compaction for 200K+ token sessions, and Bedrock and Foundry resilience fixes.
tags:
  - anthropic
  - AI Agents
  - Developer Tools
  - ai-news
  - claude-code
  - tool-update
category: Agents
author: LockDraft
sourceLink: 'https://github.com/anthropics/claude-code/releases/tag/v2.1.314'
---

## What changed

Anthropic has released Claude Code v2.1.314, introducing tighter directory write boundaries, background conversation compaction for long sessions, and refined gateway routing for enterprise identity providers. Building on recent releases like [v2.1.311](/posts/anthropic-releases-claude-code-v21311-with-self-hosted-runner-flags-and-auto-com/), this update addresses key operational edge cases across CLI pipelines, IDE extensions, and cloud platforms.

Key updates include:

- **Directory Isolation**: Added `permissions.blockWritesOutsideWorkingDirectories`, forcing `Write`, `Edit`, and `NotebookEdit` actions to refuse paths outside designated working directories across all permission modes.
- **Idle Context Compaction**: In VS Code and Claude Desktop's Code tab, idle conversations over 200,000 tokens are summarized automatically. The generated summary is loaded on the next user prompt if the prompt cache has expired.
- **Gateway and Identity Controls**: Claude apps gateway upstreams now support an optional `groups` list to direct traffic based on identity provider (IdP) groups, including during failovers. Amazon Bedrock upstreams gain a `guardrail_trace` flag to log triggered guardrail filter types without logging matched text.
- **Provider and Model Resilience**: Microsoft Foundry sessions missing default Sonnet, Opus, or Haiku deployments now automatically fall back to older model generations in the same family. Amazon Bedrock sessions with high image counts now drop older images and run compaction instead of failing with a `400 Input is too long` error.
- **Automated Pipeline Fixes**: The `claude -p` command now prints error details and exits with code `1` on startup failure rather than exiting silently with `0`. In CI environments with `CI` set, `claude ultrareview` and `claude remote-control` reject untrusted folders immediately instead of pausing for terminal prompts.
- **System and Lock Stability**: Output from `PreCompact` hooks is now truncated at 10,000 characters to prevent compaction loops. Background diff refreshes no longer lock `.git/index.lock`, eliminating intermittent failures with concurrent Git commands.

## Why it matters

For automation engineers running agents in CI/CD pipelines, silent exit failures conceal broken builds. Making `claude -p` exit with code `1` ensures pipeline orchestrators properly detect and report execution failures. Similarly, forcing immediate failure on untrusted folders in CI runs prevents headless processes from hanging indefinitely on interactive prompt requests.

The addition of `permissions.blockWritesOutsideWorkingDirectories` provides strict execution boundaries, ensuring AI tools cannot modify critical configuration files outside the project root even if tool calls are improperly scoped. This complements previous enterprise security updates like gateway controls in [v2.1.295](/posts/anthropic-releases-claude-code-v21295-with-strict-hook-controls-gateway-filters-/).

Additionally, handling model effort caps gracefully—by lowering requested effort levels and retrying rather than failing repeatedly with an "Invalid effort level" error—prevents service interruptions when organization administrators enforce centralized usage policies.

## What to do next

- **Enforce Boundary Security**: Enable `permissions.blockWritesOutsideWorkingDirectories` in project or enterprise settings to prevent unintended file edits outside active workspace paths.
- **Review CI Pipeline Logic**: Audit build scripts using `claude -p` to handle non-zero exit codes properly on startup errors.
- **Configure IdP Groups on Gateways**: Update central Claude apps gateway upstream configurations with the new `groups` key to scope upstream deployment access to specific user groups.
- **Check PreCompact Output**: Verify that custom `PreCompact` scripts do not depend on stdout streams exceeding 10,000 characters.

## Limitations

Idle compaction only applies to sessions exceeding 200,000 tokens left inactive in VS Code or Claude Desktop, and its performance benefit depends on whether the prompt cache has expired prior to the subsequent message. Additionally, while `guardrail_trace` identifies which Amazon Bedrock filter was triggered, it explicitly excludes the matched prompt text from logs, requiring secondary monitoring tools if full content inspection is required.

## Sources

- [Claude Code v2.1.314 Release Notes](https://github.com/anthropics/claude-code/releases/tag/v2.1.314)
