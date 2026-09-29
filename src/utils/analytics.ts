export type AnalyticsValue = string | number | boolean | undefined;
export type AnalyticsParams = Record<string, AnalyticsValue>;

export function trackEvent(name: string, params: AnalyticsParams = {}): void {
	if (typeof window === "undefined") return;

	if (window.lockdraftAnalytics) {
		window.lockdraftAnalytics.trackEvent(name, params);
		return;
	}

	window.dispatchEvent(
		new CustomEvent("lockdraft:analytics", {
			detail: { name, params },
		}),
	);
}
