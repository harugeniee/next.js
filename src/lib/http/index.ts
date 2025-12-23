/**
 * HTTP Module
 * Centralized HTTP client with token management and interceptors
 *
 * This module provides:
 * - Axios instances (http, publicHttp)
 * - Token management (access & refresh tokens)
 * - Automatic token refresh on 401
 * - Rate limit handling on 429
 * - Request/response interceptors
 */

// Export HTTP clients
export { http, publicHttp } from "./client";

// Export token management functions
export {
  clearAccessToken,
  clearAccessTokenCookie,
  clearAllTokens,
  clearRefreshToken,
  getAccessToken,
  getRefreshToken,
  hasValidToken,
  setAccessToken,
  setRefreshToken,
} from "./token-manager";

// Export rate limit utilities
export {
  emitRateLimitEvent,
  getRemainingCooldown,
  isRateLimited,
} from "./rate-limit-handler";

// Export token refresh utilities (for advanced use cases)
export { refreshAccessToken } from "./token-refresh";

// Backward compatibility aliases
export {
  clearRefreshToken as clearRefreshTokenFallback,
  clearAllTokens as clearTokens,
  getRefreshToken as getRefreshTokenFallback,
  setRefreshToken as setRefreshTokenFallback,
} from "./token-manager";
