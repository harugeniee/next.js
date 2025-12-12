import { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";

/**
 * Permission utility functions
 * Helper functions for handling permission-related operations
 */

/**
 * Redirect to permission denied page
 * @param router - Next.js router instance
 * @param returnPath - Optional path to return to after resolving permission issue
 */
export function redirectToPermissionDenied(
  router: AppRouterInstance,
  returnPath?: string,
) {
  const url = returnPath
    ? `/permission-denied?return=${encodeURIComponent(returnPath)}`
    : "/permission-denied";
  router.push(url);
}

/**
 * Check if current path is permission denied page
 * @param pathname - Current pathname
 * @returns true if path is permission denied page
 */
export function isPermissionDeniedPage(pathname: string): boolean {
  return pathname === "/permission-denied";
}
