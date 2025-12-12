import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect } from "react";

import { PermissionsAPI } from "@/lib/api/permissions";
import { queryKeys } from "@/lib/utils/query-keys";

/**
 * Hook for checking if current user has a specific role
 * Automatically refetches when user logs in and clears cache when user logs out
 * @param roleName - Name of the role to check (e.g., "uploader")
 * @param enabled - Whether the query should be enabled (default: true)
 * @returns Query result with hasRole boolean
 */
export function useCheckRole(roleName: string, enabled = true) {
  const queryClient = useQueryClient();
  const queryKey = queryKeys.permissions.checkRole(roleName);

  const query = useQuery({
    queryKey,
    queryFn: () => PermissionsAPI.checkRole(roleName),
    enabled: enabled && !!roleName,
    staleTime: 5 * 60 * 1000, // 5 minutes - roles don't change frequently
    retry: 2,
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
  });

  // Clear permissions cache when query is disabled (user logged out)
  useEffect(() => {
    if (!enabled || !roleName) {
      // Remove permissions queries from cache when user logs out
      queryClient.removeQueries({ queryKey: queryKeys.permissions.all() });
    }
  }, [enabled, roleName, queryClient]);

  return query;
}
