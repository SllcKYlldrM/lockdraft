---
title: >-
  Anthropic Releases Claude Code v2.1.295 with Strict Hook Controls, Gateway
  Filters, and MCP Fixes
published: 2026-10-08T21:34:53.421Z
draft: false
description: >-
  Claude Code v2.1.295 adds strict hook failure options, enterprise gateway
  model routing, OSC 7501 terminal status, and MCP reconnection fixes.
tags:
  - AI Agents
  - Developer Tools
  - anthropic
  - ai-news
  - claude-code
  - tool-update
category: Agents
author: LockDraft
sourceLink: 'https://github.com/anthropics/claude-code/releases/tag/v2.1.295'
---

## What changed
Anthropic has released Claude Code v2.1.295, bringing stricter execution controls for automated hooks, expanded enterprise gateway settings, and critical bug fixes for Model Context Protocol (MCP) integrations.

Key additions and fixes in this release include:

- **Hook Failure Safeguards**: Command and HTTP hooks now support `onFailure: "block"`. If a configured hook fails to start, times out, or exits with an unexpected code, Claude Code explicitly halts the downstream action instead of letting it execute.
- **Gateway Upstream Model Routing and Timeouts**: Enterprise gateway upstream configurations now support an optional `models` array with wildcard (`*`) matching to restrict which models route to specific backends. Upstreams on Amazon Bedrock, Google Vertex AI, Palantir Foundry, and others can set `timeouts.upstream_ttfb_ms` to bound initial stream response times before triggering failover or returning a 502 status. Unmanaged environments can enforce custom gateway logins via `forceLoginMethod: "gateway"` and `forceLoginGatewayUrl` in user settings.
- **Audit Traceability**: Gateway `inference` audit events now output `upstream_request_id` (sourced from Bedrock, Anthropic, or other upstreams), and successful gateway responses append a matching `request-id` header to align local telemetry with backend logs.
- **Terminal and UI Enhancements**: Added support for the Program Status Protocol (OSC 7501) to signal terminal emulators whether Claude Code is active, waiting, or finished. Mods gain `$.ui.notify` for native system notifications and expanded `Button` support accepting nested strings and `Text` children.
- **Retry Watchdog Limits**: Introduced `CLAUDE_CODE_RETRY_WATCHDOG_MAX_WAIT_MS` to cap how long unattended watchdog retries wait during persistent 429 and 529 provider rate-limit errors.
- **Automatic 1M Context Fallback**: If a proxy, Bedrock, Vertex, or Foundry upstream rejects the `[1m]` extended context beta, Claude Code automatically resends the prompt without the beta header rather than throwing an error.
- **MCP and Agent Process Fixes**: Remote MCP connections in headless and SDK modes now use exponential backoff (up to 30 seconds) on repeated drops instead of thrashing reconnect loops. Fixed file extension classification so MCP tools returning CSS, JS, XML, fonts, or icons are no longer stored as `.bin` files. Addressed a timing bug in `CLAUDE_AUTO_BACKGROUND_TASKS` where subagents were moved to the background before queued edit or shell calls completed.

## Why it matters
Configuring automated agent actions requires deterministic safeguards. Prior to this update, a failed pre-execution validation hook could silently let commands run. Supporting `onFailure: "block"` closes this gap, continuing the trend of enterprise controls seen in earlier [plugin mods and protocol updates](/posts/claude-code-adds-deep-plugin-mods-command-safeguards-and-mcp-protocol-updates/).

For teams deploying Claude Code through private API gateways or multi-cloud infrastructure, fine-grained model routing arrays and explicit time-to-first-byte limits prevent hanging requests and model mismatches across Bedrock and Vertex backends. Syncing `upstream_request_id` across response headers and telemetry event streams also simplifies tracing failure modes in production. 

Finally, the MCP stability fixes resolve connection churn during temporary network outages, building on previous [session stability and telemetry improvements](/posts/claude-code-update-terminal-layout-controls-telemetry-diagnostics-and-session-st/).

## What to do next
1. **Update the CLI**: Install or update to `v2.1.295` through your preferred package manager.
2. **Enforce Hook Fail-Closed Rules**: Update command and HTTP hook definitions in your project configuration to include `onFailure: "block"` for security-critical steps.
3. **Configure Gateway Upstreams**: If running a custom proxy gateway, update your upstream definitions with specific `models` lists and define `timeouts.upstream_ttfb_ms` to manage backend failover behavior.
4. **Set Unattended Watchdog Limits**: Define `CLAUDE_CODE_RETRY_WATCHDOG_MAX_WAIT_MS` in headless CI/CD environments to prevent automated agent runs from blocking indefinitely during extended upstream outages.

### Limitations and Caveats
When Claude Code falls back after an upstream rejects the `[1m]` beta header, the request proceeds using standard context boundaries, which may truncate extremely long prompt contexts. Additionally, while `claude plugin validate` now prints missing installation lines for plugin READMEs, it explicitly maintains a zero exit code—even when executed with `--strict`—meaning it will not break CI validation pipelines automatically.

## Sources
- [Claude Code v2.1.295 Release Notes](https://github.com/anthropics/claude-code/releases/tag/v2.1.295)
