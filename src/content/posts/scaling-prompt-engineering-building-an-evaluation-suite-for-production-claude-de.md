---
title: >-
  Scaling Prompt Engineering: Building an Evaluation Suite for Production Claude
  Deployments
published: 2026-10-08T15:51:48.583Z
draft: false
description: >-
  Move beyond basic prompting. Learn how to structure prompts for systematic
  testing and build an automated evaluation harness for Claude models.
tags:
  - claude
  - automation
  - tutorial
category: Tutorials
author: LockDraft
---

## Beyond Basic Prompting: The Production Evaluation Gap

When developers begin working with large language models, they typically start in a web playground. They experiment with system prompts, adjust instructions, and run a handful of manual test cases. If those test cases pass, the prompt is deemed ready for production. This phase of development is covered in detail in our guide on [Prompt Engineering Basics: Structure Beats Cleverness](/posts/prompt-engineering-basics/), which details how structural clarity and clean segmentation prevent models from losing track of instructions.

However, moving from a working prototype to a reliable production service exposes a major gap: **manual verification does not scale**. 

A prompt that works perfectly for five sample queries might fail catastrophically on the fifty-first. Worse, when you modify a prompt to fix a newly discovered edge case, you risk introducing regressions that break previously working scenarios. Without a systematic, programmatic way to evaluate your prompts, you are engineering in the dark.

To build resilient AI applications using current models—such as Claude Sonnet 5.5, Claude Fable 5.1, or Claude Haiku 5.5—you must treat your prompts as code. This means establishing an evaluation suite that runs automated assertions against your model's outputs. This guide walks through how to structure your prompts specifically for programmatic evaluation and how to build a local evaluation harness to run those tests.

---

## Structuring Prompts for Programmatic Evaluation

To automate the evaluation of an LLM's output, the output itself must be predictable in structure. If a model returns a free-form paragraph on one run and a bulleted list on the next, your evaluation scripts will fail to parse the content. 

### The Role of XML Tagging in Automated Verification

Using XML tags is one of the most reliable ways to enforce structure in Claude's outputs. XML tags allow you to segment instructions, examples, and inputs within your prompt. More importantly, they allow you to instruct the model to wrap its final answers, reasoning steps, or metadata in specific tags that your evaluation scripts can easily extract using regular expressions or standard XML parsers.

For example, instead of asking Claude to "output the result at the end," you should explicitly instruct it to place its final answer inside `<output>` tags, and its step-by-step reasoning inside `<thinking>` tags.

Consider this structured prompt template:

```xml
<system>
You are an expert data extraction assistant. Your task is to extract key entities from the provided text.
</system>

<instructions>
1. Read the text provided in the <input_text> tags.
2. Extract the primary organization name and the primary individual mentioned.
3. Provide your step-by-step reasoning inside <thinking> tags.
4. Provide the final extracted JSON object inside <output_json> tags with "organization" and "individual" keys.
</instructions>

<input_text>
{{INPUT_TEXT}}
</input_text>
```

With this structure, your evaluation script does not need to parse the entire text block. It can target the `<output_json>` block directly, parse the JSON, and run assertions on the specific keys.

### Designing Diverse and Isolated Few-Shot Examples

When basic zero-shot prompts fail, few-shot prompting (providing examples of input-output pairs) is the standard remedy. However, poorly structured examples can confuse the model. 

To make examples evaluable and prevent the model from picking up unintended patterns:
* **Wrap examples in container tags**: Use `<examples>` as the parent container, and individual `<example>` tags for each pair.
* **Ensure diversity**: Do not use identical formats or repeated dummy values in your examples. If every example uses "Company A" as the organization, the model may over-generalize.
* **Keep them relevant**: Ensure the examples closely match the complexity of the actual production data.

---

## Building a Local Evaluation Harness

To run evaluations, you need a test runner. Below is a complete, runnable Python script that demonstrates how to evaluate prompt variations against a local dataset. 

This script simulates running test cases against an LLM, parses the XML tags from the response, and evaluates the output against defined success criteria (e.g., checking if the extracted JSON is valid and contains the expected keys).

```python
import re
import json
from typing import Dict, List, Any

# Simulated LLM Client for demonstration purposes
class MockClaudeClient:
    def generate(self, prompt: str) -> str:
        # Simulated responses based on the input text to show how evals catch errors
        if "Acme Corp" in prompt:
            # Correct response
            return """
            <thinking>
The text mentions Acme Corp as the primary organization and Jane Doe as the founder.
            </thinking>
            <output_json>
            {
                "organization": "Acme Corp",
                "individual": "Jane Doe"
            }
            </output_json>
            """
        elif "Beta LLC" in prompt:
            # Faulty response (missing individual key, malformed JSON)
            return """
            <thinking>
Found Beta LLC, but no person is mentioned.
            </thinking>
            <output_json>
            {
                "organization": "Beta LLC"
            
            """  # Malformed JSON
        else:
            # Incorrect data extracted
            return """
            <thinking>
Analyzing the text.
            </thinking>
            <output_json>
            {
                "organization": "Unknown",
                "individual": "None"
            }
            </output_json>
            """

# Helper function to extract content from XML tags
def extract_tag_content(text: str, tag_name: str) -> str:
    pattern = f"<{tag_name}>(.*?)</{tag_name}>"
    match = re.search(pattern, text, re.DOTALL)
    return match.group(1).strip() if match else ""

# Evaluation Suite
class PromptEvaluator:
    def __init__(self, client: MockClaudeClient):
        self.client = client

    def run_eval(self, test_cases: List[Dict[str, Any]], prompt_template: str) -> Dict[str, Any]:
        results = []
        passed_count = 0

        for case in test_cases:
            # Format prompt with the test case input
            prompt = prompt_template.replace("{{INPUT_TEXT}}", case["input"])
            
            # Get model response
            raw_response = self.client.generate(prompt)
            
            # Extract structured sections
            thinking = extract_tag_content(raw_response, "thinking")
            json_str = extract_tag_content(raw_response, "output_json")
            
            # Validate output
            passed = False
            error_message = ""
            parsed_data = {}

            try:
                parsed_data = json.loads(json_str)
                # Check if expected keys exist and match the ground truth
                expected_org = case["expected"]["organization"]
                expected_ind = case["expected"]["individual"]
                
                if parsed_data.get("organization") == expected_org and parsed_data.get("individual") == expected_ind:
                    passed = True
                else:
                    error_message = f"Expected organization '{expected_org}' and individual '{expected_ind}', got {parsed_data}"
            except json.JSONDecodeError:
                error_message = "Failed to parse output_json as valid JSON"
            except Exception as e:
                error_message = str(e)

            if passed:
                passed_count += 1

            results.append({
                "input": case["input"],
                "passed": passed,
                "error": error_message,
                "thinking": thinking,
                "extracted": parsed_data
            })

        return {
            "accuracy": passed_count / len(test_cases),
            "details": results
        }

# --- Execution Block ---
if __name__ == "__main__":
    # 1. Define test cases (our ground truth)
    dataset = [
        {
            "input": "Acme Corp was founded by Jane Doe in 2021.",
            "expected": {"organization": "Acme Corp", "individual": "Jane Doe"}
        },
        {
            "input": "Beta LLC announced its new restructuring plan today.",
            "expected": {"organization": "Beta LLC", "individual": "None"}
        }
    ]

    # 2. Define the prompt template under test
    template = """
    <instructions>
    Extract the organization and individual from the input text below.
    Provide reasoning in <thinking> tags and the result in <output_json> tags.
    </instructions>
    <input_text>
    {{INPUT_TEXT}}
    </input_text>
    """

    # 3. Run evaluation
    client = MockClaudeClient()
    evaluator = PromptEvaluator(client)
    report = evaluator.run_eval(dataset, template)

    # 4. Print results
    print(f"Evaluation Accuracy: {report['accuracy'] * 100:.1f}%")
    print("=" * 40)
    for idx, detail in enumerate(report["details"]):
        status = "PASS" if detail["passed"] else "FAIL"
        print(f"Case {idx + 1}: {status}")
        print(f"Input: {detail['input']}")
        if not detail["passed"]:
            print(f"Error: {detail['error']}")
        print("-" * 40)
```

---

## Model-Specific Nuances and Evaluation Calibration

Not all Claude models behave identically. When structuring prompts and setting up evaluation metrics, you must calibrate your expectations based on the specific model family and version you are targeting. A prompt optimized for Claude Sonnet 5.5 may exhibit different formatting or instruction-following tendencies when run on Claude Fable 5.1.

Below is a summary of key behavioral differences among current models that impact prompt design and evaluation strategy:

| Model Family | Key Behavioral Characteristics | Impact on Prompting & Evaluation |
| :--- | :--- | :--- |
| **Claude Fable 5.1 / Claude Mythos 5.1** | Supports adjustable effort levels; handles long, multi-step tasks natively; returns user-facing progress updates. Passes thinking blocks back unchanged. Supports tool-call batching. | Evals must account for thinking blocks remaining intact in the response. Check if progress updates interfere with parsing scripts. |
| **Claude Fable 5 / Claude Mythos 5** | Includes effort levels and a specific `reasoning_extraction` refusal category. Improved instruction following over older generations. | Assertions should check for the `reasoning_extraction` refusal pattern to handle edge-case rejections cleanly. |
| **Claude Sonnet 5.5** | Calibrated effort; can run without up-front thinking; outputs structured JSON on reasoning tasks; supports mid-turn user messages. | For pure reasoning tasks, you can evaluate JSON directly without wrapping it in custom XML parsing blocks. |
| **Claude Sonnet 5** | Literal instruction following; distinct defaults for design and frontend tasks. | Requires highly explicit constraints; vague instructions will lead to literal but unhelpful outputs. |
| **Claude Opus 5.5** | Calibrated effort; optimized for running with thinking disabled; handles complex visual inputs. | Ensure evaluations cover visual input regression if leveraging multimodal capabilities. |
| **Claude Opus 5** | Focuses on self-correction and subagent control; longer and more verbose written deliverables. | Evals must check for verbosity limits or parse out key elements from long-form text. |
| **Claude Haiku 5.5** | Supports adjustable effort levels; handles JSON output with custom tools; early stopping in long agent loops; mid-turn user messages. | Highly efficient for high-throughput tasks. Evals must monitor for early-stopping limits on long-running tasks. |

### Handling Model Drift and Migration

When migrating your production application from an older model (such as Claude Opus 4.8 or Claude Sonnet 5) to a newer release (such as Claude Sonnet 5.5 or Claude Fable 5.1), you should never assume your prompt will behave exactly the same way.

Common issues during model migration include:
1. **Verbosity Changes**: A newer model may be significantly more verbose, which can break strict parsing rules or exceed token budgets.
2. **Instruction Sensitivity**: A model that follows instructions more literally (like Claude Sonnet 5) might ignore implicit assumptions that a previous model (like Claude Opus 4.8) inferred correctly.
3. **Refusal Behavior**: Changes in safety filters and safeguard refusals can cause previously successful inputs to return refusal errors.

By keeping your evaluation suite independent of the model API, you can run the exact same test dataset against both the old and new models. This allows you to compare accuracy side-by-side and identify regressions before changing your production routing.

---

## Best Practices for Maintaining Evals in Production

To make prompt evaluation a natural part of your development lifecycle, follow these operational guidelines:

* **Run Evals on Every Prompt Change**: Treat your prompt file as code. Any change to a system prompt, instruction block, or few-shot example must trigger your evaluation harness.
* **Keep Your Test Dataset Versioned**: Store your evaluation datasets (inputs and ground-truth outputs) in version control alongside your application code.
* **Use Real Production Edge Cases**: When a user reports an issue where the model failed, do not just patch the prompt. Extract the failing input, add it to your evaluation dataset with the corrected expected output, and then modify the prompt until the entire test suite passes.
* **Isolate Variables**: When testing prompt improvements, change one element at a time (e.g., only adjust the system prompt role, or only modify the XML tags) so you can isolate which change caused an increase or decrease in accuracy.

By moving from manual "vibe-based" testing to programmatic verification, you ensure that your Claude-powered applications remain stable, predictable, and performant as your prompts and underlying models evolve.

---

## Sources

This analysis is based on the official guidelines and technical documentation provided by Anthropic:
* Anthropic Claude Prompt Engineering Guide: [Be Clear and Direct](https://docs.claude.com/en/docs/build-with-claude/prompt-engineering/be-clear-and-direct)
