---
title: 'Liquid AI Releases LFM3: Specialized Multimodal Models on a Single Backbone'
published: 2026-10-28T15:48:58.087Z
draft: false
description: >-
  Liquid AI introduces LFM3, a multimodal family built on a shared
  1.7B-parameter backbone. Includes text, vision, audio, and omni models
  optimized for edge deplo
tags:
  - ai-news
  - open-source-llms
  - model-release
category: AI News
author: LockDraft
sourceLink: 'https://huggingface.co/blog/LiquidAI/lfm3'
---

## What changed

Liquid AI has released LFM3, a new generation of foundation models designed as starting points for specialized intelligence. The release centers on LFM3-1.7B-Base, a backbone that supports six distinct models ranging from 1.7B to 2B parameters across text, vision, audio, omni, and decision modalities.

The architecture introduces a tri-hybrid layer mix within its 24-layer design. This combines 13 gated short convolutions with an expanded kernel size of 7, five sliding-window attention layers using a 256-token window, and six global attention layers. Additional structural updates include head-wise gated attention, where a sigmoid gate allows individual heads to deactivate, and partial RoPE, which rotates only the highest-frequency half of heads in global attention layers to maintain content matching across distances. A sandwich normalization scheme applies scaling to both inputs and outputs of each block.

Training involved pre-training on 22 trillion tokens followed by a 3.5-trillion-token mid-training phase focused on curated data rich in agentic traces and tool calls. This extended the context window to 256K tokens.

Compared to the previous LFM2 family, LFM3 delivers significant density improvements. LFM3-1.7B outperforms LFM2.5-2.6B while using 35% fewer parameters. The vision encoder is three times more compute-efficient than the SigLIP2 encoder used in prior models, requiring 2.2x fewer FLOPs while matching the accuracy of Qwen3.5-2B's vision encoder. For video processing, the encoder embeds sampled frame pairs into single temporal slices, halving sequence length.

The model lineup includes:

*   **LFM3-1.7B:** Text-to-text model optimized for local agents, tool calling, and domain-specific fine-tuning.
*   **LFM3-VL-2B:** Vision-language model supporting images and video input. It features step-by-step reasoning and achieves a 71.4 average across 62 vision benchmarks, comparable to Gemma 4 12B despite having fewer parameters.
*   **LFM3-Audio-2B:** Handles voice chat, speech recognition, synthesis, and translation across 18 languages. It uses a causal audio encoder allowing prefills during speech, with time to first token as low as 50 ms.
*   **LFM3-Omni-2B:** Combines text, images, video, and audio inputs with text and speech outputs.
*   **d1-2B and d1-omni-2B:** Decision models providing calibrated answers derived from the VL and Omni backbones.

## Why it matters

LFM3 prioritizes on-device deployment and rapid specialization. The text model occupies approximately 1 GB at 4-bit precision, enabling agent execution on edge hardware. The architecture search covered 14 device and backend combinations, including phones, Raspberry Pi 5, laptops, and Qualcomm Hexagon NPUs.

Agentic performance shows substantial gains. LFM3-1.7B scored 38.42 on WebArena-Verified, compared to 3.02 for its predecessor, and surpassed Qwen3.5-9B on long-duration tasks within browsers and business applications. The audio pipeline supports streaming decoding via LiquidCodec, achieving 87x real-time conversion speed on a single CPU thread of an Apple M4 Max.

Development workflows are streamlined for adaptation. Each modality branches from the shared base, allowing developers to select the appropriate model, fine-tune on personal data using a single GPU, and deploy locally without managing multiple large general-purpose models.

## What to do next

Models are available via the `transformers` library. To run the text model, update the library and load the pipeline:

```python
from transformers import pipeline

generator = pipeline(
    "text-generation",
    model="LiquidAI/LFM3-1.7B",
    trust_remote_code=True,
)
```

For the vision-language model, ensure `transformers` version 5.21.0 or higher is installed along with vision dependencies:

```bash
pip install "transformers>=5.21.0" torch torchvision pillow
```

Refer to the model cards for detailed inference configurations, tool calling instructions, and compatibility with engines like llama.cpp.

## Limitations and Caveats

The claim regarding 1 GB footprint applies specifically to the text model at 4-bit quantization. Vision and audio models require additional encoder components and may demand more memory depending on input resolution and duration. The d1 models output calibrated answers rather than standard text generations, which may affect downstream formatting. Audio streaming support depends on compatible decoders, and the causal audio feature requires hardware capable of low-latency processing to realize the sub-50 ms time to first token.

For related LockDraft context, see [Ai2 Open-Sources AstaBrief 8B for Fast Scientific Report Generation](/posts/ai2-open-sources-astabrief-8b-for-fast-scientific-report-generation/).
## Sources

- [Liquid AI Blog: Build specialized multimodal models with LFM3](https://huggingface.co/blog/LiquidAI/lfm3)
