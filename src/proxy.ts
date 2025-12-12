import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

/**
 * Route configuration interface
 * Follows Open/Closed Principle - easy to extend
 */
export interface RouteConfig {
  readonly protected: readonly string[];
  readonly auth: readonly string[];
  readonly public: readonly string[];
}

/**
 * Route configuration - Direct Edit approach
 * Easy to modify and extend following SOLID principles
 */
export const ROUTE_CONFIG: RouteConfig = {
  // 🔒 Protected routes - require authentication
  protected: [
    "/write", // Article writing
    "/user", // User management
    "/organizations", // Organization management (create, edit, etc.)
    // Add more protected routes here:
    // "/admin",         // Admin panel
    // "/dashboard",     // User dashboard
    // "/settings",      // User settings
  ],

  // 🔐 Auth routes - redirect if already authenticated
  auth: [
    "/auth/login", // Login page
    "/auth/register", // Registration page
    // Add more auth routes here:
    // "/auth/forgot",   // Password reset
    // "/auth/signup",   // Alternative signup
  ],

  // 🌐 Public routes - accessible to everyone
  public: [
    "/", // Home page
    "/demo", // Demo pages
    "/demo/theming", // Theme demo
    // Add more public routes here:
    // "/about",         // About page
    // "/contact",       // Contact page
    // "/help",          // Help center
  ],
} as const;

/**
 * Route matcher utility functions
 * Simple, functional approach following Single Responsibility Principle
 */
export const RouteMatcher = {
  /**
   * Check if pathname matches any protected routes
   */
  isProtectedRoute(
    pathname: string,
    config: RouteConfig = ROUTE_CONFIG,
  ): boolean {
    return config.protected.some((route) => pathname.startsWith(route));
  },

  /**
   * Check if pathname matches any auth routes
   */
  isAuthRoute(pathname: string, config: RouteConfig = ROUTE_CONFIG): boolean {
    return config.auth.some((route) => pathname.startsWith(route));
  },

  /**
   * Check if pathname matches any public routes
   */
  isPublicRoute(pathname: string, config: RouteConfig = ROUTE_CONFIG): boolean {
    return config.public.some((route) => pathname.startsWith(route));
  },
};

/**
 * Authentication utility functions
 * Simple, functional approach following Single Responsibility Principle
 */
export const AuthUtils = {
  /**
   * Extract access token from request cookies
   */
  getAccessToken(request: NextRequest): string | null {
    return request.cookies.get("accessToken")?.value || null;
  },

  /**
   * Check if user is authenticated
   */
  isAuthenticated(request: NextRequest): boolean {
    return !!AuthUtils.getAccessToken(request);
  },
};

/**
 * Redirect utility functions
 * Simple, functional approach following Single Responsibility Principle
 */
export const RedirectUtils = {
  /**
   * Create login redirect URL with return path
   */
  createLoginRedirect(request: NextRequest, returnPath: string): NextResponse {
    const loginUrl = new URL("/auth/login", request.url);
    loginUrl.searchParams.set("redirect", returnPath);
    return NextResponse.redirect(loginUrl);
  },

  /**
   * Create authenticated user redirect
   */
  createAuthRedirect(
    request: NextRequest,
    redirectPath?: string,
  ): NextResponse {
    const redirectUrl =
      redirectPath || request.nextUrl.searchParams.get("redirect") || "/";
    return NextResponse.redirect(new URL(redirectUrl, request.url));
  },
};

/**
 * Logger utility functions
 * Simple logging with development-only output
 */
export const Logger = {
  /**
   * Log proxy processing information (development only)
   */
  logRequest(
    pathname: string,
    isProtected: boolean,
    isAuth: boolean,
    hasToken: boolean,
  ): void {
    if (process.env.NODE_ENV !== "development") return;

    console.log("🔒 Proxy:", {
      pathname,
      isProtected,
      isAuth,
      hasToken,
    });
  },

  /**
   * Log redirect information (development only)
   */
  logRedirect(from: string, to: string, reason: string): void {
    if (process.env.NODE_ENV !== "development") return;

    console.log(`🔄 Proxy: ${reason}`, { from, to });
  },
};

/**
 * Main proxy function
 * Clean, simple, and easy to understand
 * Follows SOLID principles with functional approach
 * Runs on Node.js runtime for request interception
 */
export default function proxy(request: NextRequest): NextResponse {
  const { pathname } = request.nextUrl;

  // Determine route types
  const isProtected = RouteMatcher.isProtectedRoute(pathname);
  const isAuth = RouteMatcher.isAuthRoute(pathname);
  const isAuthenticated = AuthUtils.isAuthenticated(request);

  // Log request processing (development only)
  Logger.logRequest(pathname, isProtected, isAuth, isAuthenticated);

  // Handle protected routes - redirect to login if not authenticated
  if (isProtected && !isAuthenticated) {
    Logger.logRedirect(pathname, "/auth/login", "Protected route without auth");
    return RedirectUtils.createLoginRedirect(request, pathname);
  }

  // Handle auth routes - redirect authenticated users away from auth pages
  // If there's a redirect param, use it; otherwise redirect to home
  // This ensures users are redirected back to their intended destination after login
  if (isAuth && isAuthenticated) {
    const redirectParam = request.nextUrl.searchParams.get("redirect");
    const redirectUrl = redirectParam || "/";

    // Only redirect if we're not already on the target page
    if (pathname !== redirectUrl) {
      Logger.logRedirect(
        pathname,
        redirectUrl,
        "Authenticated user on auth route, redirecting to intended destination",
      );
      return RedirectUtils.createAuthRedirect(request, redirectUrl);
    } else {
      Logger.logRedirect(
        pathname,
        redirectUrl,
        "Already on target page, no redirect needed",
      );
    }
  }

  // Allow request to continue
  return NextResponse.next();
}

/**
 * Proxy configuration
 */
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     */
    "/((?!api|_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
