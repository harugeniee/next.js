import { useQuery } from "@tanstack/react-query";

import type {
  AnalyticsQueryParams,
  DashboardQueryParams
} from "@/lib/api/analytics";
import { AnalyticsAPI } from "@/lib/api/analytics";
import { queryKeys } from "@/lib/utils/query-keys";

/**
 * Hook for fetching dashboard overview analytics
 */
export function useDashboardOverview(params?: DashboardQueryParams) {
  return useQuery({
    queryKey: queryKeys.analytics.dashboard.overview(params),
    queryFn: () => AnalyticsAPI.getDashboardOverview(params),
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
    retry: 3,
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
  });
}

/**
 * Hook for fetching analytics trends (time series data)
 */
export function useAnalyticsTrends(params?: DashboardQueryParams) {
  return useQuery({
    queryKey: queryKeys.analytics.dashboard.trends(params),
    queryFn: () => AnalyticsAPI.getAnalyticsTrends(params),
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
    retry: 3,
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
  });
}

/**
 * Hook for fetching top performing content
 */
export function useTopContent(params?: DashboardQueryParams) {
  return useQuery({
    queryKey: queryKeys.analytics.dashboard.topContent(params),
    queryFn: () => AnalyticsAPI.getTopContent(params),
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
    retry: 3,
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
  });
}

/**
 * Hook for fetching user engagement metrics
 */
export function useUserEngagement(params?: DashboardQueryParams) {
  return useQuery({
    queryKey: queryKeys.analytics.dashboard.userEngagement(params),
    queryFn: () => AnalyticsAPI.getUserEngagement(params),
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
    retry: 3,
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
  });
}

/**
 * Hook for fetching platform overview statistics
 */
export function usePlatformOverview() {
  return useQuery({
    queryKey: queryKeys.analytics.platform.overview(),
    queryFn: () => AnalyticsAPI.getPlatformOverview(),
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
    retry: 3,
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
  });
}

/**
 * Hook for fetching analytics events with pagination
 */
export function useAnalyticsEvents(params?: AnalyticsQueryParams) {
  return useQuery({
    queryKey: queryKeys.analytics.events(params),
    queryFn: () => AnalyticsAPI.getAnalyticsEvents(params),
    staleTime: 2 * 60 * 1000, // 2 minutes
    gcTime: 5 * 60 * 1000, // 5 minutes
    retry: 3,
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
  });
}
