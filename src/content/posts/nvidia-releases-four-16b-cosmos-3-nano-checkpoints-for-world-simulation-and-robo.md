---
title: >-
  NVIDIA Releases Four 16B Cosmos 3 Nano Checkpoints for World Simulation and
  Robotics
published: 2026-11-06T01:12:42.046Z
draft: false
description: >-
  NVIDIA open-sources four 16B Cosmos 3 Nano checkpoints for multi-view driving
  generation, streaming simulation, and robotics action prediction.
tags:
  - AI
  - Open Source
  - ai-news
  - open-source-llms
  - model-release
category: AI News
author: LockDraft
sourceLink: 'https://huggingface.co/blog/nvidia/cosmos-interactive-world-simulation'
---

## What changed

NVIDIA released four open-weight 16-billion (16B) trainable parameter checkpoints in its Cosmos 3 Nano model family under the OpenMDW1.1 license, which allows commercial and non-commercial usage. The post-trained models focus on generating interactive world simulations, multi-sensor driving environments, and action-conditioned robotics video.

The released checkpoints include:

*   **Cosmos3-Nano-Transfer-Auto:** A bidirectional model for offline multi-sensor driving data generation. It outputs synchronized video across up to 11 camera views (including fisheye lenses) and supports joint RGB and LiDAR generation controlled by World Scenario Maps (WSMs), text prompts, and aligned HD-map range controls.
*   **Cosmos3-Nano-Sim-Auto:** A causally distilled, streaming variant of Transfer-Auto. It generates successive chunks of synchronized camera and LiDAR data using rolling history and updated driving controls in a few denoising steps.
*   **Cosmos3-Nano-Sim-Transfer:** Renders photorealistic RGB video observations from spatial simulator inputs (depth maps, segmentation masks, edge outlines, and blur filters) combined with text prompts.
*   **Cosmos3-Nano-Sim-Bimanual:** Simulates visual environment changes driven by two-arm robot actions for YAM and AgiBot hardware embodiments. It uses an action schema with 59 control values (padded to 64 during training) covering coordinate frames, rotations, gripper calibration, validity masks, and control domains.

The underlying architecture uses a Mixture-of-Transformers backbone that links text-processing and visual-generation networks through temporal-causal attention and key/value (KV) caching. Operations run on compressed video representations where one latent time step equals four RGB frames. Transfer-Auto predicts one step per chunk, while the optimized Sim-Bimanual setup predicts two steps.

The released technical documentation outlines a multi-stage post-training pipeline for these models:

*   **Stage 0 (Bidirectional adaptation):** Learns domain patterns and control-to-video mappings from recorded complete clips.
*   **Stage 1 (Teacher forcing):** Trains the network to predict video chunks from past observations and controls while masking future targets.
*   **Stage 2 (Consistency distillation):** Trains a student model using a frozen teacher to reduce generation time down to four denoising steps per chunk.

## Why it matters

Physical simulation engines handle rigid-body dynamics, contact forces, and state updates well, but generating photo-realistic, multi-sensor data directly from policy actions remains a challenge. Cosmos 3 Nano addresses this by separating physical state calculation from visual generation.

With `Sim-Transfer`, ground-truth physics remain inside the simulator, while the neural network converts spatial state controls into rendered video. For real-time driving applications, `Sim-Auto` combines causal attention with KV caching to continuously generate video rollouts where incoming driving signals immediately influence the next generated frame chunk. Additionally, the ability to adapt `Transfer-Auto` to custom camera layouts and LiDAR rigs allows teams to create synthetic datasets tailored to specific hardware setups before distilling them for interactive closed-loop evaluation.

## What to do next

Developers looking to deploy or fine-tune the Cosmos 3 Nano checkpoints require a Linux environment running Docker, NVIDIA GPUs, and the NVIDIA Container Toolkit. Inference tests in the published technical report were conducted using a vLLM-Omni setup on an NVIDIA GB200 system.

To build a custom driving pipeline:

1.  **Adapt domain data:** Fine-tune `Cosmos3-Nano-Transfer-Auto` on recorded sensor data to match specific camera positions, fisheye parameters, and LiDAR configurations.
2.  **Distill for streaming:** Apply causal training and consistency distillation to the adapted model to produce a fast, low-latency `Sim-Auto` streaming model.
3.  **Integrate closed-loop runtimes:** Connect `Sim-Auto` or `Sim-Bimanual` outputs to a simulation runtime and renderer capable of feeding updated WSM parameters or normalized 59-value action arrays back into the generator.

*Limitations and caveats:* NVIDIA notes that world models remain an active area of research. Developers must independently benchmark whether generated scenes faithfully support policy training without introducing visual artifacts or geometric inconsistencies that degrade real-world policy transfer.

For related LockDraft context, see [Ai2 Open-Sources AstaBrief 8B for Fast Scientific Report Generation](/posts/ai2-open-sources-astabrief-8b-for-fast-scientific-report-generation/).
## Sources

*   [NVIDIA Cosmos 3 Open Models for Interactive World Simulation (Hugging Face Blog)](https://huggingface.co/blog/nvidia/cosmos-interactive-world-simulation)
