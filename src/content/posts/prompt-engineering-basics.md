---
title: "Prompt Engineering Basics: Structure Beats Cleverness"
published: 2026-09-18
updated: 2026-09-29
description: "A practical prompt engineering framework for clearer instructions, useful context, constraints, examples, output formats, and repeatable evaluation."
tags: [prompt-engineering, basics]
category: Tutorials
sourceLink: 'https://docs.anthropic.com/en/docs/build-with-claude/prompt-engineering/overview'
---

Prompt quality usually improves when the task is easier to understand, not when the prompt contains a clever phrase. A useful prompt gives the model a clear job, the context it needs, the constraints that matter, and a definition of a successful result.

The same structure works across providers. Exact syntax and model behavior vary, so treat the framework below as a starting point and verify it with representative examples.

## 1. Start with the task and success criteria

State what the model should produce and what “done” means. “Summarize this” leaves too many decisions open. “Summarize the decisions in three bullets, each under 20 words, and omit background discussion” gives the model a target it can check.

If quality depends on a measurable condition, include it. Useful criteria include required fields, acceptable length, audience, tone, source boundaries, and whether the model should ask a question when information is missing.

## 2. Add the context the task actually needs

Context is not a request to paste everything into the prompt. Provide the facts, definitions, audience, and constraints that change the answer. Remove unrelated material when it makes the task harder to interpret.

For long or mixed inputs, label the sections clearly so the model can distinguish instructions from source material. This is especially important when the input comes from a user, document, or external system.

## 3. State constraints explicitly

Give the model the limitations a careful colleague would need to know:

- Which sources may be used
- What must not be invented
- Required length or format
- Security or privacy boundaries
- Whether uncertainty should be reported
- What to do when required information is missing

“Be good” is not a constraint. “Use only the supplied documentation and mark unsupported claims as uncertain” is.

## 4. Specify the output format

The output format is part of the task. If the result will be parsed by software, name the fields and show the expected shape. If a person will read it, describe the structure and level of detail.

For example:

```text
Return exactly:
- decision: one sentence
- risks: three bullets
- next_step: one actionable sentence
```

Do not demand JSON unless the consumer needs JSON. A simpler format is easier to inspect when a human is the next reader.

## 5. Use examples when the format is hard to describe

An example can communicate a tone, transformation, or edge case more precisely than a paragraph of instructions. Use examples that resemble the real task, and include a negative or boundary example when the distinction matters.

Examples should demonstrate the behavior you want, not just provide extra content. If the model copies the wrong detail from an example, reduce the example or label its parts explicitly.

## 6. Separate instructions from input

Use headings or delimiters to make the boundary visible:

```text
Task: Extract the three decisions.
Rules: Do not infer decisions that are not stated.

<document>
{{content}}
</document>
```

This does not make untrusted input safe by itself. It makes the intended structure clearer and gives you a place to apply validation, filtering, and permission checks in the surrounding application.

## 7. Iterate and evaluate on real tasks

Prompt engineering is an evaluation loop, not a one-time wording exercise. Keep a small set of representative inputs, define what a good answer looks like, change one important variable at a time, and compare the results.

Check factual accuracy, instruction following, format compliance, latency, cost, and failure behavior. A prompt that looks better on one example may be worse across the cases that matter to your users.

## A reusable prompt skeleton

```text
Task:
  [what the model must do]

Context:
  [facts, audience, and relevant source material]

Constraints:
  [limits, exclusions, and uncertainty rules]

Output:
  [format, fields, length, and tone]

Quality check:
  [how the result should be verified]
```

Start with the smallest prompt that expresses these decisions. Add examples or provider-specific instructions only when evaluation shows that they solve a real failure mode. The [LockDraft Prompts library](/prompts/) contains concrete prompts to test against this structure, and the [model announcement evaluation guide](/posts/reading-ai-model-announcements/) covers how to evaluate provider claims before changing models.
