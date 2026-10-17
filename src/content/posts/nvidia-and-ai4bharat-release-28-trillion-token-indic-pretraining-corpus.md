---
title: NVIDIA and AI4Bharat Release 2.8 Trillion Token Indic Pretraining Corpus
published: 2026-10-17T05:09:42.778Z
draft: false
description: >-
  NVIDIA and AI4Bharat have released a 2.8 trillion token Indic language dataset
  and an open GPU-accelerated pipeline for synthetic data generation.
tags:
  - Open Source
  - ai-news
  - open-source-llms
  - research
category: AI News
author: LockDraft
sourceLink: 'https://huggingface.co/blog/nvidia/scaling-indic-pretraining'
---

## What changed

NVIDIA, in collaboration with IIT Madras's AI4Bharat research lab, has announced **Nemotron-pretraining-Indic-v1**, an open pretraining dataset spanning approximately 2.8 trillion tokens across 22 official Indian languages. Alongside the corpus, the teams are releasing the complete GPU-accelerated pipeline used to generate, evaluate, and repair the data.

Key details of the release include:

- **Token Volume and Distribution**: Tokenized using the Gemma-4 tokenizer, the dataset contains 2,601.0 billion native-script tokens and 224.6 billion romanized tokens across 34 language-script configurations.
- **Language Coverage**:
  - *12 Dual-Script Languages* (Native Script + Latin Romanization): Bengali, Gujarati, Hindi, Kannada, Malayalam, Marathi, Nepali, Odia, Punjabi, Tamil, Telugu, and Urdu.
  - *10 Native-Script Languages*: Assamese, Bodo, Dogri, Kashmiri, Konkani, Maithili, Manipuri, Sanskrit, Santali, and Sindhi.
- **Source Material**: Derived from 15 subsets of `Nemotron-CC-v2`, covering mathematics, code, technical Q&A, and general web documents.
- **Pipeline Architecture**: Built on NVIDIA's `NeMo Data Designer` framework, utilizing two primary translation workflows:
  - *12-Language Workflow*: Uses `Gemma-4-31B-it` for full-document translation. Translations are evaluated against English sources using a rubric based on Multidimensional Quality Metrics (MQM). Outputs scoring below 75 out of 100 undergo targeted repairs guided by evaluation feedback. This repair loop recovered 438.4 billion tokens. Romanized versions are created from accepted native-script outputs rather than direct English translation.
  - *10-Language Workflow*: Leverages `Indic Translate`, a document-level translation model from Bodhan AI, with `Gemma-4-31B-it` handling quality evaluation. For longer documents in languages like Santali, the workflow uses overlapping text windows to preserve translation stability.
- **Downstream Application**: Continued pretraining for **Nemotron 3.5 Super VL** incorporated 10 billion Indic tokens drawn from a 12-language subset of this corpus and natural Indic text.

## Why it matters

AI development in non-English languages frequently encounters a fundamental hurdle: a lack of structured, high-volume pretraining data. Scraped web text in regional languages often loses complex formatting, software code, or mathematical expressions.

The open-source `NeMo Data Designer` workflow enforces preservation rules so that equations, code blocks, tables, and URLs remain intact during document-level translation. Furthermore, generating romanized text from verified native-script outputs—rather than directly from English—reduces residual English text and hallucinated additions.

Every record in the corpus maintains a source identifier tracing back to its original `Nemotron-CC-v2` document, providing explicit provenance for data auditing and filtering.

## What to do next

Developers can leverage the open-source pipeline and recipes to generate domain-specific Indic datasets:

1. **Run the Generation Pipeline**: Deploy `NeMo Data Designer` alongside the provided prompts and quality checks to translate custom source documents into Indian languages.
2. **Customize Quality Thresholds**: Modify the MQM-inspired rubric thresholds or targeted repair workflows to balance output volume against strict accuracy requirements.
3. **Experiment with Script Configurations**: Incorporate both native-script and romanized variants into pretraining mixes to improve model robustness on informal or Latin-script inputs.

## Limitations

- **Tokenizer Dependence**: Token counts were calculated using the Gemma-4 tokenizer; actual training token budgets will vary depending on the chosen model tokenizer.
- **Synthetic Grounding**: While translation quality and formatting are rigorously evaluated, synthetic translated data serves as a supplement to, rather than a full replacement for, naturally authored Indic text that carries local cultural context.

For related LockDraft context, see [Ai2 Open-Sources AstaBrief 8B for Fast Scientific Report Generation](/posts/ai2-open-sources-astabrief-8b-for-fast-scientific-report-generation/).
## Sources

- [Scaling Indic Pretraining: 2.8 Trillion Tokens and an Open Data Generation Pipeline](https://huggingface.co/blog/nvidia/scaling-indic-pretraining)
