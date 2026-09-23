---
title: "ReAct vs. Plan-and-Execute: Two Patterns for AI Agents"
published: 2026-09-16
pinned: true
description: "Two of the most common agent loop patterns, what each one is actually good at, and when picking the wrong one will hurt you."
tags: [agents, react, planning, architecture]
category: Agents
---

Most "AI agent" frameworks are a thin wrapper around one of two loop patterns. Knowing which one you're building — and why — saves you from a lot of debugging later.

## ReAct: reason, act, observe, repeat

ReAct (Reason + Act) interleaves thinking and tool calls one step at a time: the model reasons about what to do next, calls a tool, observes the result, and reasons again. There's no fixed plan — the next step is decided fresh each time, informed by what just happened.

**Good for:** tasks where the right next step genuinely depends on what you just learned — debugging, research, exploring an unfamiliar API, anything where step 3 can't be known until you see the result of step 1.

**Weak spot:** it has no persistent plan, so on long tasks it can lose the thread, repeat work, or wander off course without anyone noticing until the end.

## Plan-and-Execute: plan once, then work the plan

This pattern splits planning from execution: the model first produces an explicit multi-step plan, then a (possibly separate, cheaper) executor works through the steps, only going back to re-plan if something breaks the plan.

**Good for:** tasks with a knowable shape up front — "migrate these 12 files," "run this checklist," "generate this report" — where the value of a stable plan outweighs the cost of occasionally being wrong about step 4 before you get there.

**Weak spot:** if the environment is more dynamic than expected, the agent either stubbornly follows a stale plan or has to re-plan so often that you're paying the planning cost repeatedly anyway.

## Picking one

A rough heuristic: if you could write the steps yourself before starting, use plan-and-execute. If you'd genuinely need to see step 1's result before knowing what step 2 is, use ReAct. Most production agents end up as a hybrid — a loose plan for structure, with ReAct-style reasoning inside each step.

The mistake to avoid is picking a pattern because a framework defaults to it, then fighting the framework when your task doesn't fit. Name the pattern you're using on purpose, and it gets a lot easier to reason about why an agent is misbehaving.
