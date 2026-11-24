---
title: >-
  OpenAI and Cisco Release Shirudo, an Open-Source eBPF Patching Runtime for
  Linux
published: 2026-11-24T19:45:16.082Z
draft: false
description: >-
  Shirudo combines eBPF runtime filtering with AI-generated shields to protect
  live Linux systems without requiring service restarts.
tags:
  - OpenAI
  - Open Source
  - ai-news
category: AI News
author: LockDraft
sourceLink: 'https://openai.com/index/introducing-shirudo'
---

## What changed

OpenAI and Cisco have introduced Shirudo, an open-source runtime designed to protect running Linux systems while permanent vulnerability patches are being developed and tested.

Shirudo uses Linux eBPF (extended Berkeley Packet Filter) technology to load temporary security filters—referred to as "shields"—directly into kernel execution points without requiring system reboots or service downtime. The runtime combines frontier AI capabilities with kernel-level controls, allowing security agents to analyze vulnerabilities, generate targeted shields, and test them against active workloads.

Key technical components and features of Shirudo include:

* **Live Protection:** eBPF shields inspect and block vulnerable execution paths in real time. Operators can run proposed shields in a dry-run mode to monitor application impact prior to enforcement.
* **Agentic Mitigation Workflows:** Shirudo exposes programmable interfaces so AI agents can draft and validate targeted shields against exploits. In a demonstration presented at the Linux Plumbers Conference, OpenAI used Codex to generate an eBPF shield for the Java4Shell vulnerability. The shield injected an input validation check into Java's Base64 decoder within a running Elasticsearch process, blocking exploit payloads while keeping Elasticsearch operational.
* **Deployment Safeguards:** Shields are cryptographically signed before being loaded. Linux's native eBPF verifier enforces safety constraints, preventing unauthorized code execution in the kernel.
* **Hardware-Backed Attestation:** Integrates with the host system's Trusted Platform Module (TPM) to generate verifiable audit logs whenever shields are applied or removed.

Shirudo is available on GitHub under the BSD 2-Clause license, while its embedded BPF programs are dual-licensed under BSD and GPL.

## Why it matters

Testing and deploying security updates across production clusters often takes days or weeks. During this window, traditional mitigations like blocking broad system calls or disabling entire application endpoints can disrupt legitimate production traffic.

Shirudo provides a targeted runtime layer that isolates malicious execution paths at the kernel level. By pairing eBPF with model-generated shields, engineering teams can shrink the time between vulnerability disclosure and mitigation from days to minutes. Crucially, human operators retain final approval over shield deployment, ensuring AI-generated policies undergo operational review before enforcement.

**Limitations and Caveats:** Shirudo is not a replacement for upstream security patches; it serves strictly as a temporary containment layer while permanent fixes are tested. Effectiveness relies heavily on the accuracy of the generated eBPF filters, kernel compatibility, and strict verification by the Linux eBPF verifier to prevent performance degradation or unintended system behavior.

## What to do next

Developers and infrastructure engineers looking to evaluate Shirudo can take the following steps:

* **Run the Quickstart:** Set up a test host using Shirudo's VM quickstart guide to sign, load, and test eBPF shields on GitHub.
* **Interactive Testing:** Access Isovalent's self-guided interactive lab to explore eBPF shield mechanics in a pre-configured environment.
* **Attend the Deep Dive:** Register for the upcoming technical webinar scheduled for December 15 to review architectural details and runtime benchmarks.

For related LockDraft context, see [Ai2 Open-Sources AstaBrief 8B for Fast Scientific Report Generation](/posts/ai2-open-sources-astabrief-8b-for-fast-scientific-report-generation/).
## Sources

* [OpenAI Announcement](https://openai.com/index/introducing-shirudo)
