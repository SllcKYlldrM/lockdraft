---
title: "Tighten Technical Writing"
description: "Cut a technical draft down to its essentials without losing precision or turning it into marketing fluff."
published: 2026-09-14
category: writing
models: [Claude, GPT, Gemini]
tags: [editing, writing, clarity]
difficulty: beginner
prompt: |
  Edit the text below for clarity and concision. Rules:

  - Cut filler words and hedging ("basically", "in order to", "it's worth noting that").
  - Replace vague claims with the specific fact behind them, or cut the claim if there isn't one.
  - Keep every technical detail, number, and caveat that was in the original — do not summarize away precision.
  - Do not add marketing language, exclamation points, or generic enthusiasm.
  - Keep the author's voice; don't make it sound like everyone else's blog.

  Return the edited text only, no commentary, followed by a short bullet list of what you changed and why.

  Text:
  {{draft}}
---

## When to use this

Run this on a first draft of a blog post, changelog, or documentation page before publishing. It's tuned to preserve technical precision, unlike most "make this punchier" prompts that erase it.

## Tips

- If the output still feels generic, add: "flag any sentence that could appear on any other blog unchanged."
- For very long drafts, run it section by section — you'll get more careful edits than a single pass over 3,000 words.
