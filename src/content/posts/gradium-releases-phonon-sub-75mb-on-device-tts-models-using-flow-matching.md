---
title: 'Gradium Releases Phonon: Sub-75MB On-Device TTS Models Using Flow Matching'
published: 2026-11-05T12:50:52.198Z
draft: false
description: >-
  Gradium has released Phonon, a suite of lightweight text-to-speech models
  running on-device with top ranks on the Open TTS Leaderboard.
tags:
  - AI
  - Open Source
  - ai-news
  - open-source-llms
  - model-release
category: AI News
author: LockDraft
sourceLink: 'https://huggingface.co/blog/phonon-tts'
---

## What changed

Gradium has released Phonon, an open-weights text-to-speech (TTS) model family designed to run entirely locally without cloud dependencies. Derived from the Pocket TTS lineage, Phonon uses flow matching to generate audio latents autoregressively rather than relying on standard codec generation techniques.

The release includes two model variants:
- **Phonon 31m**: A ~65 MB model (~30.8 million model parameters plus ~10.3 million audio tokenizer parameters) focused on English and released under the Apache 2.0 license.
- **Phonon 40m**: A ~75 MB multi-language model supporting English, French, German, Spanish, and Portuguese under a CC BY-NC non-commercial license.

Phonon handles audio tokenization using a decoder-only setup where voices are represented as speaker latent tensors (stored in `safetensors` format via `gradium/phonon-voices`) rather than raw audio files. Input formatting relies on Hugging Face chat templates, expanding voice placeholders directly into prompt latents.

For execution, two primary runtimes are available:
1. **`ptts` framework**: A lightweight inference engine built for single-stream local performance across more than 10 backends, including CPU (Intel, Arm, WebAssembly), GPU (CUDA, Vulkan, Metal, WebGPU), and NPU targets (Apple Core ML, Snapdragon).
2. **Hugging Face `transformers` (v5.21+)**: Native PyTorch support via `GradiumPhononTTSForConditionalGeneration` and `AutoProcessor`, optimized for GPU throughput, batched synthesis, and full-graph `torch.compile` execution.

On the Hugging Face Open TTS Leaderboard, Phonon achieved first place for intelligibility in German and Spanish, placed in the top three across all tested languages against models up to 100 times larger, and topped the CPU streaming benchmark for time-to-first audio.

## Why it matters

Traditional voice synthesis pipelines depend on cloud-hosted API infrastructure, introducing network latency, offline failure modes, and per-character runtime fees. Moving voice synthesis directly to the client side guarantees privacy and continuous operation without network connectivity.

While developers integrating cloud models must manage network overhead and usage billing—topics often addressed when [architecting with Claude](/posts/architecting-with-claude-an-in-depth-developers-guide-to-anthropics-api-surface/)—Phonon shifts the workload to local client chips. Fitting a high-quality model into a 65–75 MB memory envelope allows local voice synthesis inside web browsers, mobile apps, single-board computers, and wearable devices.

Commercial terms for the 40m multi-language model also diverge from cloud conventions: licensing fees are tied to active user counts rather than audio generation volume.

## What to do next

To integrate Phonon into existing PyTorch pipelines, install `transformers` v5.21 or later and load the model directly:

```python
from transformers import AutoProcessor, GradiumPhononTTSForConditionalGeneration
from huggingface_hub import hf_hub_download
from safetensors.torch import load_file

model_id = "gradium/phonon-31m-en"
processor = AutoProcessor.from_pretrained(model_id, device_map="auto")
model = GradiumPhononTTSForConditionalGeneration.from_pretrained(model_id, device_map="auto")

# Load precomputed speaker latents
path = hf_hub_download("gradium/phonon-voices", "voices/LMDIYE0Oa377Qh6Z.safetensors")
voice = load_file(path)["speaker_wavs"][0].T

# Prepare input using the chat template
conversation = [
    {"role": "user", "content": [{"type": "audio"}, {"type": "text", "text": "Hello from Phonon."}]}
]
inputs = processor.apply_chat_template(
    conversation,
    tokenize=True,
    return_dict=True,
    add_generation_prompt=True,
    processor_kwargs={"audio_prompt_latents": [voice]},
).to(model.device)

# Generate latents and decode to audio
outputs = model.generate(**inputs)
audio = processor.decode(outputs.audio_latents, outputs.audio_latents_mask)
processor.save_audio(audio, "output.wav")
```

For low-latency single-stream applications targeting browser environments, mobile hardware, or NPUs, use the native `ptts` engine instead of PyTorch.

### Limitations and caveats
- **License restrictions**: Only the 31m English checkpoint carries an Apache 2.0 license. The 40m multi-language model requires a commercial agreement based on user counts for commercial use cases.
- **Training stability**: The underlying flow-matching architecture was numerically unstable during initial development, requiring specific training modifications to stabilize multi-language outputs.

## Sources

- [Hugging Face Blog: A Closer Look at Phonon TTS](https://huggingface.co/blog/phonon-tts)
