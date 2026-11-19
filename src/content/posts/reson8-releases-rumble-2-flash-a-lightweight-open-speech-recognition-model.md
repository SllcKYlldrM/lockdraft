---
title: 'Reson8 Releases Rumble-2-Flash, a Lightweight Open Speech Recognition Model'
published: 2026-11-19T14:08:39.476Z
draft: false
description: >-
  Reson8 open-sources Rumble-2-Flash, a 0.5B parameter speech model matching
  larger competitors while processing an hour of audio in under half a second.
tags:
  - ai-news
  - open-source-llms
  - model-release
category: AI News
author: LockDraft
sourceLink: 'https://huggingface.co/blog/rumble-2-flash'
---

## What changed
Reson8 has published Rumble-2-Flash under the Apache 2.0 license. The model contains 0.5 billion parameters and targets automatic speech recognition across more than 40 languages with built-in language detection. It provides explicit output controls that let users format numbers as digits or spelled words, retain or strip filler words, enforce verbatim repetition, and lock transcription to a specific language. Rather than requiring custom inference servers, the release ships with native compatibility for 🤗 Transformers and vLLM, removing the need for forked runtimes or trust_remote_code execution.

The architecture follows the Qwen3-ASR design and was created through on-policy distillation from Reson8's larger Rumble-2 model. Instead of training on static transcripts, the student network generates audio transcriptions independently while the teacher evaluates each token sequentially. This approach delivers immediate positional feedback rather than a single clip-level metric. To resolve vocabulary mismatches between the teacher and student, the training pipeline uses the GOLD framework, which aligns divergent tokenizer splits by comparing shared tokens directly and ranking unshared ones by sorted probability.

## Why it matters
Efficiency in speech processing typically demands heavy compute, but careful distillation narrows the accuracy gap between compact and massive architectures. On the Open ASR Leaderboard multilingual track, Rumble-2-Flash records a 6.96% error rate across Chinese, German, French, Italian, Spanish, Portuguese, Hindi, Dutch, and English. It outperforms Meta's omniASR-LLM 7B—a model fifteen times larger—and beats Whisper large-v3. The English-only track yields a 6.6% word error rate.

More importantly, the model handles degraded telephony data competently. In a 302-hour AppTek call-center benchmark featuring fourteen English accents, it achieved a 7.86% WER, matching NVIDIA's 30-billion-parameter Nemotron 3.5 Transcribe (7.78%) and sitting just behind Qwen3-ASR 1.7B (7.4%). Throughput scales with batch utilization; on fully populated dataset batches, the model exceeds 7,000 RTFx, translating to roughly 0.5 seconds of processing time per hour of audio. This performance profile enables low-latency transcription in automation workflows without requiring dedicated GPU clusters.

## What to do next
Weights are available on the Hugging Face Hub at Reson8/Rumble-2-Flash, and the model can be accessed via the platform's API. Standard installation requires torch, transformers, and accelerate. Load the processor and model with auto device mapping, then pass audio inputs in the form of local paths, URLs, NumPy arrays, or lists. Specify a target language in the transcription request or omit it to trigger automatic detection. Call generate with max_new_tokens set to 512, slice the output tensor to remove input tokens, and decode using return_format="transcription_only". Switch to return_format="parsed" if automatic language detection is active. For teams already evaluating compact multimodal routing, this release parallels the efficiency focus seen in projects like [Ai2 Open-Sources AstaBrief 8B for Fast Scientific Report Generation](/posts/ai2-open-sources-astabrief-8b-for-fast-scientific-report-generation/), though its scope remains strictly acoustic-to-text.

Caveats
Speed metrics above assume fully packed batches; throughput will degrade noticeably with smaller or highly variable-length inputs. While the model performs competitively on noisy, compressed call-center recordings, heavily overlapping speakers or extreme dialectal variation may still require human verification. The distillation pipeline depends on the teacher's continuous token probabilities, so coverage gaps in the original Rumble-2 training data will carry over. Additionally, the fixed Qwen3-ASR vocabulary limits custom term injection, which could impact domain-specific jargon handling.

## Sources
- Hugging Face Blog: Rumble-2-Flash | https://huggingface.co/blog/rumble-2-flash
