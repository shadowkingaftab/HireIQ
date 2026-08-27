import { useQuery } from "@tanstack/react-query";
import { useEffect } from "react";

/**
 * Domain data access with honest provenance.
 *
 * Strategy: attempt the REAL backend endpoint via React Query. If it fails
 * (endpoint missing, 404/501 stubs, network) or returns empty/null, fall back
 * to the demonstration dataset and mark the result `source: "demo"`.
 *
 * Consumers MUST render <DataSourceBadge source={result.source} /> (or the
 * DemoDataBanner) so synthetic data is never mistaken for live data.
 */
export function useDomainData(key, fetchLive, demoValue, options = {}) {
  const query = useQuery({
    queryKey: Array.isArray(key) ? key : [key],
    queryFn: async () => {
      try {
        const data = await fetchLive();
        const isEmpty =
          data == null ||
          (Array.isArray(data) && data.length === 0);
        if (isEmpty) return { source: "demo", data: demoValue };
        return { source: "live", data };
      } catch {
        return { source: "demo", data: demoValue };
      }
    },
    staleTime: 5 * 60 * 1000,
    retry: 0,
    ...options,
  });

  return {
    ...query,
    data: query.data?.data,
    source: query.data?.source ?? "loading",
    isDemo: query.data?.source === "demo",
    isLive: query.data?.source === "live",
  };
}

/** Tracks which surfaces have announced their demo status this session. */
const announced = new Set();

export function useAnnounceDemoSource(pageKey, isDemo) {
  useEffect(() => {
    if (isDemo && !announced.has(pageKey)) {
      announced.add(pageKey);
    }
  }, [pageKey, isDemo]);
}
