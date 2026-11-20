---
title: >-
  Google Launches On-Demand Tool Retrieval for Gemini API to Reduce Prompt
  Overhead
published: 2026-11-20T07:51:55.332Z
draft: false
description: >-
  Gemini API adds Tool Retrieval in preview, letting AI agents defer tool schema
  loading to cut input tokens and optimize function calling.
tags:
  - AI Agents
  - ai-news
  - model-release
category: AI News
author: LockDraft
sourceLink: >-
  https://blog.google/innovation-and-ai/technology/developers-tools/gemini-api-tool-retrieval/
---

## What changed

Google has introduced Tool Retrieval in preview for the Gemini Interactions API. The feature allows developers to keep tool libraries on standby, loading complete JSON parameter schemas into context only when required by the task at hand.

To use server-side retrieval, developers include a `{"type": "tool_search"}` object in the request's tool array and set `defer_loading: true` on specific functions. The model retains access to the names and top-level descriptions of deferred tools, but hides their parameter specifications. When a conversation turn requires a deferred function, Gemini retrieves the full schema on the server side and executes the tool call within the same API interaction.

The execution details are exposed inside `interaction.steps`, displaying `tool_search_call`, `tool_search_result`, and `function_call` steps for debugging tool selection decisions. The feature also supports Model Context Protocol (MCP) integrations by applying `defer_loading: true` to an `mcp_server` tool type.

For applications using custom registries, embedding indexes, or per-user permission filters, developers can specify `"execution": "client"` on `tool_search`. In client-side retrieval, the model queries the application for matching tools, adding one round trip per search and enabling dynamic tool injection mid-conversation.

Tool Retrieval is available on Gemini 3.6 and later models, including Gemini 4 variants such as `gemini-4-hydrogen`, through the Interactions API.

## Why it matters

Equipping autonomous agents with dozens or hundreds of functions usually requires sending every parameter schema inside every prompt. This approach inflates input token counts, increases response latency, and degrades tool selection accuracy as candidate tool lists grow.

By deferring parameter loading, Tool Retrieval optimizes prompt context while maintaining compatibility with prefix caching. Because deferred schemas stay out of the initial system prompt and are attached only after retrieval, the cached prompt prefix remains stable across conversation turns.

Optimizing context assembly is a shared challenge across agent architectures, similar to prompt optimization patterns seen when [architecting with Claude](/posts/architecting-with-claude-an-in-depth-developers-guide-to-anthropics-api-surface/). However, Gemini's server-side tool retrieval offloads the search index infrastructure directly to Google's backend.

There is no separate feature charge for Tool Retrieval. Standard model rates apply to input and output tokens. Enabling `tool_search` adds a small fixed block of input tokens, while loaded tool schemas are billed as input tokens for the rest of the conversation interaction. Net token savings occur when the schemas withheld exceed those retrieved.

## What to do next

Developers using the Gemini Interactions API can update their setup by marking secondary or long-tail tools with `defer_loading: true` while keeping high-frequency tools loaded by default.

Key deployment considerations:
* **Server-side integration:** Add `tool_search` to the tool array and set `defer_loading: true` on targeted functions or `mcp_server` definitions.
* **Client-side evaluation:** Use `"execution": "client"` if schemas must be filtered based on real-time permissions or fetched from an existing local embedding index.
* **Debugging:** Review the step log in `interaction.steps` to trace how the model searches for tool names and evaluates descriptions.

Because loaded schemas remain in the prompt context for subsequent turns, developers should benchmark token usage against typical conversation lengths to confirm cost reductions.

## Sources

* [Google AI Blog: Introducing Tool Retrieval in the Gemini API](https://blog.google/innovation-and-ai/technology/developers-tools/gemini-api-tool-retrieval/)
