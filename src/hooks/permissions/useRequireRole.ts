import { useAtom } from "jotai";
import { useRouter } from "next/navigation";
import { useEffect, useRef } from "react";

import { authLoadingAtom, currentUserAtom } from "@/lib/auth";
import { redirectToPermissionDenied } from "@/lib/utils";
import { useCheckRole } from "./usePermissionQuery";

/**
 * Hook for protecting routes that require a specific role
 * Redirects to permission-denied page if user doesn't have the required role
 * Handles login/logout cases automatically
 * @param roleName - Name of the role to check (e.g., "uploader")
 * @returns Object with permission check status
 */
export function useRequireRole(roleName: string) {
  const router = useRouter();
  const [currentUser] = useAtom(currentUserAtom);
  const [authLoading] = useAtom(authLoadingAtom);
  const hasRedirectedRef = useRef(false);

  // Check role only if user is authenticated
  const {
    data: roleCheckData,
    isLoading: isCheckingRole,
    isFetched: isRoleFetched,
  } = useCheckRole(roleName, !!currentUser);

  const hasRole = roleCheckData?.hasRole ?? false;
  const currentPath =
    typeof window !== "undefined" ? window.location.pathname : "";

  useEffect(() => {
    // Don't redirect while auth is still loading
    if (authLoading) {
      hasRedirectedRef.current = false;
      return;
    }

    // If user is not authenticated, redirect to login first
    // The ProtectedRoute component will handle this, but we check here too for safety
    if (!currentUser) {
      hasRedirectedRef.current = false;
      return;
    }

    // Wait for role check to complete
    if (isCheckingRole || !isRoleFetched) {
      return;
    }

    // If user doesn't have the required role, redirect to permission-denied
    if (!hasRole && !hasRedirectedRef.current) {
      hasRedirectedRef.current = true;
      redirectToPermissionDenied(router, currentPath);
    } else if (hasRole) {
      // Reset redirect flag if user has role (e.g., after login with correct role)
      hasRedirectedRef.current = false;
    }
  }, [
    currentUser,
    authLoading,
    hasRole,
    isCheckingRole,
    isRoleFetched,
    router,
    currentPath,
  ]);

  return {
    hasRole,
    isCheckingRole: isCheckingRole || authLoading,
    isAuthenticated: !!currentUser,
    isLoading: authLoading || isCheckingRole,
  };
}
