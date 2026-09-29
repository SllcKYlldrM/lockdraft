/**
 * Optional future measurement inputs. These stay empty until real exports or
 * an approved API adapter supplies them; no synthetic traffic data belongs in
 * the growth decision path.
 */
export interface SearchConsoleSignal {
  query: string;
  impressions: number;
  clicks: number;
  ctr: number;
  position: number;
  page: string;
}

export interface Ga4Signal {
  event: "article_view" | "article_50_percent" | "article_90_percent" | "related_article_click" | "source_click" | "site_search" | "prompt_copy";
  page?: string;
  query?: string;
  count: number;
}

export interface GrowthSignals {
  searchConsole: SearchConsoleSignal[];
  ga4: Ga4Signal[];
}

export const growthSignals: GrowthSignals = {
  searchConsole: [],
  ga4: [],
};

export const growthWeights = {
  clusterGap: 30,
  pillarSupport: 20,
  evergreenValue: 20,
  userUsefulness: 15,
  sourceAvailability: 10,
  freshnessValue: 5,
  overlapRiskPenalty: 25,
} as const;
