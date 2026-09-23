---
title: "Plan an MCP Server's Tools and Resources"
description: "Turn a use case into a concrete Model Context Protocol server design — which tools, which resources, and where the boundary between them should sit."
published: 2026-09-24
category: agents
models: [Claude]
tags: [mcp, agents, architecture]
difficulty: advanced
prompt: |
  I want to build an MCP server for this use case:

  {{use_case}}

  Systems/data it needs to connect to: {{systems}}

  Design the server as:
  1. A list of tools (actions the model can take), each with a name, a one-line
     description written for the calling model, and its key parameters.
  2. A list of resources (read-only context the model can pull in), if any make sense
     for this use case — and an explicit note if none do.
  3. For each tool, whether it's read-only or has side effects, and if it has side
     effects, what confirmation or dry-run mode it should support.
  4. Any place where a single tool is trying to do two things and should be split, or
     two tools are redundant and should be merged.

  Optimize for a small number of clearly-scoped tools over broad coverage — flag if my
  use case is trying to cram too much into one server and would be better split into two.
---

## When to use this

Use this at the planning stage, before writing any server code — it's much cheaper to redraw the tool boundaries on paper than after a client is already calling a half-dozen overlapping tools.

## Tips

- Be specific about the systems in `{{systems}}` (exact APIs, not "our database") — the tool/resource split often depends on what that system actually supports (query vs. mutate, streaming vs. batch).
- Ask a follow-up "now write the JSON schema for tool #2's parameters" once the shape is settled, to move straight into implementation.
