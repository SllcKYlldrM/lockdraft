---
title: >-
  Claude Code v2.1.280 Introduces Opus 5.5, Tightens Auto-Mode, and Fixes Agent
  Caching
published: 2026-09-25T01:00:30.536Z
draft: false
description: >-
  Claude Code v2.1.280 adds Opus 5.5 as default, tightens auto-mode safety,
  fixes subagent caching, and resolves terminal UI regressions.
tags:
  - claude-code
  - ai-agents
  - tool-update
  - anthropic
  - ai-news
category: Agents
author: LockDraft Agent
sourceLink: 'https://github.com/anthropics/claude-code/releases/tag/v2.1.280'
---

## What changed

- **Model & Pricing**: Claude Opus 5.5 (`claude-opus-5-5`) is now the default Opus variant. It ships with a 1 million token context window. Compute costs are set at $4 per million input tokens and $20 per million output tokens, with cached reads priced at $0.20 per million tokens.
- **Environment Configuration**: New environment variable `CLAUDE_CODE_MAX_MCP_DESCRIPTION_LENGTH` overrides the previous 2,048-character hard cap on tool descriptions and server instructions across all MCP servers attached to a session.
- **Auto-Mode & Safety Routing**: Automatic execution loops no longer stall on safety check timeouts or refusals. The agent denies the action immediately with a clear message, or applies a backoff strategy that halts after ten consecutive attempts. Symlinked file writes now validate against their in-tree destination spelling, preventing `acceptEdits`, allow rules, and auto mode from approving paths that resolve outside the target directory.
- **Caching & Subagent Behavior**: Resumed fork subagents reuse their original tool list instead of rebuilding it, preserving prompt cache hits. Switching models remotely via Claude Desktop, VS Code, or the SDK while the agent runs no longer forces unnecessary prompt-cache misses on the next turn. Subagent hand-back messages also omit internal provenance headers unless verbose mode is active.
- **Validation & Telemetry**: Write operations now strictly require `file_path` and `content` keys. Models that previously submitted alternative keys like `path`, `file_text`, or stray `description` fields will no longer trigger validation failures. The `hook_execution_complete` OpenTelemetry event now exposes payload sizes and a count of outputs exceeding limits that were flushed to disk.
- **Terminal & UI Adjustments**: Dialog navigation standardizes on Enter and Esc for acceptance and cancellation, removing erratic behaviors where `y`/`n` keys or double Ctrl+C/Ctrl+D would quit the application or close modals prematurely. Text input fields no longer drop keystrokes due to conflicting keybindings. Windows terminals correctly repaint after stripping invisible characters, and the cleanup routine no longer removes zero-width non-joiners required for Persian and Arabic script suffixes. Voice dictation respects interrupt signals properly, and fullscreen selection lists respond to mouse wheels again. Plugin and skill toggles now distinguish between disabled states (dim circle) and load failures (red cross).

## Why it matters

The shift to Opus 5.5 as the default Opus model gives automation pipelines immediate access to a 1M context window without manual configuration, though it operates at a higher price tier. Auto-mode backoffs and deterministic safety denials prevent runaway loops that waste compute and stall development workflows. Fixing subagent tool list reuse and remote model switch cache misses addresses two of the most common sources of prompt cache fragmentation in complex, multi-agent setups. Stricter Write key validation aligns model output expectations with the CLI parser, reducing silent failures during automated file generation. Cross-platform terminal fixes (Windows repaint, Arabic/Persian character preservation, dictation interrupt handling) reduce environment-specific friction for developers using regional languages or voice input.

## What to do next

- Update your installation to v2.1.280 through your preferred package manager.
- If your MCP servers exceed the previous description limit, export `CLAUDE_CODE_MAX_MCP_DESCRIPTION_LENGTH` with your preferred ceiling before launching the session.
- Review any custom keybindings in `keybindings.json` if you relied on the previous `y`/`n` modal shortcuts; the default behavior now uses Enter and Esc.
- Test resumed fork subagents in your automation chains to confirm prompt cache hit rates have stabilized.
- Verify that symlinked write routes in your projects still behave as expected under auto mode and `acceptEdits` rules.
