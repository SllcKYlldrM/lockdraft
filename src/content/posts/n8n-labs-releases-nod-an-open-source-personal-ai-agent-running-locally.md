---
title: 'n8n Labs Releases Nod: An Open-Source Personal AI Agent Running Locally'
published: 2026-11-10T13:05:14.991Z
draft: false
description: >-
  n8n Labs has launched Nod, an open-source personal AI agent that runs in a
  local virtual machine to execute app and web tasks on your computer.
tags:
  - n8n
  - AI Agents
  - Open Source
  - automation
  - ai-news
  - tool-update
category: Automation
author: LockDraft
sourceLink: 'https://blog.n8n.io/meet-nod/'
---

## What changed

n8n Labs, an experimental team within n8n, released Nod as a standalone research preview. Available for macOS and Windows under an Apache 2.0 open-source license, Nod is a single-user personal agent that operates independently from the main n8n platform. It does not require an n8n account or cloud server setup to run.

Nod operates inside a private virtual machine (sandbox) on the host computer, using its own browser to navigate websites and interact with applications like Gmail, Google Calendar, Google Drive, and Slack. It can also handle web portals that lack native APIs or export capabilities.

Key technical and operational features include:

* **Bring-Your-Own Model Architecture:** Users can connect external AI providers via API keys, link a ChatGPT plan, or run local open-source models on their own hardware.
* **Long-Term Memory:** Nod scored 93.2% on the LongMemEval benchmark. It stores task history, adapts to writing tones by analyzing connected Gmail accounts, and writes internal procedural notes to handle recurring workflows and site layout changes. Users can view, edit, or clear stored memory.
* **Security and Credential Masking:** Passwords and payment card details are encrypted locally. When populating login screens or checkout forms, Nod enters credentials through private forms that prevent the underlying LLM from reading raw inputs.
* **Human-in-the-Loop Controls:** A dedicated secondary validation model checks actions before Nod sends emails, makes payments, posts content, or deletes files. If an action falls outside explicit user instructions, Nod requests manual confirmation.
* **Cost Controls:** Users can set monthly budget caps. Nod displays task-level cost breakdowns, generates receipts upon job completion, prompts for confirmation if an individual task exceeds $5, and provides cost estimates for scheduled jobs.
* **Multi-Channel Interaction:** Tasks can be assigned through Nod's native interface, Telegram, or WhatsApp. Nod can run multiple background jobs simultaneously or execute recurring scheduled tasks.
* **Optional n8n Integration:** While standalone, Nod can connect to existing n8n instances to trigger server-side automations alongside desktop tasks.

## Why it matters

Most workflow automation engines—including core n8n—are designed for shared, server-side processes across teams. Nod targets single-user task execution directly on desktop environments, filling the gap between chat-based assistants (which generate text without executing actions) and multi-user integration platforms.

By running inside a local sandbox and keeping memory and credentials on the user's hardware, Nod provides an isolated runtime environment for task automation. Developers using local LLMs can combine Nod with private model setups—similar to architecture patterns used when [deploying self-hosted n8n AI workflows on NVIDIA DGX Spark with zero cloud APIs](/posts/deploying-self-hosted-n8n-ai-workflows-on-nvidia-dgx-spark-with-zero-cloud-apis/)—to execute agentic web actions entirely offline.

For existing n8n users who already know how to build server workflows (such as those covered in [building your first n8n workflow](/posts/first-n8n-workflow/)), Nod serves as a complementary client-side executor for non-API web tasks, vendor portals, and personal administrative routines.

## What to do next

Practitioners interested in evaluating Nod can access the codebase and installers directly:

* Download the macOS or Windows binaries from the official [Nod download page](https://nod.n8n.io).
* Inspect the source code on the [Nod GitHub repository](https://github.com/n8n-io/nod).
* Review setup instructions and architecture details in the [Nod documentation](https://nod.n8n.io/docs/).

### Current Limitations

Because Nod runs on the user's host machine, active tasks pause if a laptop enters sleep mode. Users requiring continuous 24/7 background execution currently need to run Nod on a dedicated, always-on machine (such as a Mac mini) or a private server. Additionally, each installation supports only one owner, the agent cannot make phone calls, and the secondary permission-checking model can occasionally make mistakes, requiring explicit user oversight.

## Sources

* [n8n Blog: Meet Nod](https://blog.n8n.io/meet-nod/)
* [GitHub Repository: n8n-io/nod](https://github.com/n8n-io/nod)
* [Nod Official Documentation](https://nod.n8n.io/docs/)
