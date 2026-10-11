---
title: n8n v2.42.6 Blocks Deprecated Nodes and Expands Google Gemini Image Models
published: 2026-10-11T15:12:00.611Z
draft: false
description: >-
  n8n version 2.42.6 prevents creating workflows with deprecated nodes and adds
  Nano Banana 2.1 and Nano Banana 2 Lite to the Google Gemini node image model
  list.
tags:
  - n8n
  - tool-update
  - ai-news
category: Automation
author: LockDraft
sourceLink: 'https://github.com/n8n-io/n8n/releases/tag/n8n%402.42.6'
---

## What changed

n8n version 2.42.6, released on October 9, 2026, introduces enforcement mechanisms for workflow integrity and expands model availability in the Google Gemini node.

**Deprecated Node Enforcement**
The core platform now prevents users from creating new workflows or saving updates to existing ones if they contain nodes marked as deprecated. This change addresses issue [#40707](https://github.com/n8n-io/n8n/issues/40707) and shifts the responsibility of maintenance to the workflow editor level. Previously, deprecated nodes might have been silently accepted, allowing technical debt to accumulate in active automations.

**Google Gemini Image Model Updates**
The Google Gemini node has been updated to include additional image generation models in its selection list. Users can now select Nano Banana 2.1 and Nano Banana 2 Lite alongside existing options. This update responds to issue [#40656](https://github.com/n8n-io/n8n/issues/40656) and provides broader access to Gemini's image capabilities within n8n workflows.

## Why it matters

Blocking deprecated nodes at the create and update boundaries accelerates cleanup cycles. Automation practitioners can no longer defer replacing outdated components indefinitely, which helps maintain compatibility with underlying services and reduces the risk of breakage during future upgrades. 

For teams leveraging generative AI, the expanded model list allows for more precise tuning of image outputs. The inclusion of Nano Banana 2.1 and Nano Banana 2 Lite offers alternatives that may differ in performance characteristics or cost structure compared to previous versions.

## What to do next

*   Upgrade to n8n 2.42.6 to apply these changes.
*   Audit your workflow library for deprecated nodes. Attempting to save a workflow with such nodes will now trigger an error; you must replace these components before the save operation succeeds.
*   Review the Google Gemini node configuration to ensure the new Nano Banana models align with your project requirements.

### Limitations

The restriction on deprecated nodes applies only to workflow creation and update actions. Workflows that were successfully saved prior to this version can continue to execute without modification, though editing them will require removing the deprecated elements first.

See [the dedicated analysis of n8n v2.42.6](/posts/n8n-v2426-blocks-deprecated-nodes-and-expands-google-gemini-image-models/) for further details.

## Sources

*   [n8n v2.42.6 Release](https://github.com/n8n-io/n8n/releases/tag/n8n%402.42.6)
