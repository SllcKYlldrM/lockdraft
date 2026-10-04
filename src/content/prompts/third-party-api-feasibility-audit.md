---
title: Third-Party API Feasibility Audit
description: >-
  Research and audit a third-party API's constraints, rate limits, and webhooks
  before you write any integration code.
published: 2026-10-04T15:28:23.305Z
draft: false
category: research
models:
  - Claude
  - GPT
  - Gemini
tags:
  - research
difficulty: intermediate
prompt: >-
  You are an expert systems integration engineer. Your task is to conduct a
  highly practical, no-hype feasibility audit for integrating the following
  third-party API:


  - **Target API/Service**: {{target_api}}

  - **Integration Goals**: {{integration_goals}}

  - **Critical Requirements**: {{critical_requirements}}

  - **Our Tech Stack / Constraints**: {{constraints_or_tech_stack}}


  Please research and analyze the official documentation, developer forums, and
  known limitations for {{target_api}} to produce a structured Feasibility
  Report containing the following sections:


  ### 1. Authentication & Security

  - Identify the authentication mechanism required (OAuth2, API Keys, JWT,
  etc.).

  - Highlight any security complexities (e.g., short-lived tokens, IP
  whitelisting, complex signature verification for webhooks).


  ### 2. Rate Limits, Quotas, & Pricing Tiers

  - Detail the exact rate limits (e.g., requests per second/minute) and how they
  are enforced (burst vs. sustained).

  - Identify if any endpoints required for our integration goals are locked
  behind higher enterprise pricing tiers.


  ### 3. Real-Time Capabilities (Webhooks / WebSockets)

  - Check if the API supports webhooks or if we must rely on polling.

  - If webhooks are supported: List the relevant event topics, payload delivery
  guarantees, and retry policies.


  ### 4. Goal Feasibility Mapping

  For each of our stated integration goals:

  - State clearly if it is **Fully Supported**, **Partially Supported (with
  workarounds)**, or **Unsupported**.

  - Detail the specific API endpoints, methods (GET/POST), and payload schemas
  required to achieve the goal.


  ### 5. Known Gotchas & Developer Experience (DX)

  - Identify common pain points reported by developers (e.g., slow response
  times, poor sandbox/test environment, inconsistent JSON structures, lack of
  SDK support for our tech stack).


  ### 6. Critical Missing Information

  - List any details about our requirements or the target API that are ambiguous
  or undocumented. Do not guess; explicitly state what needs to be verified via
  an actual API call or by contacting support.
---

## When to use this

Reach for this prompt when you need to integrate a new third-party service (like Stripe, Salesforce, or a niche SaaS) into your application or automation workflow. It helps you uncover hidden rate limits, webhook limitations, and authentication hurdles before you invest developer hours in writing integration code.

## Tips

- If the API has multiple versions (e.g., REST vs. GraphQL, or v1 vs. v2), specify which version you intend to use in the constraints placeholder.
- Paste in raw markdown snippets of the API's official documentation index or pricing page if the service is highly niche or gated behind a login.
