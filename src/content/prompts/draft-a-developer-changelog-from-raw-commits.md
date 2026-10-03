---
title: Draft a Developer Changelog from Raw Commits
description: >-
  Transform raw git commit messages or pull request titles into a structured,
  reader-friendly changelog categorized by impact.
published: 2026-10-03T14:48:45.465Z
draft: false
category: writing
models:
  - Claude
  - GPT
  - Gemini
tags:
  - writing
difficulty: intermediate
prompt: "You are an expert technical writer and developer advocate. Your task is to transform a raw list of git commits, pull request titles, or developer notes into a clean, structured, and professional changelog for version {{version_number}}.\n\nHere is the context for this release:\n- **Target Audience:** {{target_audience}} (e.g., API consumers, end-users, internal product team, general public)\n- **Key Theme/Focus of this Release:** {{release_focus}} (e.g., security hardening, performance improvements, UI overhaul, or leave blank if none)\n\nHere is the raw commit history or release notes:\n---\n{{raw_commits_or_notes}}\n---\n\nPlease analyze the input and generate the changelog according to the following strict guidelines:\n\n### 1. Structure of the Output\nYour response must follow this exact structure:\n- **Executive Summary:** A 2-3 sentence overview of what this release achieves, written specifically for the target audience: {{target_audience}}.\n- **⚠️ Breaking Changes:** (Only include this section if there are breaking changes. Clearly explain what broke, why, and what migration action is required. If none, omit this section entirely.)\n- **\U0001F680 New Features:** Bulleted list of new capabilities. Focus on user value, not just code changes.\n- **\U0001F527 Improvements & Refactors:** Bulleted list of performance boosts, optimizations, and non-breaking structural changes.\n- **\U0001F41B Bug Fixes:** Bulleted list of resolved issues. State what the bug was and how it was fixed (e.g., \"Fixed a race condition that caused X when doing Y\").\n- **❓ Unclear / Action Required:** A list of any commits or notes that were too vague, cryptic, or lacked context (e.g., \"fix typo\", \"update\", or hash-only commits) to categorize. Do not guess their meaning; list them here so I can clarify them manually.\n\n### 2. Tone and Style Rules\n- Write in the active voice and present tense (e.g., \"Adds validation support\" instead of \"Added validation support\").\n- Group related commits together into single, cohesive bullet points rather than listing every single commit line-by-line.\n- Translate low-level technical jargon into clear benefits based on the target audience.\n- Keep it concise. No conversational filler or introductory/concluding remarks outside of the requested structure."
---

## When to use this

Use this prompt when preparing a new software release and you need to compile messy git commit histories, PR titles, or developer notes into a polished, structured changelog. It bridges the gap between raw technical commits and user-facing documentation, saving manual editing time.

## Tips

- For best results, strip out merge commits and automated dependency updates (like Dependabot) before pasting, unless you specifically want them documented.
- If the generated changelog misses the business context of a feature, reply with the specific PR description for that feature and ask the model to rewrite just that section.
