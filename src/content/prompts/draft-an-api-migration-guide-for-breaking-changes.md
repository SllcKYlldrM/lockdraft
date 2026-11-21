---
title: Draft an API Migration Guide for Breaking Changes
description: >-
  Transform raw breaking changes, diffs, and notes into a structured,
  step-by-step migration guide for consuming developers.
published: 2026-11-21T17:44:55.780Z
draft: false
category: writing
models:
  - Claude
  - GPT
  - Gemini
tags:
  - writing
difficulty: intermediate
prompt: >-
  You are a senior technical writer specializing in developer experience and API
  documentation. Your task is to draft a clear, developer-focused migration
  guide based on raw technical notes and diffs for breaking changes.


  ### Input Details:

  - **Library/API Name:** {{library_or_api_name}}

  - **Upgrading From:** {{old_version}}

  - **Upgrading To:** {{new_version}}

  - **Target Audience:** {{target_audience}}

  - **Raw Breaking Changes / Diffs / Notes:**

  {{raw_breaking_changes_or_diffs}}


  ---


  ### Output Structure:

  Draft the migration guide using the following exact structure:


  1. **Overview & Impact Assessment**: Summarize the purpose of this release and
  indicate the overall migration effort (e.g., low, medium, high effort).

  2. **Migration Checklist**: A prioritized checklist of high-level tasks
  required to successfully upgrade.

  3. **Detailed Breaking Changes**: For each major breaking change, include:
     - **Change Summary**: What changed and why.
     - **Before vs. After Code Examples**: Show idiomatic code under {{old_version}} alongside the required update for {{new_version}}.
  4. **Deprecations & Temporary Workarounds**: Highlight any feature flags,
  fallbacks, or temporary compatibility layers available during the transition.

  5. **Troubleshooting & Common Errors**: Potential compile or runtime errors
  developers might encounter and how to fix them.


  ---


  ### Rules:

  - Focus on actionable technical clarity. Keep descriptions concise and
  developer-centric.

  - If the provided input lacks concrete before-and-after details for a change,
  insert a bracketed placeholder like `[FLAG: Missing before/after code snippet
  for X feature]` rather than inventing code syntax.

  - Do not fabricate breaking changes or features not present in the provided
  notes.
---

## When to use this

Reach for this prompt when preparing to release a major version update to an API, SDK, or shared library that introduces breaking changes. It converts unstructured pull request descriptions, diffs, or engineering notes into a clean, developer-facing migration guide with code comparisons.

## Tips

- Include representative code snippets of the old patterns in your raw input so the model can generate accurate 'Before' and 'After' comparisons.
- If your release includes temporary backward-compatibility flags or deprecation warnings, note them in the raw input so they are captured in the Deprecations section.
