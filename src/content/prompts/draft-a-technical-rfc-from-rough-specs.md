---
title: Draft a Technical RFC from Rough Specs
description: >-
  Convert fragmented feature notes and tickets into a structured engineering RFC
  for team review.
published: 2026-11-03T18:00:05.990Z
draft: false
category: writing
models:
  - Claude
  - GPT
tags:
  - writing
difficulty: intermediate
prompt: >-
  Act as a staff engineer drafting a Technical RFC (Request for Comments) for
  internal review. Using the provided inputs, generate a structured RFC document
  following this exact numbered outline:


  1. Title & Summary

  2. Background & Motivation

  3. Problem Statement

  4. Proposed Approach

  5. Alternative Solutions Evaluated

  6. Implementation Plan & Milestones

  7. Risks, Trade-offs & Mitigations

  8. Open Questions & Required Decisions


  Inputs:

  Project Context: {{project_context}}

  Raw Notes/Specs/Tickets: {{raw_materials}}


  Constraints:

  - Maintain a neutral, precise engineering tone. Avoid marketing language or
  vague promises.

  - For each section, synthesize only from the provided inputs. If critical
  information is absent, insert [INFO NEEDED: <specific question>] rather than
  guessing or fabricating assumptions.

  - Keep responses concise. Use tables or bullet lists where they improve
  clarity.

  - Return only the formatted RFC text matching the numbered structure above.
---

## When to use this

Reach for this when proposing a new feature, refactor, or architectural change before implementation begins. It forces alignment across engineering, product, and DevOps by structuring loose ideas into a formal review document.

## Tips

- Paste raw Jira/GitHub tickets, Slack threads, or whiteboard scans directly into {{raw_materials}} to preserve original context.
- After generation, manually resolve every [INFO NEEDED] bracket before sharing with stakeholders to prevent scope creep and miscommunication.
