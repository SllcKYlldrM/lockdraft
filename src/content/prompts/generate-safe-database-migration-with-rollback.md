---
title: Generate Safe Database Migration with Rollback
description: >-
  Draft reversible migration script with pre-checks, rollback, and verification
  steps for your target database engine.
published: 2026-11-17T19:19:12.098Z
draft: false
category: coding
models:
  - Claude
  - GPT
  - Gemini
tags:
  - reliability
difficulty: intermediate
prompt: >-
  Act as a Senior Database Engineer. Your task is to generate a safe, reversible
  database migration script based on the provided context. You must prioritize
  data integrity, minimize downtime, and ensure a clear rollback path.


  Context:

  {{target_database_engine}}

  {{current_schema_description_or_snippet}}

  {{desired_schema_changes}}

  {{risk_constraints_or_business_rules}}


  Instructions:

  1. Analyze the desired changes against the current schema. If any critical
  information is missing (e.g., data volume estimates, foreign key dependencies
  not listed, or ambiguous column definitions), explicitly flag these gaps
  before proceeding. Do not guess constraints or assume default behaviors.

  2. Generate the migration script in the correct syntax for
  {{target_database_engine}}. It must include:
     - A transaction block to ensure atomicity.
     - Conditional checks (e.g., IF EXISTS) to handle re-runs safely.
     - Comments explaining the purpose of each step.
  3. Generate the corresponding rollback script. It must restore the schema
  exactly to its state before the migration, using safe constructs to avoid
  errors during rollback.

  4. Provide a numbered list of verification steps to run after migration to
  confirm success (e.g., row counts, index checks, constraint validation).

  5. List assumptions made due to missing information in the context.


  Output Format:

  - ### Migration Script

  [Code Block]

  - ### Rollback Script

  [Code Block]

  - ### Verification Checklist

  1. ...

  2. ...

  - ### Assumptions & Warnings

  - ...
---

## When to use this

When applying structural changes to a database and needing a safe, reversible workflow that includes pre-flight checks, atomic transactions, and a verified rollback plan to prevent data loss or downtime.

## Tips

- Provide exact DDL snippets for affected tables; vague descriptions cause hallucinated constraints or missing dependencies.
- Ask the model to generate a 'dry-run' analysis of potential blocking operations before accepting the final script.
