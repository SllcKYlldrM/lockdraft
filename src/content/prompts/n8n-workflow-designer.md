---
title: "Design an n8n Automation Workflow"
description: "Turn a plain-language automation idea into a concrete, node-by-node n8n workflow plan."
published: 2026-09-13
category: automation
models: [Claude, GPT]
tags: [n8n, automation, workflow-design]
difficulty: intermediate
prompt: |
  I want to automate the following process using n8n:

  {{process_description}}

  Design the workflow as a numbered list of n8n nodes, in execution order. For each node, give:
  - Node type (e.g. Webhook, HTTP Request, IF, Set, Code)
  - What it does in this workflow
  - Key fields/parameters to configure
  - What triggers it or what data it receives from the previous node

  Call out explicitly:
  - The trigger (schedule, webhook, manual)
  - Any place error handling or retries are needed
  - Any credentials/API connections required

  Keep the plan implementable by someone who has used n8n before but hasn't built this specific workflow.
---

## When to use this

Use this before opening n8n — it forces you to think through the trigger, the data shape at each step, and error handling before you start dragging nodes around.

## Tips

- Be specific about the trigger and the data source in `{{process_description}}` — "when a new row is added to this Google Sheet" beats "when something happens."
- Ask a follow-up "now write the JavaScript for the Code node in step 4" to get implementation-ready snippets.
