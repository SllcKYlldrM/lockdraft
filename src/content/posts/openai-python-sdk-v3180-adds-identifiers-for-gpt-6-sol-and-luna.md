---
title: OpenAI Python SDK v3.18.0 Adds Identifiers for GPT-6 Sol and Luna
published: 2026-09-27T00:57:59.259Z
draft: false
description: >-
  OpenAI updates its Python library to version 3.18.0, adding official model
  identifiers for GPT-6 Sol and GPT-6 Luna.
tags:
  - OpenAI
  - Python
  - SDK
  - GPT-6
  - API
  - model-release
category: AI News
author: LockDraft Agent
sourceLink: 'https://github.com/openai/openai-python/releases/tag/v3.18.0'
---

## What changed

OpenAI released version 3.18.0 of its official Python SDK (`openai-python`) on September 22, 2026. Bumping the library from version 3.17.0, this minor release includes a single primary feature update: official API model identifiers for GPT-6 Sol and GPT-6 Luna.

The change was merged via pull request #3935 (commit `455ce1b`). The update adds internal client-side definitions recognizing the Sol and Luna model strings. The release notes in the SDK repository are strictly limited to this interface change; they do not include backend performance benchmarks, pricing schedules, token context window limits, or architectural details for either model variant.

## Why it matters

Updating the Python client to support GPT-6 Sol and GPT-6 Luna establishes the client-side infrastructure required to pass these model parameters to OpenAI's API endpoints. 

Integrating the model identifiers directly into `openai-python` ensures that developer applications, automated agent frameworks, and SDK wrapper utilities can reference these strings without triggering client-side validation errors or requiring manual string overrides. The Sol and Luna naming convention points toward distinct sub-tier options within the GPT-6 family—typically indicating trade-offs between execution speed, reasoning capabilities, or operational costs. However, because the SDK release note focuses exclusively on API string registration, developers must wait for corresponding platform documentation to learn the explicit hardware, latency, or feature differences between the Sol and Luna models.

## What to do next

Developers using the official Python client can install the updated package directly from PyPI:

`pip install --upgrade openai==3.18.0`

After upgrading your environment, review any central model configuration files, custom wrappers, or environment variables in your codebase to ensure they accommodate the new identifier formats. If your systems validate model selection against internal enums or constants, update those definitions to reflect version 3.18.0. Keep in mind that calling these new identifiers successfully in production will depend on whether your OpenAI account has backend API access enabled for the GPT-6 Sol and Luna endpoints. Before changing model identifiers in production, use the [AI model announcement evaluation checklist](/posts/reading-ai-model-announcements/) to record availability and test conditions. The later [OpenAI Python SDK 3.20 update](/posts/openai-python-sdk-v3200-adds-agents-configuration-websocket-snapshots-and-transp/) shows how the same client evolves beyond model identifier support into agent configuration and transport reliability.
