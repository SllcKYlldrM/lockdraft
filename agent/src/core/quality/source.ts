export interface SourceReadiness {
  ready: boolean;
  reason?: string;
}

export function isValidSourceUrl(value: string): boolean {
  try {
    const url = new URL(value);
    return url.protocol === "https:" || url.protocol === "http:";
  } catch {
    return false;
  }
}

export function assessSourceReadiness(text: string | undefined, minimumWords: number): SourceReadiness {
  const normalized = text?.replace(/\s+/g, " ").trim() ?? "";
  const words = normalized.split(/\s+/).filter(Boolean).length;
  if (!normalized) return { ready: false, reason: "source body is empty" };
  if (words < minimumWords) {
    return { ready: false, reason: `source has only ${words} usable words; needs at least ${minimumWords}` };
  }
  return { ready: true };
}
