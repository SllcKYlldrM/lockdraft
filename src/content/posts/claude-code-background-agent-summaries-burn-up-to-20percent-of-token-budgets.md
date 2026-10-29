---
title: Claude Code Background Agent Summaries Burn Up to 20% of Token Budgets
published: 2026-10-29T06:32:32.938Z
draft: false
description: >-
  Background status updates in Claude Code consume nearly a fifth of model
  usage. A Bun preload hook suppresses these requests to save rate limits.
tags:
  - anthropic
  - Developer Tools
  - ai-news
category: AI News
author: LockDraft
sourceLink: 'https://gist.github.com/flamerix-ai/c3905705cc4205e5de3011fa2e74efce'
---

## What changed

Developer Flamerix AI published a workaround (`no-agent-summary.js`) to disable non-essential background status requests in Claude Code. Enabled by default since version 2.1.232, Claude Code runs an automated summary process roughly every 30 seconds for each active background agent.

To update a 3-to-5 word status string in the CLI user interface, Claude Code re-sends each subagent's complete conversation transcript back to its model—frequently Claude Opus. These periodic status checks generate API calls without returning context or results to the main prompt loop.

## Why it matters

OpenTelemetry metrics exported from Claude Code runs show that requests tagged with `query_source = agent_summary` account for a major portion of overall usage:

- **Request Share**: Status summaries represented 19.7% of all Claude Code API requests—nearly one out of every five calls.
- **Cost Overhead**: Summary requests constituted 16.4% of total estimated USD spend in telemetry, consuming more resources than the main user conversation (15.7%).
- **Model Selection**: Approximately 96% of the token spend for these background updates was billed against Claude Opus.
- **Token Ratios**: The process generates an input-to-output token ratio of roughly 9,000 input tokens for every single output token generated.

Multiple community measurements report overall rate-limit and token overhead between 18% and 26%. On subscription tiers, this idle polling directly degrades available rate-limit capacity.

## What to do next

Because Claude Code ships as a precompiled Bun bytecode binary, editing source text directly or hooking `globalThis.fetch` does not intercept the timer. The solution uses Bun's runtime options to inspect function strings before timers schedule execution.

1. **Save the script**: Place `no-agent-summary.js` in a permanent local folder (e.g., `~/.local/share/no-agent-summary.js`).
2. **Set global Bun preloads**: Export `BUN_OPTIONS` in your shell configuration (`~/.bashrc`, `~/.zshrc`, or systemd environment definitions):
   ```bash
   export BUN_OPTIONS="${BUN_OPTIONS:+$BUN_OPTIONS }--preload /path/to/no-agent-summary.js"
   ```
3. **Restart running daemons**: Terminate all active processes and pre-warmed background sessions so they inherit the updated environment:
   ```bash
   claude daemon stop --any
   ```

The script wraps `setTimeout` and `setInterval`. It runs `Function.prototype.toString` on callback signatures to detect anchor strings like `[AgentSummary]`. When matched, it overrides the timer with an inert handle set to $2^{31}-1$ ms, preventing the API dispatch while allowing standard non-summary timers to pass through.

### Limitations and Caveats

Applying the patch stops real-time status updates in the background agents panel and clears `task_progress` summary fields in SDK outputs. Testing has been validated on Linux x64 across releases up through version 2.1.312. Windows and macOS are untested, with Windows likely incompatible due to Bun's `/$bunfs/` virtual file system paths. 

The mechanism fails open by design: if Anthropic renames string anchors or refactors how timers are wrapped in future updates, the script will silently pass timer callbacks through, restoring standard behavior until verified and updated.

## Sources

- [Flamerix AI Gist: no-agent-summary.js](https://gist.github.com/flamerix-ai/c3905705cc4205e5de3011fa2e74efce)
