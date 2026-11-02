---
title: >-
  Hugging Face Releases AnySpeechRecognizer and AnyDecisionModel for Swift
  Developers
published: 2026-11-02T06:55:53.869Z
draft: false
description: >-
  Hugging Face brings open-source speech recognition, speaker diarization, and
  Core ML decision engines to Apple platforms via Swift.
tags:
  - Open Source
  - ai-news
  - open-source-llms
  - model-release
category: AI News
author: LockDraft
sourceLink: 'https://huggingface.co/blog/anydecisionmodel'
---

## What changed

Hugging Face announced two new open-source Swift packages—`AnySpeechRecognizer` and `AnyDecisionModel`—expanding on its prior `AnyLanguageModel` release to bring specialized, on-device machine learning models to macOS and iOS.

`AnySpeechRecognizer` mirrors Apple's native `SpeechAnalyzer` framework introduced in macOS 26 and iOS 26. Developers can swap `import Speech` for `import AnySpeechRecognizer` to route audio through third-party models converted to Core ML while preserving existing API structures (`SpeechTranscriber`, `DictationTranscriber`, `SpeechDetector`, and `AssetInventory`).

The package supports several open speech-to-text models:
- **NVIDIA Parakeet TDT 0.6B v3**: Supports 25 European languages with automatic language detection (CC BY 4.0).
- **Moondream Parakeet Ultra**: A fine-tuned variant of Parakeet v3 offering higher accuracy (CC BY 4.0).
- **NVIDIA Parakeet Unified EN 0.6B**: An English-only transcription model (NVIDIA Open Model License).
- **Alibaba Qwen3-ASR**: Available in 0.6B and 1.7B parameter sizes under Apache 2.0. It covers 30 languages and 22 Chinese dialects, including Cantonese, Mandarin, Japanese, and Korean.

`AnySpeechRecognizer` also introduces features missing from Apple's native framework, such as speaker diarization via `SpeakerDiarizer`. This module executes NVIDIA's `Streaming Sortformer 4spk` (v2 and v2.1) on Core ML to separate and attribute audio streams across up to four overlapping speakers on a single timeline.

Alongside speech recognition, `AnyDecisionModel` handles classification, rating scales, and yes-or-no queries. Instead of invoking generative text loops, it evaluates output probabilities directly from underlying models using local runtimes (MLX, Core AI, llama.cpp) or remote providers (Ollama, Jev).

## Why it matters

Using general-purpose LLMs for tasks like speech-to-text or basic routing often introduces unnecessary latency, high memory consumption, and compute costs. Specialized local models running on native Apple silicon hardware offer faster, cost-effective alternatives.

In Hugging Face's LibriSpeech benchmarks—evaluated on an M4 Max Mac Studio running macOS 27.0.1 with the package's `hear` evaluation tool—open models outperformed Apple's built-in engine on standard file transcription:

- **Parakeet Unified (File)**: 1.43% Word Error Rate (WER) on `test-clean`, 2.19% on `test-other`
- **Parakeet v3 (File)**: 1.55% WER on `test-clean`, 2.78% on `test-other`
- **Parakeet Ultra (File)**: 1.66% WER on `test-clean`, 2.55% on `test-other`
- **Apple Native Transcriber (File)**: 2.12% WER on `test-clean`, 3.97% on `test-other`

Efficiency gains are also notable: Parakeet processes one hour of file audio in 20 to 40 seconds (or 1.5 to 2.5 minutes for live streams) while requiring approximately 100 MB of RAM once compiled by Core ML. Evaluating probabilities directly in `AnyDecisionModel` also eliminates the token overhead typically associated with text generation, unlike cloud LLM workflows where unoptimized background calls [burn through token budgets](/posts/claude-code-background-agent-summaries-burn-up-to-20percent-of-token-budgets/).

## What to do next

Developers targeting iOS or macOS can import `AnySpeechRecognizer` and swap the default transcriber engine. To use Parakeet v3 for local processing, set up `SpeechTranscriber` with the core model variant:

```swift
let transcriber = SpeechTranscriber(
    model: ParakeetSpeechModel(variant: .v3),
    transcriptionOptions: [],
    reportingOptions: [.volatileResults],
    attributeOptions: [.audioTimeRange]
)
```

For multi-speaker transcription, pair the transcriber with `SpeakerDiarizer`:

```swift
let diarizer = SpeakerDiarizer(model: SortformerDiarizationModel())
if let request = try await AssetInventory.assetInstallationRequest(
    supporting: [transcriber, diarizer]
) {
    try await request.downloadAndInstall()
}
let analyzer = SpeechAnalyzer(modules: [transcriber, diarizer])
```

For Asian language transcription using Qwen3-ASR, pass explicit language identifiers such as Cantonese (`yue`):

```swift
let transcriber = SpeechTranscriber(
    model: QwenSpeechModel(variant: .large, language: Locale.Language(identifier: "yue")),
    transcriptionOptions: [],
    reportingOptions: [],
    attributeOptions: []
)
```

### Limitations & Caveats
- **Qwen3-ASR Constraints**: Unlike Parakeet, Qwen3-ASR does not provide real-time volatile results, word-level timestamps, or confidence scores. It requires several gigabytes of GPU memory and is significantly slower, making it better suited for static file analysis than real-time streaming.
- **Overlapping Audio Performance**: Benchmark performance drops significantly in noisy or unstructured multi-speaker environments. On the AMI meeting dataset, all engines recorded word error rates exceeding 23%.
- **Asset Sizes**: Model weights downloaded on demand from Hugging Face Hub range from ~600 MB for Parakeet (plus ~590 MB for optional live-input encoders) up to 2.4 GB for Qwen3-ASR 1.7B, alongside ~250 MB for the Sortformer diarization module.

## Sources

- [Hugging Face Blog: Open Models for Speech and Decisions on Apple Platforms](https://huggingface.co/blog/anydecisionmodel)
