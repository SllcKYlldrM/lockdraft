---
title: >-
  Google Releases Gemini Omni 1.2 Flash with 15-Second Video Generation and 30%
  Price Cut
published: 2026-11-07T06:40:53.888Z
draft: false
description: >-
  Google released Gemini Omni 1.2 Flash with native 15-second video generation,
  multi-turn editing, and a 30 percent drop in API pricing.
tags:
  - API
  - ai-news
  - model-release
category: AI News
author: LockDraft
sourceLink: >-
  https://blog.google/innovation-and-ai/technology/developers-tools/introducing-gemini-omni-1-2-flash/
---

## What changed
Google DeepMind has announced the general availability of Gemini Omni 1.2 Flash across the Gemini API, Google Cloud console, and Google Workspace tools. The updated video generation model introduces several key capability and infrastructure upgrades over version 1.1:

- **Extended Clip Durations:** Native generation length expands from 10 seconds to 15 seconds. Users can specify clip durations in one-second increments anywhere between 3 and 15 seconds.
- **Lower Pricing and Tiered Resolution Workflows:** API pricing drops 30% from version 1.1 down to $0.07 per second for 720p output. The recommended workflow allows developers to draft fast at 360p or 720p, refine output with targeted edits, and upscale final assets to 1080p or 4K.
- **Multi-Turn Conversational Editing:** Rather than re-rendering a prompt from scratch, developers and creators can modify generated clips turn-by-turn—adjusting parameters such as background environments, lighting, weather conditions, aspect ratios, or featured products across full 15-second assets.
- **Stronger Reference Adherence:** Omni 1.2 Flash accepts character, product, or style images, short motion clips up to three seconds, and audio input. The model maintains consistency across camera angles for elements like facial features, apparel drape, typography, and brand colors.
- **Audio Lip-Sync and Camera Steering:** The update adds multi-speaker voice conditioning paired with natural lip-sync timing. It also improves continuous camera controls, enabling sweeping FPV drone flythroughs, orbits, and zooms with fewer jump cuts.

For enterprise deployments, outputs include imperceptible SynthID watermarks, and backend infrastructure supports Google Cloud Provisioned Throughput.

## Why it matters
High generation costs and visual inconsistency across frames have historically made AI video difficult to integrate into production automation pipelines. By enabling multi-turn conversational edits instead of full clip re-generations, Gemini Omni 1.2 Flash reduces wasted compute when fine-tuning small details. 

Combined with a baseline price drop to $0.07 per second and low-resolution drafting options, the update targets high-volume commercial use cases like virtual try-on assets, localized ad variants, and product catalog videos. Developers evaluating multi-turn API architectures and execution costs across platforms—similar to strategies outlined when [architecting with enterprise API surfaces](/posts/architecting-with-claude-an-in-depth-developers-guide-to-anthropics-api-surface/)—will find the iterative editing model key to controlling generation overhead.

Google acknowledged that technical limitations remain. Development is still ongoing to resolve issues with high-speed sports action, rapid mid-clip script changes, and complex physical interactions.

## What to do next
Developers can test prompts and inspect parameters in Google AI Studio, access official SDK documentation, or deploy production workloads through the Gemini API and Google Cloud console. End users can access 15-second clip creation features directly within Google Vids and Flow.

## Sources
- [Google AI Blog: Gemini Omni 1.2 Flash: Fast and cost-effective with longer clips](https://blog.google/innovation-and-ai/technology/developers-tools/introducing-gemini-omni-1-2-flash/)
