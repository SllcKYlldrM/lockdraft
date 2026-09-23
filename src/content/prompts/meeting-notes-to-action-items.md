---
title: "Turn Messy Meeting Notes into Action Items"
description: "Extract clear owners, deadlines, and decisions from rough meeting notes without losing the details that matter."
published: 2026-09-24
category: writing
models: [Claude, GPT, Gemini]
tags: [meetings, productivity, writing]
difficulty: beginner
prompt: |
  Here are my raw notes from a meeting:

  {{notes}}

  Turn these into:
  1. Decisions made — one line each, stated as facts, not discussion points.
  2. Action items — each with an owner (if named in the notes) and a deadline (if
     mentioned); if either is missing, write "unassigned" or "no deadline given"
     rather than guessing one.
  3. Open questions — anything the notes raise but don't resolve.

  Do not invent an owner, deadline, or decision that isn't actually in the notes, even
  if it seems like the obvious next step. If the notes are ambiguous about who owns
  something, say so explicitly instead of picking a name.
---

## When to use this

Run this right after a meeting while your notes are still fresh but before you've cleaned them up — it works better on rough, fragmentary notes than on notes you've already tried to organize.

## Tips

- If several action items come back "unassigned," that's a real signal the meeting ended without clear ownership — worth flagging to the group, not just quietly assigning someone yourself.
- Paste notes with speaker names/initials if you have them — it noticeably improves owner attribution.
