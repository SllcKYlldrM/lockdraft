---
title: "Diagnose a RAG Retrieval Failure"
description: "Systematically figure out why a retrieval-augmented generation pipeline returned a wrong or irrelevant answer."
published: 2026-09-15
category: agents
models: [Claude, GPT]
tags: [rag, debugging, retrieval]
difficulty: advanced
prompt: |
  A RAG pipeline returned a wrong or irrelevant answer to a user query. Help me diagnose why.

  Query: {{query}}
  Answer returned: {{answer}}
  Chunks retrieved (in order): {{retrieved_chunks}}
  Expected source of the correct answer (if known): {{expected_source}}

  Walk through these failure modes in order and tell me which one(s) most likely occurred,
  citing specific evidence from the inputs above:
  1. Retrieval failure — the right chunk was never retrieved
  2. Ranking failure — the right chunk was retrieved but ranked too low / crowded out
  3. Chunking failure — the right information was split across chunks awkwardly
  4. Generation failure — the right chunk was retrieved but the model ignored or misread it
  5. Query mismatch — the query's phrasing doesn't semantically match how the source is written

  For the most likely failure mode, give one concrete, testable fix (not a generic
  "improve your embeddings" suggestion).
---

## When to use this

Use this when a RAG system gives a bad answer and you're not sure if the bug is in retrieval, chunking, or generation. Feeding it the actual retrieved chunks is what makes the diagnosis useful instead of generic.

## Tips

- If you don't have `{{expected_source}}` yet, leave it blank — the model can still narrow down the failure mode from the retrieved chunks alone.
- Once you get a diagnosis, ask "write the eval test case that would catch this regression."
