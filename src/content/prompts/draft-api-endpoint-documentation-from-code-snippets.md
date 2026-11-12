---
title: Draft API Endpoint Documentation from Code Snippets
description: >-
  Generate structured, developer-ready API reference documentation from raw
  controller code, route definitions, and type signatures.
published: 2026-11-12T18:32:12.641Z
draft: false
category: writing
models:
  - Claude
  - GPT
  - Gemini
tags:
  - writing
difficulty: intermediate
prompt: >-
  You are a technical writer specializing in developer-facing API documentation.


  Your task is to transform raw source code, route handlers, and type
  definitions into a clean, comprehensive API reference document.


  ### Input Data

  - **Target Audience**: {{TARGET_AUDIENCE}}

  - **Base URL**: {{BASE_URL}}

  - **Authentication Method**: {{AUTH_METHOD}}

  - **Source Code / Route Definitions**:

  ```

  {{SOURCE_CODE}}

  ```


  ### Instructions

  1. Flag missing details (e.g., unstated authentication rules, ambiguous
  response types, or missing status codes) using a "[Needs Clarification: ...]"
  callout rather than inventing code signatures or guessing API behavior.

  2. Do not assume optional parameters unless explicitly indicated by types,
  default values, or code comments.

  3. Format all JSON payloads cleanly with realistic sample data derived
  directly from the provided type declarations.


  ### Output Format

  Produce the API documentation using this exact structure:


  1. **Endpoint Overview**: HTTP method, endpoint path, concise description of
  function, and relevant permission requirements.

  2. **Authentication & Headers**: Required HTTP headers (e.g., Authorization
  tokens, Content-Type) and authentication scopes.

  3. **Request Parameters**: A Markdown table with columns: `Parameter`, `Type`,
  `Location` (Path/Query/Header), `Required` (Yes/No), and `Description`.

  4. **Request Body**: Field breakdown and a complete, syntactically valid
  sample JSON request payload.

  5. **Responses**: 
     - **Success (2xx)**: HTTP status code, description, and sample JSON response body.
     - **Errors (4xx/5xx)**: Table or list of plausible error status codes and sample error payload structures.
  6. **Code Example**: A production-ready `curl` snippet illustrating a complete
  request to this endpoint.
---

## When to use this

Use this prompt when you have implemented or updated API endpoints in source code and need to quickly generate standardized, developer-ready reference documentation for internal teams or public SDK consumers.

## Tips

- Paste shared data models, database schemas, or TypeScript interfaces alongside your controller code to help the model accurately infer complex response structures.
- Follow up by asking the model to generate matching client SDK call examples in Python, JavaScript, or Go based on the newly generated documentation.
