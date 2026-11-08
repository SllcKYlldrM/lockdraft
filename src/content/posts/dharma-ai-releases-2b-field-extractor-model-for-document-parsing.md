---
title: Dharma-AI Releases 2B Field Extractor Model for Document Parsing
published: 2026-11-08T15:39:17.416Z
draft: false
description: >-
  Dharma-AI introduced a 2-billion-parameter model that extracts structured JSON
  fields from document images, outperforming frontier LLMs in benchmark tests.
tags:
  - Open Source
  - AI Agents
  - ai-news
  - open-source-llms
  - tool-update
category: AI News
author: LockDraft
sourceLink: 'https://huggingface.co/blog/Dharma-AI/dharma-field-extractor'
---

## What changed

Dharma-AI has introduced the Dharma Field Extractor, a 2-billion-parameter model designed to parse document images and output structured JSON data. The model builds on DharmaOCR-LITE v1.1—a 2B base model optimized via supervised fine-tuning and direct preference optimization (DPO)—and incorporates a Low-Rank Adaptation (LoRA) adapter trained on 43,384 field-annotated document examples.

The training dataset spans three main sources: English multi-domain web documents, Brazilian Portuguese documents, and broader European and Asian multilingual datasets. Document types include receipts, commercial invoices, forms, bank statements, identification cards, and synthetic records.

The extractor supports two operational modes:
- **Open extraction:** Operates without a predefined schema. The model uses contextual clues and visual layout to identify key-value pairs and tables, returning all extracted fields as JSON key-value pairs.
- **Schema-directed extraction:** Accepts a user-defined target schema specifying expected key names and field types (`string`, `number`, or `boolean`). The model maps document values directly to the requested keys, fills nested tables row by row, and outputs `null` for fields requested in the schema that are missing from the document.

## Why it matters

To evaluate extraction quality, Dharma-AI tested the model against 546 documents across 1,638 test scenarios, including open extractions, partial schemas, and schemas with nonexistent fields. Performance was measured using a composite score calculated by multiplying field-level F1 (matched by object path and table cell position) by value-level Levenshtein similarity and the ratio of valid JSON outputs.

The 2B model achieved a composite score of 0.834, outperforming tested commercial API configurations such as Claude Opus 5 (0.816 composite score, a 1.8-point gap) and GPT-5.6 Luna (0.741 composite score, a 9.3-point gap).

On zero-shot evaluations using public datasets excluded from training:
- **SROIE:** On a sample receipt, the model extracted all 18 fields correctly, combining multi-line unlabeled addresses into a single string, capturing numbers to the cent, and returning `null` for empty fields.
- **FUNSD:** On a faded photocopied form, the model correctly extracted a list of 12 boolean fields and nested sub-options, successfully identifying a single checked box alongside handwritten notes and a handwritten Bates ID.

Running self-hosted on a single NVIDIA L40S GPU ($2.24/hour), measured operational costs per document were 6 times lower than GPT-5.6 Luna and up to 147 times lower than GPT-5.6 Sol, based on average token counts measured against published provider pricing. For developers [architecting workflows around commercial LLM APIs](/posts/architecting-with-claude-an-in-depth-developers-guide-to-anthropics-api-surface/), specialized small models present an alternative to per-token pricing models on structured document extraction workloads.

*Caveats and limitations:* The reported cost savings reflect self-hosted hardware runtime on an L40S GPU rather than a flat API fee. Infrastructure costs in production will vary depending on deployment hardware, throughput requirements, and latency constraints. Furthermore, while open extraction captures layout-based structures, schema-directed extraction relies on accurate input schemas to match downstream system keys.

## What to do next

Developers can test the model's extraction capabilities using the online demonstration provided in the announcement.

When deploying field extraction in production pipelines:
1. Supply explicit JSON schemas with strict field types (`string`, `number`, `boolean`) when target downstream databases require static key names.
2. Use open extraction mode for ingestion pipelines handling unstructured or unexpected document types.
3. Ensure downstream database ingestion logic is configured to handle `null` outputs for absent or unreadable document fields.

## Sources

- [Dharma Field Extractor Announcement](https://huggingface.co/blog/Dharma-AI/dharma-field-extractor)
