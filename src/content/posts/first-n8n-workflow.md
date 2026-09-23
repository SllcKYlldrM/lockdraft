---
title: "Building Your First n8n Workflow: A Practical Walkthrough"
published: 2026-09-17
description: "Set up n8n and build a real, working automation — a webhook that filters, transforms, and forwards data — instead of a toy example."
tags: [n8n, automation, tutorial]
category: Automation
series: "n8n from Zero"
seriesOrder: 1
---

Most n8n tutorials build a workflow that does nothing useful — a trigger connected straight to a "Set" node. Here's one that actually filters and routes real data, the shape most first real workflows take.

## What we're building

A webhook receives form submissions. The workflow:
1. Validates that a required field is present
2. Filters out submissions marked as spam
3. Transforms the data into a clean shape
4. Sends valid submissions to a Slack channel (or any HTTP endpoint)

## 1. The trigger

Add a **Webhook** node. Set the HTTP method to `POST` and give it a memorable path (e.g. `/form-submit`). n8n gives you a test URL immediately — use it to send a sample payload with `curl` before building anything else, so you know exactly what shape of data you're working with.

```bash
curl -X POST https://your-n8n-instance/webhook-test/form-submit \
  -H "Content-Type: application/json" \
  -d '{"email": "user@example.com", "message": "hello", "honeypot": ""}'
```

## 2. Validate required fields

Add an **IF** node right after the webhook. Condition: `{{$json.email}}` is not empty. Route the "false" branch to a **NoOp** node (or a Respond-to-Webhook node returning a 400) so incomplete submissions stop here instead of propagating.

## 3. Filter spam

Add a second **IF** node checking your honeypot field: `{{$json.honeypot}}` is empty. Bots that fill in every field get routed to a dead end; real users, who never see the honeypot field, pass through.

## 4. Transform the data

Add a **Set** node to shape the output into exactly what your downstream system expects — don't forward the raw payload. This is also the right place to strip anything you don't want to store or transmit further, like the honeypot field itself.

## 5. Send it somewhere

Add an **HTTP Request** node (or the Slack node if you're using Slack) as the final step, pointing at your destination.

## Why this shape matters

This IF → IF → Set → HTTP Request shape — validate, filter, transform, deliver — covers the large majority of "someone submits something, we need to act on it" automations. Once you've built this once, you can swap the trigger (form, email, database row) and destination (Slack, email, another API) and reuse the same skeleton.

Next in this series: adding retries and error notifications so a failed delivery doesn't silently disappear.
