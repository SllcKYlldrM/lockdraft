---
title: Draft Pull Request Description from Diffs and Commits
description: >-
  Synthesize code diffs, commits, and ticket context into a structured PR
  description with testing strategy and reviewer focus flags.
published: 2026-10-27T15:58:26.415Z
draft: false
category: writing
models:
  - Claude
  - GPT
  - Gemini
tags:
  - code-review
difficulty: intermediate
prompt: >-
  You are an expert engineering lead reviewing code. Your task is to synthesize
  raw development artifacts into a structured, professional Pull Request (PR)
  description that facilitates efficient review.


  INPUT DATA:

  - Code Diff / Snippets: {{code_diff_or_snippet}}

  - Commit Messages: {{commit_messages}}

  - Ticket / Issue Link: {{ticket_or_issue_link}}

  - Additional Context: {{additional_context}}


  INSTRUCTIONS:

  Analyze the inputs to generate a PR description following this exact
  structure:


  1. **Title**: A concise, imperative summary (e.g., "Fix X" or "Add Y").

  2. **Summary**: Brief overview of the change and the problem it solves.

  3. **Key Changes**: Bulleted list of significant modifications. Group by file
  or logical component.

  4. **Testing Strategy**: Specific steps to reproduce or verify the change. If
  testing details are missing from inputs, explicitly flag this as `[NEEDS
  TESTING INFO]` rather than guessing.

  5. **Breaking Changes / Migration**: Note any API changes, config updates, or
  database migrations required. Mark as "None" only if confirmed safe.

  6. **Reviewer Focus**: Highlight areas where reviewer attention is most needed
  (e.g., complex logic, security implications).


  HONESTY CONSTRAINTS:

  - If {{code_diff_or_snippet}} is empty or too fragmented to determine scope,
  stop and output: "ERROR: Insufficient code data provided. Please paste the
  relevant diff."

  - Never hallucinate behavior not evident in the code or commits.

  - If {{ticket_or_issue_link}} is provided, reference the ticket number in the
  title or footer.


  OUTPUT FORMAT:

  Return only the Markdown content for the PR description, ready to copy-paste.
---

## When to use this

Use when you have completed a code change and need to generate a standardized PR description quickly, ensuring all reviewers see the summary, testing steps, and areas requiring scrutiny. Best for workflows where PR quality impacts review speed or when you want to enforce consistent documentation across contributions.

## Tips

- Paste the full unified diff (e.g., `git diff main..HEAD`) or a raw patch text rather than just commit messages; the model needs code context to accurately identify key changes and potential side effects.
- After generation, always manually verify the 'Testing Strategy' section against your local environment before posting, as the model can only infer testability from visible code patterns and may miss setup requirements.
