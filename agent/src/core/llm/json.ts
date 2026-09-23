/**
 * Finds the end index (inclusive) of the JSON value starting at `start`,
 * tracking string/escape state so a `{`/`}`/`[`/`]` inside a JSON string
 * value doesn't get counted as real structure. This matters here more than
 * it would for typical LLM-JSON extraction: guide/news bodies are
 * Markdown containing code blocks and `[text](url)` links, so the body
 * string value routinely contains literal brackets, braces, and even
 * nested ``` fences of its own. Returns -1 if no balanced end is found.
 */
function findJsonEnd(text: string, start: number): number {
  const openChar = text[start];
  const closeChar = openChar === "{" ? "}" : "]";
  let depth = 0;
  let inString = false;
  let escaped = false;
  for (let i = start; i < text.length; i++) {
    const char = text[i];
    if (inString) {
      if (escaped) {
        escaped = false;
      } else if (char === "\\") {
        escaped = true;
      } else if (char === '"') {
        inString = false;
      }
      continue;
    }
    if (char === '"') {
      inString = true;
    } else if (char === openChar) {
      depth++;
    } else if (char === closeChar) {
      depth--;
      if (depth === 0) return i;
    }
  }
  return -1;
}

/**
 * Extracts the first top-level JSON value from an LLM text response.
 * Deliberately does NOT pre-extract a ```/``` fenced block first (the
 * previous approach): when the JSON's own string content contains a
 * nested fence — e.g. a guide body with its own ```json code example —
 * a naive "first ``` ... next ```" regex grabs the wrong pair and
 * truncates before the real JSON closes. Scanning the raw text directly
 * with a string-aware bracket matcher sidesteps that: any ``` inside a
 * JSON string is just text to the scanner, not a boundary.
 */
export function extractJson<T = unknown>(text: string): T {
  const start = text.search(/[[{]/);
  if (start === -1) {
    throw new Error(`No JSON found in LLM response: ${text.slice(0, 200)}`);
  }
  const end = findJsonEnd(text, start);
  if (end === -1) {
    throw new Error(`Unterminated JSON in LLM response: ${text.slice(0, 200)}`);
  }
  try {
    return JSON.parse(text.slice(start, end + 1)) as T;
  } catch (err) {
    throw new Error(
      `Malformed JSON in LLM response (${(err as Error).message}): ${text.slice(start, Math.min(end + 1, start + 300))}`,
    );
  }
}
