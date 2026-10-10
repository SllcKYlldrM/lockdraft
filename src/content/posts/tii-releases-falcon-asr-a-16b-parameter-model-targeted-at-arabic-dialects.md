---
title: 'TII Releases Falcon-ASR, a 1.6B Parameter Model Targeted at Arabic Dialects'
published: 2026-10-10T14:49:48.411Z
draft: false
description: >-
  Abu Dhabi's TII introduced Falcon-ASR, a 1.6B parameter model delivering low
  error rates on Emirati Arabic and supporting four other languages.
tags:
  - AI
  - Open Source
  - ai-news
  - open-source-llms
  - model-release
category: AI News
author: LockDraft
sourceLink: 'https://huggingface.co/blog/tiiuae/falcon-asr'
---

## What changed

The Technology Innovation Institute (TII) in Abu Dhabi has released Falcon-ASR, a 1.6 billion parameter speech recognition model designed for Arabic and multilingual audio transcription. The model focuses heavily on dialectal Arabic—specifically Emirati speech—alongside Modern Standard Arabic (MSA), other Gulf variations, English, French, Spanish, and Portuguese.

Falcon-ASR operates across all supported languages using a single unified set of model weights, eliminating the need for input language flags. The model generates word-level timestamps that align each transcribed word directly with its corresponding audio position.

To handle real-world deployment scenarios, training data included audio with background noise, room reverberation, overlapping speakers, background music, pitch and speed variations, and telephony transmission effects. Falcon-ASR's design and training methodology stem from TII's prior Falcon3-Audio architecture.

## Why it matters

Automated speech recognition (ASR) for Arabic presents distinct engineering challenges due to significant dialectal variation and a lower volume of labeled, non-standardized training resources compared to MSA or English.

Falcon-ASR demonstrated improvements across both Arabic and English benchmarks:

- **Arabic Leaderboard:** Evaluated across the six test sets used by the ELM Research Center's Open Universal Arabic ASR Leaderboard, Falcon-ASR recorded an average Word Error Rate (WER) of 20.92%, outperforming the previously published top score of 23.17% (from a September 30, 2026 leaderboard snapshot).
- **Emirati Dialect:** On TII's human-validated internal Emirati evaluation set, the model achieved a 22.73% WER and a 10.19% Character Error Rate (CER). This represented a 4.07 percentage point reduction in WER compared to Qwen3-Omni.
- **English Benchmarks:** Across seven public English evaluation sets from the Hugging Face Open ASR Leaderboard, Falcon-ASR achieved a mean WER of 5.74% without dedicated language switching.

### Limitations
While Falcon-ASR advances regional speech recognition, conversational dialectal Arabic remains inherently harder to transcribe accurately than formal broadcasts or standard English. Its 22.73% WER on Emirati speech indicates that practical implementations should still account for transcription errors in high-noise or informal settings.

## What to do next

Developers can test Falcon-ASR's transcription capabilities on custom audio files through an interactive Hugging Face Demo Space. TII has indicated that programmatic API endpoints and native application integrations are in development for future release.

For related LockDraft context, see [Ai2 Open-Sources AstaBrief 8B for Fast Scientific Report Generation](/posts/ai2-open-sources-astabrief-8b-for-fast-scientific-report-generation/).
## Sources

- [Hugging Face Blog](https://huggingface.co/blog/tiiuae/falcon-asr)
