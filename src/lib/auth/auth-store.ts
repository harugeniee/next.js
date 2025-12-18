"use client";

import { AuthAPI, FirebaseAuthAPI, OTPAuthAPI } from "@/lib/api/auth";
import {
  clearRefreshTokenFallback,
  clearTokens,
  setAccessToken,
  setRefreshTokenFallback,
} from "@/lib/http";
import type { User } from "@/lib/interface";
import { atom, useAtom } from "jotai";

// ============================================================================
// Jotai Atoms for State Management
// ============================================================================

export const accessTokenAtom = atom<string | null>(null);
export const currentUserAtom = atom<User | null>(null);
export const authLoadingAtom = atom<boolean>(false);
export const userProfileLoadingAtom = atom<boolean>(false);

// ============================================================================
// State Management Hooks
// ============================================================================

/**
 * Function to set user profile loading state
 * This will be used by components to control the global loading state
 */
export function setUserProfileLoading(loading: boolean) {
  return loading;
}

/**
 * Hook for managing user profile loading state
 */
export function useUserProfileLoading() {
  const [loading, setLoading] = useAtom(userProfileLoadingAtom);

  const startLoading = () => setLoading(true);
  const stopLoading = () => setLoading(false);

  return {
    loading,
    startLoading,
    stopLoading,
  };
}

// ============================================================================
// Token Management Utilities
// ============================================================================

/**
 * Store authentication tokens securely
 */
export function storeTokens(accessToken: string, refreshToken?: string) {
  // Store access token in memory (secure, not persisted)
  setAccessToken(accessToken);

  // Also set a cookie for proxy to check
  // Note: This cookie is set client-side, so it's NOT HttpOnly
  // Backend should ideally set HttpOnly cookie, but this is a fallback
  if (typeof document !== "undefined") {
    const isSecure = window.location.protocol === "https:";
    const cookieOptions = [
      `path=/`,
      `max-age=86400`,
      `SameSite=Strict`,
      ...(isSecure ? ["Secure"] : []),
    ].join("; ");
    document.cookie = `accessToken=${accessToken}; ${cookieOptions}`;
  }

  // Store refresh token in localStorage only if backend doesn't set HttpOnly cookies
  // This is a fallback mechanism and should be avoided in production
  if (refreshToken) {
    setRefreshTokenFallback(refreshToken);
    console.warn(
      "⚠️ Using fallback refresh token storage - not secure for production",
    );
  }
}

/**
 * Clear all user state and tokens
 */
export function clearUserState() {
  clearTokens();
  clearRefreshTokenFallback();

  // Clear the access token cookie with the same attributes used when setting it
  // This ensures the browser recognizes it as the same cookie and deletes it properly
  if (typeof document !== "undefined") {
    const isSecure = window.location.protocol === "https:";
    const cookieOptions = [
      `path=/`,
      `max-age=0`,
      `expires=Thu, 01 Jan 1970 00:00:00 GMT`,
      `SameSite=Strict`,
      ...(isSecure ? ["Secure"] : []),
    ].join("; ");
    document.cookie = `accessToken=; ${cookieOptions}`;
  }
}

// ============================================================================
// Authentication Actions (using AuthAPI)
// ============================================================================

/**
 * Login action: handles both cookie-based and fallback refresh token scenarios
 */
export async function loginAction(
  email: string,
  password: string,
): Promise<User> {
  const { user, token } = await AuthAPI.login({ email, password });
  const { accessToken, refreshToken } = token;

  if (!accessToken) {
    throw new Error("No access token returned from server");
  }

  storeTokens(accessToken, refreshToken);
  return user;
}

/**
 * Signup action: handles user registration
 */
export async function signupAction(
  username: string,
  email: string,
  password: string,
  name?: string,
  dob?: string,
  phoneNumber?: string,
): Promise<User> {
  const signupData = {
    username,
    email,
    password,
    ...(name && { name }),
    ...(dob && { dob }),
    ...(phoneNumber && { phoneNumber }),
  };

  const { user, token } = await AuthAPI.signup(signupData);
  const { accessToken, refreshToken } = token;

  if (!accessToken) {
    throw new Error("No access token returned from server");
  }

  storeTokens(accessToken, refreshToken);
  return user;
}

/**
 * Fetch current user information
 */
export async function fetchMeAction(): Promise<User> {
  return AuthAPI.fetchMe();
}

/**
 * Check if access token is valid and refresh if needed
 */
export async function checkAndRefreshToken(): Promise<boolean> {
  try {
    console.log("checkAndRefreshToken: Starting token check...");
    // Try to fetch user data to check if token is valid
    // The http interceptor will handle 401 and refresh automatically
    const user = await fetchMeAction();
    console.log("checkAndRefreshToken: Token is valid, user:", user);
    return true;
  } catch (error) {
    console.log("checkAndRefreshToken: Token check failed:", error);
    // If any error occurs (including 401), clear state and return false
    // The interceptor will have already tried to refresh the token
    clearUserState();
    return false;
  }
}

// ============================================================================
// Firebase Authentication Actions
// ============================================================================

/**
 * Firebase Google login action
 */
export async function loginWithGoogleAction(): Promise<User> {
  // Call Firebase login once and reuse the result
  const firebaseUser = await (await import("./firebase")).signInWithGoogle();
  const idToken = await firebaseUser.getIdToken();

  // Get user data and token from backend
  const { user, token } = await AuthAPI.firebaseLogin({ idToken });

  storeTokens(token.accessToken, token.refreshToken);
  return user;
}

/**
 * Firebase Google One Tap login action
 * Used when user authenticates via Google One Tap
 * @param idToken - Firebase ID token from Google credential
 */
export async function loginWithGoogleOneTapAction(idToken: string): Promise<{
  user: User;
  token: { accessToken: string; refreshToken?: string };
}> {
  // Get user data and token from backend using Firebase ID token
  const { user, token } = await AuthAPI.firebaseLogin({ idToken });

  return { user, token };
}

/**
 * Firebase GitHub login action
 */
export async function loginWithGithubAction(): Promise<User> {
  // Call Firebase login once and reuse the result
  const firebaseUser = await (await import("./firebase")).signInWithGithub();
  const idToken = await firebaseUser.getIdToken();

  // Get user data and token from backend
  const { user, token } = await AuthAPI.firebaseLogin({ idToken });

  storeTokens(token.accessToken, token.refreshToken);
  return user;
}

/**
 * Firebase X (Twitter) login action
 */
export async function loginWithXAction(): Promise<User> {
  // Call Firebase login once and reuse the result
  const firebaseUser = await (await import("./firebase")).signInWithX();
  const idToken = await firebaseUser.getIdToken();

  // Get user data and token from backend
  const { user, token } = await AuthAPI.firebaseLogin({ idToken });

  storeTokens(token.accessToken, token.refreshToken);
  return user;
}

// ============================================================================
// OTP Authentication Actions
// ============================================================================

/**
 * OTP Request action: sends OTP to email
 */
export async function requestOTPAction(
  email: string,
): Promise<{ requestId: string; expiresIn: number }> {
  return OTPAuthAPI.requestOTP(email);
}

/**
 * OTP Verify action: verifies OTP code
 */
export async function verifyOTPAction(
  email: string,
  code: string,
  requestId: string,
): Promise<User> {
  const response = await AuthAPI.verifyOTP({ email, code, requestId });
  console.log("verifyOTPAction: response:", response);
  // Get token for storage from the API response
  storeTokens(response.token.accessToken, response.token.refreshToken);

  return response.user;
}

/**
 * Logout action: clears all tokens and user state
 */
export async function logoutAction() {
  try {
    // Sign out from Firebase if user was logged in via Firebase
    await FirebaseAuthAPI.signOut();

    // Attempt to call logout endpoint (best effort)
    await AuthAPI.logout();
  } catch {
    // Ignore logout errors - still clear local state
    console.warn("Logout endpoint failed, but clearing local state");
  }

  // Clear all tokens from memory and localStorage
  clearUserState();
}
