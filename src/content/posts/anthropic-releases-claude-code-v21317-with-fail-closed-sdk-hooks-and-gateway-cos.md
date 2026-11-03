---
title: >-
  Anthropic Releases Claude Code v2.1.317 with Fail-Closed SDK Hooks and Gateway
  Cost Analytics
published: 2026-11-03T02:40:54.537Z
draft: false
description: >-
  Claude Code v2.1.317 adds fail-closed Agent SDK hooks, network email
  transmission prompts, gateway cost analytics APIs, and OpenTelemetry
  additions.
tags:
  - anthropic
  - Developer Tools
  - AI Agents
  - ai-news
  - claude-code
category: Agents
author: LockDraft
sourceLink: 'https://github.com/anthropics/claude-code/releases/tag/v2.1.317'
---

## What changed
Anthropic released Claude Code v2.1.317, introducing enhanced security prompts, fail-closed SDK execution controls, and expanded enterprise administrative tooling. Building on earlier security patches in [v2.1.309](/posts/anthropic-releases-claude-code-v21309-with-security-patches-skill-namespacing-an/), this update prioritizes user privacy and governance controls.

Key security and authorization changes include:
* **Fail-closed SDK callbacks**: The Agent SDK now accepts `onFailure: "block"` for hook callbacks. If a callback fails or throws an exception, the system blocks the corresponding action rather than allowing it to run.
* **Email transmission checks**: Claude Code now requires explicit permission before a web or shell tool call sends the account's email address over the network.
* **Cloud schedule warnings**: Executing `/schedule` now triggers a warning if a new cloud scheduled task receives unrequested connectors, along with instructions on how to remove them.
* **Managed settings notifications**: Claude Desktop's Code tab now displays explicit status notices when an organization's remote managed settings fail to load or finish synchronizing.

Administrative, observability, and workflow updates include:
* **Gateway cost analytics API**: The Claude apps gateway admin API includes a new endpoint, `GET /v1/organizations/analytics/cost`, allowing administrators to pull historical spend over date ranges summarized by total spend, individual developer, day, or Identity Provider (IdP) group.
* **IdP group tracking**: Gateways with `admin:` configured now store a daily record of each developer's IdP groups for the duration specified by `admin.identity_retention_days`.
* **Expanded OpenTelemetry spans**: Added `anthropic.plan`, `anthropic.seat_type`, `anthropic.provider`, and `anthropic.custom_base_url` to OTel metrics, spans, and events.
* **Self-hosted runner session flag**: Developers can set `CLAUDE_CODE_DISABLE_NESTED_SESSION_ID=1` on self-hosted runners so `claude -p` runs inside a session use that session's ID and transcript, expanding on environment controls added in [Claude Code v2.1.311](/posts/anthropic-releases-claude-code-v21311-with-self-hosted-runner-flags-and-auto-com/).
* **Strict failure exit codes**: If `claude -p` fails to write transcripts or updates to `~/.claude.json` due to quota or full disk limits, it now outputs an explicit error and exits with code `1` instead of `0`.

## Why it matters
Adding `onFailure: "block"` to the Agent SDK fixes a critical default in programmatic governance. Previously, if a custom security callback or policy filter crashed, the tool call could fail open. Developers can now mandate that failed inspection hooks strictly block tool execution.

The additions to telemetry and admin APIs give engineering leaders clearer visibility into LLM expenditure and infrastructure usage. Organizations running multi-tenant gateways or custom base URLs can track cost allocation directly back to IdP groups.

Furthermore, updating `claude -p` to exit with status code `1` on storage failure prevents automated CI/CD pipelines from passing silently when transcript logging or session state updates fail.

## What to do next
1. **Enforce Fail-Closed Callbacks**: Update Agent SDK hook definitions to include `onFailure: "block"` on sensitive tool calls.
2. **Query Gateway Analytics**: Configure `admin.identity_retention_days` on Claude apps gateways and integrate `GET /v1/organizations/analytics/cost` into internal monitoring dashboards.
3. **Configure CI Runners**: If your automated workflows call nested `claude -p` commands and require unified transcript tracking, set `CLAUDE_CODE_DISABLE_NESTED_SESSION_ID=1` in your runner environment.
4. **Audit Scheduled Tasks**: Use `/schedule` to inspect active cloud tasks and strip out any unrequested connectors.

### Limitations and Caveats
While non-zero exit codes now trigger on local disk write failures during `claude -p` runs, Anthropic notes that storage errors occurring on full NFS exports may still be missed.

## Sources
* [Claude Code v2.1.317 Release Notes](https://github.com/anthropics/claude-code/releases/tag/v2.1.317)
