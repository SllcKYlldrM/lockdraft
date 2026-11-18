---
title: >-
  Harvard Study Finds AI Coding Agents Boost Code Output by 30% but Slow Code
  Review by 49%
published: 2026-11-18T08:12:43.457Z
draft: false
description: >-
  A study of 718 companies shows AI coding agents increase raw output without
  adding finished Jira issues, shifting engineering bottlenecks to code review.
tags:
  - AI Agents
  - Developer Tools
  - research
  - ai-news
category: AI News
author: LockDraft
sourceLink: >-
  https://complexdiscovery.com/harvard-researchers-find-ai-coding-agents-shifted-the-bottleneck-to-code-review/
---

## What changed

Deploying AI coding agents increases the amount of code engineers write, but it does not lead to a measurable increase in finished software shipped to production, according to a working paper by Harvard University Ph.D. candidates Fiona Chen and James Stratton. Examining activity across 725,938 workers at 718 companies using data from engineering analytics platform Jellyfish and LinkedIn data from Revelio Labs between January 2021 and March 2026, the researchers evaluated how agent adoption impacted engineering workflows.

Firms using AI agents saw lines of code added per worker-month increase by 1,494 over a baseline of 5,017 (a 30% increase). Commits grew by 20%, and pull requests rose by 23%. However, completed work—tracked as resolved Jira issues deployed to production—rose by only 0.12 issues per worker-month on a 3.67 baseline with a standard error of 0.17, rendering the change statistically indistinguishable from zero.

To check whether engineers were taking on larger tasks, the authors used GPT-4o to label a 0.5% sample of issues by size and projected those labels across the dataset using text-embedding models. The analysis revealed no shift in average issue size or pull request size.

Instead, the bottleneck moved downstream to code review:

* **Merge delays:** Time from pull request submission to merge increased by 3.45 days on a 7.03-day baseline, a 49% rise.
* **Rejection rates:** Pull requests receiving a formal change request nearly doubled, rising by 12 percentage points over a 13% baseline.
* **Review volume:** Review comments per pull request grew by 35%.
* **Reviewer allocation:** The share of engineers participating in code review rose 14% (from a 29% baseline), while the share of workers writing code remained unchanged.

AI-based code review tools failed to alleviate the delay. By March 2026, nearly 80% of studied firms had adopted an automated review tool, but AI generated only 23.3% of review comments, and just 10.8% of pull requests received any AI feedback.

## Why it matters

Accelerating initial draft creation creates operational imbalances when verification relies on fixed human review capacity. The study indicates two concurrent issues when AI agents enter engineering workflows: increased volume flooding existing reviewers, and degraded code quality leading to higher revision overhead.

Qualitative interviews in the paper illustrate how teams respond to AI-introduced defects. After outages triggered by AI-generated commits, organizations established stricter policies—such as requiring explicit senior engineer sign-off for AI code. Because senior staff members often face tight scheduling constraints, these policies compounded turnaround delays.

This dynamic extends beyond software development. Automated workflows that rely on a human-in-the-loop checkpoint—such as legal draft generation or automated compliance redactions—risk transferring friction to the approval stage if drafting volume expands without a corresponding increase in review capacity or initial draft quality.

## What to do next

Engineering organizations deploying generative coding tools should adjust how they evaluate productivity and manage pull request workflows:

* **Track end-to-end delivery metrics:** Evaluate tooling based on production-deployed tasks (such as resolved issues or features shipped) rather than preliminary metrics like lines of code added or pull requests created.
* **Monitor review queue health:** Track review cycle times, iteration counts per pull request, and senior reviewer utilization rates alongside drafting speeds.
* **Standardize AI commit verification:** Establish automated testing standards and explicit guidelines for AI-generated contributions to reduce churn during manual review.

### Limitations and caveats

The study is based on an un-peer-reviewed working paper (dated August 4, 2026; initial draft January 7, 2026) circulated as a job-market paper. The dataset relies on Jellyfish client companies that explicitly consented to research usage, and full calendar data was available for 213 of the 718 analyzed firms. Additionally, the paper measures the incremental impact of AI agents at companies that had already implemented basic AI code assistants, rather than measuring an initial transition from zero AI usage.

## Sources

* [Harvard researchers find AI coding agents shifted the bottleneck to code review](https://complexdiscovery.com/harvard-researchers-find-ai-coding-agents-shifted-the-bottleneck-to-code-review/)
