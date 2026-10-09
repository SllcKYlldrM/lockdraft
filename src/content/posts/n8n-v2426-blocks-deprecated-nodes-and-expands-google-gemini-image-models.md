---
title: n8n v2.42.6 Blocks Deprecated Nodes and Expands Google Gemini Image Models
published: 2026-10-09T15:40:41.430Z
draft: false
description: >-
  The stable release of n8n v2.42.6 blocks workflow changes containing
  deprecated nodes and updates Google Gemini image model options.
tags:
  - n8n
  - ai-news
  - tool-update
category: Automation
author: LockDraft
sourceLink: 'https://github.com/n8n-io/n8n/releases/tag/stable'
---

## What changed

n8n has released stable version 2.42.6, introducing a critical system validation rule and updating its integration with Google's AI ecosystem. 

First, the core workflow engine now blocks the creation or updating of workflows that contain deprecated nodes (PR #40707). If a user attempts to save, import, or modify a workflow using outdated node versions, the platform will actively prevent the transaction. 

Second, the Google Gemini Node has been updated to display "Nano Banana 2.1" and "2 Lite" in its image model list (PR #40656). This change ensures that users configuring Gemini-driven image workflows have direct access to these specific model options within the node's user interface.

## Why it matters

Blocking deprecated nodes at the creation and update stages is a major step toward reducing technical debt for automation teams. In complex enterprise environments, workflows are often exported, version-controlled, and shared. When older node versions remain active, they introduce security risks, compatibility issues, and unexpected runtime failures when third-party APIs change. By enforcing this block, n8n ensures that developers build on modern, supported node versions, which is highly beneficial when [building your first n8n workflow](/posts/first-n8n-workflow/) or maintaining production pipelines.

For teams utilizing multi-modal AI, the update to the Google Gemini Node ensures compatibility with Google's evolving model offerings. Exposing "Nano Banana 2.1" and "2 Lite" within the image model dropdown allows developers to leverage these specific models for image processing, classification, or generation tasks. Keeping these dropdowns updated is essential as teams increasingly build advanced setups, such as those leveraging [n8n's dedicated agents and native workflow integrations](/posts/n8n-introduces-dedicated-agents-with-native-workflow-and-mcp-tool-integration/).

## What to do next

To adopt these changes, pull the latest stable Docker image or update your self-hosted instance to version 2.42.6:

```bash
docker pull n8nio/n8n:2.42.6
```

Before upgrading, audit your active workflows for any legacy or deprecated nodes. Because version 2.42.6 blocks the saving of workflows containing deprecated components, attempting to edit an older workflow post-upgrade will require you to replace those deprecated nodes with their modern equivalents before your changes can be saved.

## Limitations

While blocking deprecated nodes improves long-term stability, it may temporarily disrupt automated deployment pipelines or CI/CD setups that programmatically import older workflow JSON files. Teams should test their automated workflow deployment scripts in a staging environment running v2.42.6 to ensure no legacy definitions trigger validation failures.

## Sources

* [n8n v2.42.6 Release Notes on GitHub](https://github.com/n8n-io/n8n/releases/tag/stable)
