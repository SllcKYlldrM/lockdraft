---
title: >-
  n8n Adds Native Public API Rate Limits and Safe Retry Mechanics in Version
  2.47.0
published: 2026-11-14T01:07:43.249Z
draft: false
description: >-
  n8n 2.47.0 introduces API key rate limits, standard 429 retry headers, Redis
  sync for multi-main setups, and 12-hour idempotency protection.
tags:
  - n8n
  - API
  - automation
  - ai-news
  - tool-update
category: Automation
author: LockDraft
sourceLink: >-
  https://blog.n8n.io/new-in-n8n-public-api-rate-limits-that-keep-every-team-on-your-instance-running/
---

## What changed

n8n version 2.47.0 introduces native per-API-key rate limiting for its public API (`/api/v1`), covering self-hosted deployments and n8n Cloud across all plan levels. The feature allows administrators to define maximum traffic allowances for individual API keys, preventing runaway automation routines or single teams from starving instance resources.

Key features of the update include:

* **Granular Controls:** Administrators can configure distinct rate limits and window durations for read and write operations, both globally across all endpoints and on individual endpoints. Setting a specific limit value to `0` disables that metric.
* **Standardized 429 Headers:** When an API key breaches its threshold, n8n issues an HTTP `429 Too Many Requests` status code with `Retry-After`, `X-RateLimit-Remaining`, and `X-RateLimit-Reset` headers to inform clients when to retry and how much quota remains.
* **Multi-Main Synchronization:** In multi-main self-hosted setups, request counts per key are synced globally through Redis, enforcing identical limit thresholds across every main instance.
* **Idempotency Integration:** Paired with idempotency keys introduced in version 2.45.0, clients can safely resend `POST` requests using an `Idempotency-Key` header. Successful responses are saved for 12 hours and replayed on duplicate retries. If the initial request fails, n8n releases the key to allow a standard execution attempt.

Rate limiting is disabled by default and can be managed through three methods:
1. **UI Settings:** Go to `Settings > Policies > Public API Limits` and activate `Enable API key rate limits`. Configuration changes take effect immediately without requiring a system restart.
2. **REST API:** Fetch current configurations with `GET /api/v1/settings/rate-limits` and apply changes with `PUT /api/v1/settings/rate-limits` using an API key assigned the `securitySettings:manage` scope.
3. **Environment Variables:** Set `N8N_PUBLIC_API_RATE_LIMIT_ENABLED=true` and define thresholds using `N8N_PUBLIC_API_RATE_LIMIT_*` variables. Defining limits via environment variables locks the corresponding UI fields and requires an instance restart to update.

## Why it matters

When multiple teams or workflows rely on a single n8n instance, high-volume executions targeting the local `/api/v1` endpoint can create service bottlenecks. Because nodes run once per incoming item, a workflow processing a dataset of 1,000 items generates 1,000 concurrent API calls. When practitioners build complex workflows—such as those covered in our guide to [building your first n8n workflow](/posts/first-n8n-workflow/)—using the internal `n8n` or `HTTP Request` nodes, unthrottled traffic can easily overload the host.

In the past, teams had to maintain reverse proxies or external API gateway rate limiters in front of n8n to protect infrastructure. Built-in rate limiting handles traffic management directly, offering explicit client throttling headers while isolating high-volume API keys from affecting other workloads.

### Limitations and Caveats

* **Uniform Policy Enforcement:** Rate limit rules apply globally across all API keys generated on an instance. While each API key maintains an independent request count, you cannot assign unique threshold limits to individual keys. Providing a specific service with higher rate limits requires deploying it on a separate n8n instance.
* **Scope Restrictions:** Rate limits apply exclusively to requests made to `/api/v1` using an API key. Workflow executions originating directly from the internal n8n editor are exempt from these limits.

## What to do next

To configure public API rate limits on your deployment:

1. **Upgrade Instance:** Update your instance to n8n version 2.47.0 or higher.
2. **Enable Policies:** Adjust and activate rate limit thresholds via `Settings > Policies > Public API Limits`, the REST API, or environment variables.
3. **Configure Workflow Batching:** Review workflows using the `n8n` node or `HTTP Request` node to call local endpoints. Instead of relying on `Retry On Fail` (which pauses for a maximum of 5 seconds and may retry within the same active rate window), turn on **Batching** in the node options and define `Items per Batch` and `Batch Interval (ms)` to throttle request frequency.
4. **Update API Clients:** Update client applications to parse `X-RateLimit-Remaining` and `Retry-After` headers, apply jitter delays up to 5 seconds on retries, and send `Idempotency-Key` headers on `POST` requests to protect against duplicate executions.

## Sources

* [n8n Blog: New in n8n: Public API rate limits that keep every team on your instance running](https://blog.n8n.io/new-in-n8n-public-api-rate-limits-that-keep-every-team-on-your-instance-running/)
