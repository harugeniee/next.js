import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useAtom } from "jotai";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "sonner";

import { useI18n } from "@/components/providers/i18n-provider";
import { AuthAPI } from "@/lib/api/auth";
import {
  accessTokenAtom,
  authLoadingAtom,
  currentUserAtom,
  fetchMeAction,
  loginAction,
  loginWithGithubAction,
  loginWithGoogleAction,
  loginWithXAction,
  verifyOTPAction,
} from "@/lib/auth";
import { extractAndTranslateErrorMessage } from "@/lib/utils";

/**
 * Hook for fetching current user
 * Replaces manual auth state management
 */
export function useCurrentUser() {
  const [, setUser] = useAtom(currentUserAtom);

  return useQuery({
    queryKey: ["currentUser"],
    queryFn: async () => {
      const user = await fetchMeAction();
      setUser(user);
      return user;
    },
    retry: false, // Don't retry auth failures
    staleTime: 10 * 60 * 1000, // 10 minutes
    gcTime: 15 * 60 * 1000, // 15 minutes
  });
}

/**
 * Hook for login operations
 * Replaces the complex manual useLogin implementation
 */
export function useLogin() {
  const { t } = useI18n();
  const [, setUser] = useAtom(currentUserAtom);
  const [, setAccessToken] = useAtom(accessTokenAtom);
  const queryClient = useQueryClient();

  // Email/Password login mutation
  const emailPasswordMutation = useMutation({
    mutationFn: ({ email, password }: { email: string; password: string }) =>
      loginAction(email, password),
    retry: false, // Disable retry for login
    onSuccess: async (user) => {
      setAccessToken(null); // Token managed in http layer

      // Fetch complete user data
      const completeUser = user ?? (await fetchMeAction());
      setUser(completeUser);

      // Update current user cache
      queryClient.setQueryData(["currentUser"], completeUser);
    },
    onError: (error) => {
      console.error("Login error:", error);
      const errorMessage = extractAndTranslateErrorMessage(
        error,
        "loginErrorDefault",
        t,
        "auth",
      );
      toast.error(errorMessage);
    },
  });

  // Google login mutation
  const googleLoginMutation = useMutation({
    mutationFn: () => loginWithGoogleAction(),
    onSuccess: (user) => {
      setAccessToken(null);
      setUser(user);
      queryClient.setQueryData(["currentUser"], user);
    },
    onError: (error) => {
      handleOAuthError(error, "google", t);
    },
  });

  // GitHub login mutation
  const githubLoginMutation = useMutation({
    mutationFn: () => loginWithGithubAction(),
    onSuccess: (user) => {
      setAccessToken(null);
      setUser(user);
      queryClient.setQueryData(["currentUser"], user);
    },
    onError: (error) => {
      handleOAuthError(error, "github", t);
    },
  });

  // X (Twitter) login mutation
  const xLoginMutation = useMutation({
    mutationFn: () => loginWithXAction(),
    onSuccess: (user) => {
      setAccessToken(null);
      setUser(user);
      queryClient.setQueryData(["currentUser"], user);
    },
    onError: (error) => {
      handleOAuthError(error, "x", t);
    },
  });

  // OTP login mutation
  const otpLoginMutation = useMutation({
    mutationFn: ({
      email,
      code,
      requestId,
    }: {
      email: string;
      code: string;
      requestId: string;
    }) => verifyOTPAction(email, code, requestId),
    retry: false, // Disable retry for OTP verification
    onSuccess: (user) => {
      console.log("OTP login successful:", user);
      setAccessToken(null); // Token managed in http layer
      setUser(user);
      queryClient.setQueryData(["currentUser"], user);
    },
    onError: (error) => {
      console.error("OTP login error:", error);
      const errorMessage = extractAndTranslateErrorMessage(
        error,
        "otpVerifyError",
        t,
        "auth",
      );
      toast.error(errorMessage);
    },
  });

  return {
    // Email/Password login
    handleEmailPasswordLogin: emailPasswordMutation.mutateAsync,
    isEmailPasswordLoading: emailPasswordMutation.isPending,

    // Google login
    handleGoogleLogin: googleLoginMutation.mutateAsync,
    isGoogleLoading: googleLoginMutation.isPending,

    // GitHub login
    handleGithubLogin: githubLoginMutation.mutateAsync,
    isGithubLoading: githubLoginMutation.isPending,

    // X login
    handleXLogin: xLoginMutation.mutateAsync,
    isXLoading: xLoginMutation.isPending,

    // OTP login
    handleOTPLogin: otpLoginMutation.mutateAsync,
    isOTPLoading: otpLoginMutation.isPending,

    // Overall loading state
    isLoading:
      emailPasswordMutation.isPending ||
      googleLoginMutation.isPending ||
      githubLoginMutation.isPending ||
      xLoginMutation.isPending ||
      otpLoginMutation.isPending,
  };
}

/**
 * Hook for logout
 */
export function useLogout() {
  const [, setUser] = useAtom(currentUserAtom);
  const [, setAccessToken] = useAtom(accessTokenAtom);
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => AuthAPI.logout(),
    onSuccess: () => {
      setUser(null);
      setAccessToken(null);

      // Clear all cached data
      queryClient.clear();

      toast.success("Logged out successfully!");
    },
    onError: (error) => {
      console.error("Logout error:", error);
      // Even if logout fails, clear local state
      setUser(null);
      setAccessToken(null);
      queryClient.clear();
    },
  });
}

/**
 * Hook for auth redirect logic
 * Redirects authenticated users away from auth pages
 */
export function useAuthRedirect() {
  const [user] = useAtom(currentUserAtom);
  const [authLoading] = useAtom(authLoadingAtom);
  const router = useRouter();
  const searchParams = useSearchParams();
  const [hasRedirected, setHasRedirected] = useState(false);

  useEffect(() => {
    // Don't redirect while auth is still loading
    if (authLoading) {
      console.log("Auth is loading, waiting...");
      return;
    }

    // If user is authenticated, redirect to home or intended destination
    if (user && !hasRedirected) {
      const redirectUrl = searchParams.get("redirect") || "/";
      console.log(
        "User authenticated, current path:",
        window.location.pathname,
        "redirect to:",
        redirectUrl,
      );
      // Only redirect if we're not already on the target page
      if (window.location.pathname !== redirectUrl) {
        console.log("Redirecting to:", redirectUrl);
        // Defer state update to avoid cascading renders
        queueMicrotask(() => {
          setHasRedirected(true);
        });
        router.push(redirectUrl);
      } else {
        console.log("Already on target page, no redirect needed");
        // Defer state update to avoid cascading renders
        queueMicrotask(() => {
          setHasRedirected(true);
        });
      }
    } else if (!user) {
      console.log("User not authenticated");
      // Defer state update to avoid cascading renders
      queueMicrotask(() => {
        setHasRedirected(false);
      });
    }
  }, [user, authLoading, router, searchParams, hasRedirected]);

  return {
    user,
    authLoading,
    isAuthenticated: !!user,
  };
}

/**
 * Hook for protecting routes that require authentication
 * Redirects to login if user is not authenticated
 */
export function useRequireAuth() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [user] = useAtom(currentUserAtom);
  const [authLoading] = useAtom(authLoadingAtom);

  useEffect(() => {
    // Don't redirect while auth is still loading
    if (authLoading) return;

    // If user is not authenticated, redirect to login
    if (!user) {
      const currentPath = window.location.pathname;
      const loginUrl = `/auth/login?redirect=${encodeURIComponent(currentPath)}`;
      router.push(loginUrl);
    }
  }, [user, authLoading, router, searchParams]);

  return {
    user,
    authLoading,
    isAuthenticated: !!user,
  };
}

/**
 * Helper function to handle OAuth errors
 */
function handleOAuthError(
  error: unknown,
  provider: string,
  t: (key: string, ns?: string) => string,
) {
  if (error && typeof error === "object" && "code" in error) {
    const firebaseError = error as { code: string; message: string };

    switch (firebaseError.code) {
      case "auth/cancelled-popup-request":
      case "auth/popup-closed-by-user":
        // User cancelled - don't show error
        return;

      case "auth/popup-blocked":
        toast.error(
          t("popupBlocked", "auth") ||
            "Popup was blocked. Please allow popups and try again.",
        );
        return;

      case "auth/unauthorized-domain":
        toast.error(
          t("unauthorizedDomain", "auth") ||
            `This domain is not authorized for ${provider} login.`,
        );
        return;

      case "auth/account-exists-with-different-credential":
        toast.error(
          t("accountExistsDifferentCredential", "auth") ||
            "An account already exists with this email using a different login method.",
        );
        return;

      default:
        toast.error(
          t(`${provider}LoginError`, "auth") ||
            `${provider} login failed. Please try again.`,
        );
        return;
    }
  } else {
    toast.error(
      t(`${provider}LoginError`, "auth") ||
        `${provider} login failed. Please try again.`,
    );
  }
}
