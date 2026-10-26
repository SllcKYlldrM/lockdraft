---
title: >-
  IBM Releases Granite Speech 5.0: Open-Source Models for High-Speed and
  Multilingual ASR
published: 2026-10-26T15:33:13.210Z
draft: false
description: >-
  IBM updates its Granite Speech collection with the 2B parameter 5.0 model, a
  19,870 RTFx Turbo CTC encoder, and improved 4.1 2B Plus weights.
tags:
  - ai-news
  - open-source-llms
  - model-release
category: AI News
author: LockDraft
sourceLink: 'https://huggingface.co/blog/ibm-granite/granite-speech-5'
---

## What changed

IBM has updated its open-source speech model collection under an Apache 2.0 license, introducing a new flagship speech-language model alongside updated weights for two existing architectures.

### Granite Speech 5.0 2B
Replacing the earlier 4.1 2B model while keeping the same 2-billion-parameter size, `granite-speech-5.0-2b` adds expanded language capabilities, higher accuracy, and extended prompt control.

- **Language support**: Transcribes English, French, German, Spanish, Portuguese, and Japanese. Supports two-way translation between English and those five languages, plus one-way translation from English to Italian and Mandarin.
- **Training dataset**: Built on 390,000 hours of public audio data combined with targeted synthetic datasets for Japanese speech recognition, translation tasks, and keyword biasing.
- **Performance metrics**: Reached an average Word Error Rate (WER) of 5.06% across English short-form benchmark datasets on the Open ASR Leaderboard as of October 21, 2026.
- **Control features**: Supports explicit language identification via prompts, dynamic formatting requests (reaching capitalization F1 scores between 89.7 and 99.5), and custom keyword biasing arrays up to 2,000 terms.
- **Deployment runtime**: Integrates natively with Hugging Face `transformers`, `vLLM`, `llama.cpp`, and Apple Silicon's `mlx-audio` framework.

### Granite Speech 5.0 470M Turbo CTC
The lightweight 470-million parameter Conformer-based encoder received efficiency and regional language upgrades:

- **Multilingual expansion**: Expanded from English-only to cover Japanese, Spanish, German, French, Italian, and Portuguese.
- **Output formatting**: Emits native capitalization and punctuation directly, eliminating secondary downstream text-casing pipelines.
- **Speed & acoustics**: By compiling a single Conformer block and reusing its execution graph, throughput increased from approximately 12,600 RTFx to 19,870 RTFx on Open ASR Leaderboard benchmarks. Training revisions also improved performance in echoey, noisy, or far-field recording conditions.

### Granite Speech 4.1 2B Plus
Retains API, architectural, and prompt compatibility with current 4.1 deployments while updating model weights optimized for complex, multi-speaker enterprise calls:

- **Diarization & attribution**: Word Diarization Error Rate (WDER) dropped from 4.40 to 4.10, while composite speaker-attributed WER (cpWER) decreased from 30.50 to 28.48.
- **Timestamp precision**: Average Timestamp Shift (AAS) across all speech dropped from 210.86 to 98.54. On short speech clips, AAS moved from 29.27 to 26.20.
- **Long-form & biasing**: WER on long audio recordings fell from 13.53 to 10.22 (a 24% reduction). Biased-word WER on 20-term keyword lists fell from 11.79 to 6.48.

## Why it matters

Speech-to-text integration often forces systems developers to choose between fast edge processing and contextual handling for complex enterprise domain vocabulary. 

At 19,870 RTFx, `granite-speech-5.0-470m-turboctc` reduces execution latency for client-side transcription or browser-based audio streaming via WebGPU. Meanwhile, the expanded 2,000-term keyword biasing array in `granite-speech-5.0-2b` gives developers a way to inject proprietary product names, technical jargon, and acronyms directly into inference requests without running costly fine-tuning jobs.

For enterprise meeting logs and multi-speaker workflows, cutting the Average Timestamp Shift by more than half in `granite-speech-4.1-2b-plus` provides tighter synchronization for video captioning and automated timestamp indexing. Like other recent open-weight tools—such as [Ai2's AstaBrief 8B model](/posts/ai2-open-sources-astabrief-8b-for-fast-scientific-report-generation/)—permissive Apache 2.0 licensing allows organizations to host and modify these models locally without vendor lock-in.

## What to do next

All three models are published on Hugging Face under the Apache 2.0 license:

- **Edge and real-time streaming**: Deploy `granite-speech-5.0-470m-turboctc` for low-latency pipelines or browser execution via WebGPU.
- **General ASR and translation**: Use `granite-speech-5.0-2b` in `vLLM`, `llama.cpp`, or `mlx-audio` when processing multilingual audio or requiring up to 2,000 bias terms.
- **Call center and meeting logs**: Drop updated `granite-speech-4.1-2b-plus` weights into existing 4.1 pipelines to immediately improve diarization, long-form stability, and timestamp accuracy.

For production enterprise deployments requiring safety filtering and risk management, IBM recommends placing Granite Guardian guardrails alongside the ASR inference pipeline.

### Limitations and Considerations
While `granite-speech-5.0-2b` adds multilingual translation, full bidirectional coverage is limited to English paired with French, German, Spanish, Portuguese, and Japanese; translation into Italian and Mandarin is strictly outbound from English. Additionally, the high-throughput `470m-turboctc` variant trades detailed speaker attribution and extended contextual awareness for fast processing speed, making the 2B models a better fit for complex meeting transcripts.

## Sources

- [Hugging Face Blog](https://huggingface.co/blog/ibm-granite/granite-speech-5)
