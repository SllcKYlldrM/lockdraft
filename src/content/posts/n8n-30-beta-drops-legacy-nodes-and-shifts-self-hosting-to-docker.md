---
title: n8n 3.0 Beta Drops Legacy Nodes and Shifts Self-Hosting to Docker
published: 2026-10-31T06:22:24.645Z
draft: false
description: >-
  n8n 3.0 beta introduces container-only self-hosting, stricter execution
  limits, security defaults, and deprecates legacy nodes.
tags:
  - n8n
  - Workflow Automation
  - ai-news
  - tool-update
category: Automation
author: LockDraft
sourceLink: 'https://blog.n8n.io/introducing-n8n-v3/'
---

## What changed

n8n has released the beta for version 3.0.0, prioritizing platform security, engine reliability, and code cleanup. The stable release is scheduled to follow in early December 2026.

Key technical changes in n8n 3.0 include:

* **Container-Mandated Self-Hosting:** Direct installation via `npm` or `npx n8n` has been removed. Self-hosted deployments now require Docker, supported by a one-line setup script for fast environments. Kubernetes and Helm deployments remain unaffected.
* **Execution Guardrails:** Manual workflow executions in Queue mode now run strictly on worker processes rather than the main instance. The default execution timeout for the Code node drops from five minutes to one minute, and archive decompression limits have been lowered to protect against zip bomb attacks.
* **Storage and Memory Changes:** In-memory binary data mode has been removed. All instances must now use local filesystem storage or S3-compatible external storage.
* **Security Default Tightening:** Encryption key rotation is permanently active. Slack credentials now require a signing secret, SSRF protection includes an expanded default block list, and unverified community packages are disabled by default.
* **Deprecations and Removals:** Legacy nodes—including `Function`, `Function Item`, `Item Lists`, `Cron`, `Interval`, the legacy OpenAI node, older AI Agent modes, and older `Edit Image` node versions—have been removed. Feature removals include turning Chat Hub off by default, removing editor URL imports, and dropping the Ask AI tab from the Code node.

## Why it matters

Under semantic versioning, n8n reserves major version releases for breaking infrastructural changes while shipping features continuously (releasing over 45 updates since version 2.0 in December 2025). Version 3.0 consolidates back-end maintenance and security adjustments into a single release.

Mandating Docker for self-hosted instances ensures that required system-level security dependencies are present. Eliminating in-memory binary processing prevents out-of-memory crashes when workflows process large files under high load.

For teams managing automation pipelines or [building your first n8n workflow](/posts/first-n8n-workflow/), these updates improve worker isolation and engine durability. However, environments relying on legacy node syntax or bare-metal host installations will experience broken execution paths without pre-upgrade adjustments.

## What to do next

To manage the transition, n8n includes an in-app Migration Report available in version 2.39 and higher under `Settings > Migration Report`.

1. **Upgrade to Late 2.x:** Update your current deployment to version 2.39 or higher to access the migration tool. (Instances running 1.x must migrate to 2.x first; 1.x support ends December 31, 2026).
2. **Run the Migration Report:** Review impacted workflows and instance settings. The report automatically converts compatible legacy configurations into unreleased workflow drafts (such as mapping `Function` nodes to `Code` nodes, or `Item Lists` to `Split Out` or `Aggregate`).
3. **Manage Workflow Ownership:** Filter out obsolete or unpublished workflows, assign fix requests to individual workflow owners based on modification history, and export a CSV overview.
4. **Backup and Test:** Upgrades to 3.x are strictly one-way and cannot be undone without restoring from a full system backup. Test the upgrade path on non-production instances prior to production deployment.

### Migration Considerations
After version 3.0 reaches stable release, the 2.x codebase will receive security patches and critical bug fixes for 12 months. All new feature development will occur exclusively on the 3.x release line.

## Sources

* [n8n Blog - Introducing n8n 3.0](https://blog.n8n.io/introducing-n8n-v3/)
