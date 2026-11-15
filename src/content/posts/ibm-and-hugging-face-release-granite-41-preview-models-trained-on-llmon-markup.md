---
title: >-
  IBM and Hugging Face Release Granite 4.1 Preview Models Trained on LLMON
  Markup
published: 2026-11-15T15:54:21.622Z
draft: false
description: >-
  Granite 4.1 3B and 8B LLMON preview models use special-token markup to
  separate prompt instructions from data and block indirect injections.
tags:
  - Open Source
  - ai-news
  - open-source-llms
  - model-release
category: AI News
author: LockDraft
sourceLink: >-
  https://huggingface.co/blog/ibm-granite/llmon-an-llm-native-markup-language-now-in-granite
---

## What changed

IBM and Hugging Face have released two experimental open-weights models—`granite-4.1-3b-LLMON-preview` and `granite-4.1-8b-LLMON-preview`—trained to process and generate LLM Object Notation (LLMON). LLMON is an XML-like markup language designed to replace JSON and implicit formatting inside model contexts with explicit, model-native structural delimiters.

Along with the preview models, the release includes a GitHub repository containing an LLMON workflow toolkit, template examples, and lossless JSON-to-LLMON conversion utilities.

Instead of relying on standard text characters to indicate structure, LLMON uses reserved special tokens as delimiters. Components within a chat turn—such as instructions, retrieved data payloads, output constraints, and assistant responses—are wrapped in specific semantic tags (`instr`, `data`, `req`, `assistant`) and assigned unique two-character block identifiers. These two-character IDs are drawn from a fixed set that tokenizes into single tokens.

Rendered chat context includes an explicit `exec` block that maps relationships between components. By tagging context elements with `exec: True` or `exec: False`, developers can explicitly bind an instruction block to specific data payloads and requirements. Unbound components (`exec: False`) remain in the context history without being executed by the model.

## Why it matters

Standard JSON reliance in LLM applications often leads to brittleness. Transformer tokenizers do not natively enforce JSON syntax, treat structural characters like quotes (`"`) or braces (`{`) the same as regular content tokens, and struggle to track deeply nested structures over long token spans.

By separating structural delimiters from the vocabulary space and binding instructions directly to target data payloads, LLMON addresses structural ambiguity and reduces indirect prompt injections hidden in user data or retrieved documents.

Benchmark evaluations reported by the team show significant safety gains:
- On the OPI benchmark (which measures static indirect prompt injection defenses), LLMON models avoided 47% more attacks than the best tested frontier model.
- Robustness improved by 95% compared to the best open-source model evaluated on the benchmark.
- Attack mitigation was also observed on the ASB and StruQ benchmarks.
- General task capabilities remained comparable to the baseline Granite 4.1 Instruct models.

Because instructions must be explicitly bound to data in the `exec` block, unrelated background passages, tool outputs, and historical chat turns are less likely to bleed into model generations unexpectedly.

## What to do next

- **Access the Checkpoints**: Download `granite-4.1-3b-LLMON-preview` and `granite-4.1-8b-LLMON-preview` from Hugging Face.
- **Convert Data Pipelines**: Use the conversion tools in the official repository to transform existing JSON payloads into LLMON markup without altering underlying data schemas.
- **Use Built-in Integrations**: Test LLMON natively within the `Mellea` framework, which automatically formats outgoing model calls into LLMON markup.
- **Adapt Custom Schemas**: Fine-tune custom LoRA adapters on top of the LLMON preview models to introduce domain-specific tags and structures.

### Limitations and Caveats
The released benchmarks reflect defenses against static indirect prompt injections, where malicious commands are embedded in fixed data payloads. The authors noted that active work is ongoing to harden LLMON against adaptive prompt injection strategies that unfold dynamically across multi-turn conversations.

For related LockDraft context, see [Ai2 Open-Sources AstaBrief 8B for Fast Scientific Report Generation](/posts/ai2-open-sources-astabrief-8b-for-fast-scientific-report-generation/).
## Sources
- [Hugging Face Blog: LLMON: An LLM-Native Markup Language, now in Granite 4.1 3B and 8B](https://huggingface.co/blog/ibm-granite/llmon-an-llm-native-markup-language-now-in-granite)
