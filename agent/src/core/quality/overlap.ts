function normalize(text: string): string[] {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, " ")
    .split(/\s+/)
    .filter(Boolean);
}

function ngrams(words: string[], n: number): Set<string> {
  const set = new Set<string>();
  for (let i = 0; i <= words.length - n; i++) {
    set.add(words.slice(i, i + n).join(" "));
  }
  return set;
}

/**
 * Returns the fraction of the article body's 8-word sequences that also
 * appear verbatim in the source text — a cheap, deterministic guard
 * against the writer lifting phrasing instead of rewriting it. 0 means
 * no overlap, 1 means the body is a near-copy.
 */
export function overlapRatio(body: string, sourceText: string): number {
  const bodyWords = normalize(body);
  const sourceWords = normalize(sourceText);
  if (bodyWords.length < 8 || sourceWords.length < 8) return 0;

  const bodyGrams = ngrams(bodyWords, 8);
  const sourceGrams = ngrams(sourceWords, 8);
  if (bodyGrams.size === 0) return 0;

  let overlapping = 0;
  for (const gram of bodyGrams) {
    if (sourceGrams.has(gram)) overlapping++;
  }
  return overlapping / bodyGrams.size;
}
