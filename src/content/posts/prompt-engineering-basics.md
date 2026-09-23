---
title: "Prompt Engineering Basics: Structure Beats Cleverness"
published: 2026-09-18
description: "The handful of structural habits that improve prompt output more reliably than any 'magic phrase.'"
tags: [prompt-engineering, basics]
category: Tutorials
---

Most prompt advice you'll find online is either a "magic phrase" ("act as an expert...") or vague ("be specific"). Neither tells you what to actually do. Here's what reliably moves the needle, in order of impact.

## 1. Say what "done" looks like

Models are much better at hitting a target you've described than at guessing one. Instead of "summarize this," say "summarize this in 3 bullet points, each under 20 words, focused on decisions made rather than discussion." The output format is part of the task, not an afterthought.

## 2. Give it the constraints you'd give a person

If a colleague would need to know a constraint to do the task right — a deadline, an audience, a length limit, a thing to avoid — the model needs it too. "Don't use marketing language" is a more useful instruction than "make it good."

## 3. Show, don't just tell, when the format matters

If you want a specific output shape (a particular JSON structure, a specific tone), one example is often worth several sentences of description. This is few-shot prompting, and it's the single highest-leverage technique for format-sensitive tasks.

## 4. Separate instructions from content clearly

Use headers, delimiters, or XML-ish tags to mark where your instructions end and the content to work on begins:

```
Summarize the text between the tags below.

<text>
{{content}}
</text>
```

This prevents the model from confusing instructions in the content with instructions from you — especially important once your prompts get long or the content is user-supplied.

## 5. Ask for the harder thing directly

"List the 3 most important risks" beats "tell me about risks" — models default to the safe, generic answer unless you ask for the specific, opinionated one. If you want judgment, ask for judgment explicitly.

## What doesn't matter as much as people think

Politeness ("please", "thank you") has negligible effect on output quality. Elaborate role-play personas ("You are a world-renowned expert with 30 years of experience...") help less than a clear task description with real constraints. Spend your effort on structure, not framing.

Every prompt in the [Prompts library](/prompts/) on this site follows these five habits — worth a look for concrete examples of the structure in practice.
