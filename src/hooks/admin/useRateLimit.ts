import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import { useI18n } from "@/components/providers/i18n-provider";
import { RateLimitAPI } from "@/lib/api/rate-limit";
import type {
  ApiKey,
  CacheStats,
  CreateApiKeyDto,
  CreateIpWhitelistDto,
  CreatePlanDto,
  CreateRateLimitPolicyDto,
  IpWhitelist,
  Plan,
  PolicyMatchResponse,
  RateLimitPolicy,
  TestPolicyMatchDto,
  UpdateApiKeyDto,
  UpdateIpWhitelistDto,
  UpdatePlanDto,
  UpdateRateLimitPolicyDto,
} from "@/lib/interface/rate-limit.interface";
import { queryKeys } from "@/lib/utils/query-keys";

const STALE_TIME_5_MIN = 5 * 60 * 1000;
const GC_TIME_10_MIN = 10 * 60 * 1000;

/**
 * Hook for fetching rate limit plans
 */
export function usePlans(options?: { enabled?: boolean }) {
  return useQuery<Plan[], Error>({
    queryKey: queryKeys.rateLimit.plans(),
    queryFn: () => RateLimitAPI.getPlans(),
    enabled: options?.enabled !== false,
    staleTime: STALE_TIME_5_MIN,
    gcTime: GC_TIME_10_MIN,
    retry: 3,
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
  });
}

/**
 * Hook for fetching API keys
 */
export function useApiKeys(options?: { enabled?: boolean }) {
  return useQuery<ApiKey[], Error>({
    queryKey: queryKeys.rateLimit.apiKeys(),
    queryFn: () => RateLimitAPI.getApiKeys(),
    enabled: options?.enabled !== false,
    staleTime: STALE_TIME_5_MIN,
    gcTime: GC_TIME_10_MIN,
    retry: 3,
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
  });
}

/**
 * Hook for fetching IP whitelist
 */
export function useIpWhitelist(options?: { enabled?: boolean }) {
  return useQuery<IpWhitelist[], Error>({
    queryKey: queryKeys.rateLimit.ipWhitelist(),
    queryFn: () => RateLimitAPI.getIpWhitelist(),
    enabled: options?.enabled !== false,
    staleTime: STALE_TIME_5_MIN,
    gcTime: GC_TIME_10_MIN,
    retry: 3,
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
  });
}

/**
 * Hook for fetching rate limit policies
 */
export function usePolicies(options?: { enabled?: boolean }) {
  return useQuery<RateLimitPolicy[], Error>({
    queryKey: queryKeys.rateLimit.policies(),
    queryFn: () => RateLimitAPI.getPolicies(),
    enabled: options?.enabled !== false,
    staleTime: STALE_TIME_5_MIN,
    gcTime: GC_TIME_10_MIN,
    retry: 3,
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
  });
}

/**
 * Hook for fetching cache statistics
 */
export function useCacheStats(options?: { enabled?: boolean }) {
  return useQuery<CacheStats, Error>({
    queryKey: queryKeys.rateLimit.cacheStats(),
    queryFn: () => RateLimitAPI.getCacheStats(),
    enabled: options?.enabled !== false,
    staleTime: 30 * 1000, // 30 seconds for cache stats
    gcTime: GC_TIME_10_MIN,
    retry: 2,
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
  });
}

/**
 * Hook for rate limit mutations
 */
export function useRateLimitMutations() {
  const queryClient = useQueryClient();
  const { t } = useI18n();

  // Plan mutations
  const createPlanMutation = useMutation<Plan, Error, CreatePlanDto>({
    mutationFn: (data) => RateLimitAPI.createPlan(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.rateLimit.plans() });
      toast.success(t("rateLimit.plans.createSuccess", "admin"));
    },
    onError: (error) => {
      toast.error(
        error.message || t("rateLimit.plans.createError", "admin"),
      );
    },
  });

  const updatePlanMutation = useMutation<
    Plan,
    Error,
    { name: string; data: UpdatePlanDto }
  >({
    mutationFn: ({ name, data }) => RateLimitAPI.updatePlan(name, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.rateLimit.plans() });
      toast.success(t("rateLimit.plans.updateSuccess", "admin"));
    },
    onError: (error) => {
      toast.error(
        error.message || t("rateLimit.plans.updateError", "admin"),
      );
    },
  });

  // API Key mutations
  const createApiKeyMutation = useMutation<ApiKey, Error, CreateApiKeyDto>({
    mutationFn: (data) => RateLimitAPI.createApiKey(data),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.rateLimit.apiKeys(),
      });
      toast.success(t("rateLimit.apiKeys.createSuccess", "admin"));
    },
    onError: (error) => {
      toast.error(
        error.message || t("rateLimit.apiKeys.createError", "admin"),
      );
    },
  });

  const updateApiKeyMutation = useMutation<
    ApiKey,
    Error,
    { id: string; data: UpdateApiKeyDto }
  >({
    mutationFn: ({ id, data }) => RateLimitAPI.updateApiKey(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.rateLimit.apiKeys(),
      });
      toast.success(t("rateLimit.apiKeys.updateSuccess", "admin"));
    },
    onError: (error) => {
      toast.error(
        error.message || t("rateLimit.apiKeys.updateError", "admin"),
      );
    },
  });

  const deleteApiKeyMutation = useMutation<void, Error, string>({
    mutationFn: (id) => RateLimitAPI.deleteApiKey(id),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.rateLimit.apiKeys(),
      });
      toast.success(t("rateLimit.apiKeys.deleteSuccess", "admin"));
    },
    onError: (error) => {
      toast.error(
        error.message || t("rateLimit.apiKeys.deleteError", "admin"),
      );
    },
  });

  // IP Whitelist mutations
  const addIpToWhitelistMutation = useMutation<
    IpWhitelist,
    Error,
    CreateIpWhitelistDto
  >({
    mutationFn: (data) => RateLimitAPI.addIpToWhitelist(data),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.rateLimit.ipWhitelist(),
      });
      toast.success(t("rateLimit.ipWhitelist.createSuccess", "admin"));
    },
    onError: (error) => {
      toast.error(
        error.message || t("rateLimit.ipWhitelist.createError", "admin"),
      );
    },
  });

  const updateIpWhitelistMutation = useMutation<
    IpWhitelist,
    Error,
    { id: string; data: UpdateIpWhitelistDto }
  >({
    mutationFn: ({ id, data }) => RateLimitAPI.updateIpWhitelist(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.rateLimit.ipWhitelist(),
      });
      toast.success(t("rateLimit.ipWhitelist.updateSuccess", "admin"));
    },
    onError: (error) => {
      toast.error(
        error.message || t("rateLimit.ipWhitelist.updateError", "admin"),
      );
    },
  });

  const removeIpFromWhitelistMutation = useMutation<void, Error, string>({
    mutationFn: (id) => RateLimitAPI.removeIpFromWhitelist(id),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.rateLimit.ipWhitelist(),
      });
      toast.success(t("rateLimit.ipWhitelist.deleteSuccess", "admin"));
    },
    onError: (error) => {
      toast.error(
        error.message || t("rateLimit.ipWhitelist.deleteError", "admin"),
      );
    },
  });

  // Policy mutations
  const createPolicyMutation = useMutation<
    RateLimitPolicy,
    Error,
    CreateRateLimitPolicyDto
  >({
    mutationFn: (data) => RateLimitAPI.createPolicy(data),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.rateLimit.policies(),
      });
      toast.success(t("rateLimit.policies.createSuccess", "admin"));
    },
    onError: (error) => {
      toast.error(
        error.message || t("rateLimit.policies.createError", "admin"),
      );
    },
  });

  const updatePolicyMutation = useMutation<
    RateLimitPolicy,
    Error,
    { id: string; data: UpdateRateLimitPolicyDto }
  >({
    mutationFn: ({ id, data }) => RateLimitAPI.updatePolicy(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.rateLimit.policies(),
      });
      toast.success(t("rateLimit.policies.updateSuccess", "admin"));
    },
    onError: (error) => {
      toast.error(
        error.message || t("rateLimit.policies.updateError", "admin"),
      );
    },
  });

  const deletePolicyMutation = useMutation<void, Error, string>({
    mutationFn: (id) => RateLimitAPI.deletePolicy(id),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.rateLimit.policies(),
      });
      toast.success(t("rateLimit.policies.deleteSuccess", "admin"));
    },
    onError: (error) => {
      toast.error(
        error.message || t("rateLimit.policies.deleteError", "admin"),
      );
    },
  });

  return {
    // Plan mutations
    createPlan: createPlanMutation,
    updatePlan: updatePlanMutation,
    // API Key mutations
    createApiKey: createApiKeyMutation,
    updateApiKey: updateApiKeyMutation,
    deleteApiKey: deleteApiKeyMutation,
    // IP Whitelist mutations
    addIpToWhitelist: addIpToWhitelistMutation,
    updateIpWhitelist: updateIpWhitelistMutation,
    removeIpFromWhitelist: removeIpFromWhitelistMutation,
    // Policy mutations
    createPolicy: createPolicyMutation,
    updatePolicy: updatePolicyMutation,
    deletePolicy: deletePolicyMutation,
  };
}

/**
 * Hook for cache mutations
 */
export function useCacheMutations() {
  const queryClient = useQueryClient();
  const { t } = useI18n();

  const invalidateCacheMutation = useMutation<
    { message: string; timestamp: string },
    Error
  >({
    mutationFn: () => RateLimitAPI.invalidateCache(),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.rateLimit.cacheStats(),
      });
      // Invalidate all rate limit queries
      queryClient.invalidateQueries({ queryKey: ["rateLimit"] });
      toast.success(t("rateLimit.cache.invalidateSuccess", "admin"));
    },
    onError: (error) => {
      toast.error(
        error.message || t("rateLimit.cache.invalidateError", "admin"),
      );
    },
  });

  const resetRateLimitMutation = useMutation<
    { message: string },
    Error,
    string
  >({
    mutationFn: (key) => RateLimitAPI.resetRateLimit(key),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.rateLimit.cacheStats(),
      });
      toast.success(t("rateLimit.cache.resetSuccess", "admin"));
    },
    onError: (error) => {
      toast.error(
        error.message || t("rateLimit.cache.resetError", "admin"),
      );
    },
  });

  return {
    invalidateCache: invalidateCacheMutation,
    resetRateLimit: resetRateLimitMutation,
  };
}

/**
 * Hook for testing policy matching
 */
export function useTestPolicyMatch() {
  const { t } = useI18n();

  return useMutation<PolicyMatchResponse, Error, { id: string; context: TestPolicyMatchDto }>({
    mutationFn: ({ id, context }) => RateLimitAPI.testPolicyMatch(id, context),
    onError: (error) => {
      toast.error(
        error.message || t("rateLimit.policies.testError", "admin"),
      );
    },
  });
}

