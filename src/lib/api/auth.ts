import { User } from "@/lib/interface";
import {
  signInWithGithub,
  signInWithGoogle,
  signInWithX,
  signOutFirebase,
} from "../auth/firebase";
import { http, publicHttp } from "../http";
import type {
  AdvancedQueryParams,
  ApiResponse,
  ApiResponseCursor,
  ApiResponseOffset,
  ChangePasswordRequest,
  ChangePasswordResponse,
  FirebaseLoginRequest,
  ForgotPasswordRequest,
  ForgotPasswordResponse,
  LoginRequest,
  LoginResponse,
  LogoutResponse,
  OTPRequestRequest,
  OTPRequestResponseData,
  OTPVerifyRequest,
  OTPVerifyResponseData,
  QueryParamsWithCursor,
  RefreshTokenRequest,
  RefreshTokenResponse,
  ResendVerificationEmailRequest,
  ResendVerificationEmailResponse,
  ResetPasswordRequest,
  ResetPasswordResponse,
  VerifyEmailRequest,
  VerifyEmailResponse,
} from "../types";

/**
 * Authentication API wrapper
 * Handles all authentication-related API calls
 * Separated from auth-store.ts for better organization
 */
export class AuthAPI {
  private static readonly BASE_URL = "/auth";

  /**
   * Login with email and password
   */
  static async login(data: LoginRequest): Promise<LoginResponse> {
    const response = await publicHttp.post<ApiResponse<LoginResponse>>(
      `${this.BASE_URL}/login`,
      data,
    );

    if (!response.data.success) {
      throw new Error(response.data.message || "Login failed");
    }

    return response.data.data;
  }

  /**
   * Signup with user data
   */
  static async signup(data: {
    username: string;
    email: string;
    password: string;
    name?: string;
    dob?: string;
    phoneNumber?: string;
  }): Promise<LoginResponse> {
    // Convert dob string to Date if provided
    const requestData = {
      ...data,
      ...(data.dob && { dob: new Date(data.dob) }),
    };

    const response = await publicHttp.post<ApiResponse<LoginResponse>>(
      `${this.BASE_URL}/register`,
      requestData,
    );

    if (!response.data.success) {
      throw new Error(response.data.message || "Signup failed");
    }

    return response.data.data;
  }

  /**
   * Firebase login (Google, GitHub, X)
   */
  static async firebaseLogin(
    data: FirebaseLoginRequest,
  ): Promise<LoginResponse> {
    const response = await publicHttp.post<ApiResponse<LoginResponse>>(
      `${this.BASE_URL}/firebase/login`,
      data,
    );

    if (!response.data.success) {
      throw new Error(
        response.data.message || "Firebase authentication failed",
      );
    }

    return response.data.data;
  }

  /**
   * Request OTP via email
   */
  static async requestOTP(
    data: OTPRequestRequest,
  ): Promise<OTPRequestResponseData> {
    const response = await publicHttp.post<ApiResponse<OTPRequestResponseData>>(
      `${this.BASE_URL}/otp/request`,
      data,
    );

    if (!response.data.success) {
      throw new Error(response.data.message || "Failed to send OTP");
    }

    return response.data.data;
  }

  /**
   * Verify OTP code
   */
  static async verifyOTP(
    data: OTPVerifyRequest,
  ): Promise<OTPVerifyResponseData> {
    const response = await publicHttp.post<ApiResponse<OTPVerifyResponseData>>(
      `${this.BASE_URL}/otp/verify`,
      data,
    );

    if (!response.data.success) {
      throw new Error(response.data.message || "OTP verification failed");
    }

    return response.data.data;
  }

  /**
   * Refresh access token
   */
  static async refreshToken(
    data?: RefreshTokenRequest,
  ): Promise<RefreshTokenResponse> {
    const response = await http.post<ApiResponse<RefreshTokenResponse>>(
      `${this.BASE_URL}/refresh-token`,
      data,
    );

    if (!response.data.success) {
      throw new Error(response.data.message || "Token refresh failed");
    }

    return response.data.data;
  }

  /**
   * Logout
   */
  static async logout(): Promise<LogoutResponse> {
    const response = await http.post<ApiResponse<LogoutResponse>>(
      `${this.BASE_URL}/logout`,
    );

    if (!response.data.success) {
      throw new Error(response.data.message || "Logout failed");
    }

    return response.data.data;
  }

  /**
   * Logout all sessions
   */
  static async logoutAll(): Promise<LogoutResponse> {
    const response = await http.post<ApiResponse<LogoutResponse>>(
      `${this.BASE_URL}/logout-all`,
    );

    if (!response.data.success) {
      throw new Error(response.data.message || "Logout all failed");
    }

    return response.data.data;
  }

  /**
   * Create device token
   */
  static async createDeviceToken(data: {
    deviceId: string;
    deviceName?: string;
    deviceType?: string;
    fcmToken?: string;
  }): Promise<ApiResponse<{ id: string; deviceId: string }>> {
    const response = await http.post<
      ApiResponse<{ id: string; deviceId: string }>
    >(`${this.BASE_URL}/device-token`, data);

    if (!response.data.success) {
      throw new Error(response.data.message || "Failed to create device token");
    }

    return response.data;
  }

  /**
   * Get user sessions with offset pagination
   */
  static async getSessions(
    params?: AdvancedQueryParams,
  ): Promise<ApiResponseOffset<unknown>> {
    const response = await http.get<ApiResponseOffset<unknown>>(
      `${this.BASE_URL}/sessions`,
      { params },
    );

    if (!response.data.success) {
      throw new Error(response.data.message || "Failed to fetch sessions");
    }

    return response.data;
  }

  /**
   * Get user sessions with cursor pagination
   */
  static async getSessionsCursor(
    params?: QueryParamsWithCursor,
  ): Promise<ApiResponseCursor<unknown>> {
    const response = await http.get<ApiResponseCursor<unknown>>(
      `${this.BASE_URL}/sessions-cursor`,
      { params },
    );

    if (!response.data.success) {
      throw new Error(response.data.message || "Failed to fetch sessions");
    }

    return response.data;
  }

  /**
   * Get session by ID
   */
  static async getSessionById(
    sessionId: string,
  ): Promise<ApiResponse<unknown>> {
    const response = await http.get<ApiResponse<unknown>>(
      `${this.BASE_URL}/sessions/${sessionId}`,
    );

    if (!response.data.success) {
      throw new Error(response.data.message || "Failed to fetch session");
    }

    return response.data;
  }

  /**
   * Update password (PUT method)
   */
  static async updatePassword(
    data: ChangePasswordRequest,
  ): Promise<ChangePasswordResponse> {
    const response = await http.put<ApiResponse<ChangePasswordResponse>>(
      `${this.BASE_URL}/update-password`,
      data,
    );

    if (!response.data.success) {
      throw new Error(response.data.message || "Password update failed");
    }

    return response.data.data;
  }

  /**
   * Change password (legacy POST method)
   */
  static async changePassword(
    data: ChangePasswordRequest,
  ): Promise<ChangePasswordResponse> {
    return this.updatePassword(data);
  }

  /**
   * Forgot password
   */
  static async forgotPassword(
    data: ForgotPasswordRequest,
  ): Promise<ForgotPasswordResponse> {
    const response = await publicHttp.post<ApiResponse<ForgotPasswordResponse>>(
      `${this.BASE_URL}/forgot-password`,
      data,
    );

    if (!response.data.success) {
      throw new Error(response.data.message || "Password reset request failed");
    }

    return response.data.data;
  }

  /**
   * Reset password
   */
  static async resetPassword(
    data: ResetPasswordRequest,
  ): Promise<ResetPasswordResponse> {
    const response = await publicHttp.post<ApiResponse<ResetPasswordResponse>>(
      `${this.BASE_URL}/reset-password`,
      data,
    );

    if (!response.data.success) {
      throw new Error(response.data.message || "Password reset failed");
    }

    return response.data.data;
  }

  /**
   * Verify email
   */
  static async verifyEmail(
    data: VerifyEmailRequest,
  ): Promise<VerifyEmailResponse> {
    const response = await http.post<ApiResponse<VerifyEmailResponse>>(
      `${this.BASE_URL}/verify-email`,
      data,
    );

    if (!response.data.success) {
      throw new Error(response.data.message || "Email verification failed");
    }

    return response.data.data;
  }

  /**
   * Resend verification email
   */
  static async resendVerificationEmail(
    data: ResendVerificationEmailRequest,
  ): Promise<ResendVerificationEmailResponse> {
    const response = await http.post<
      ApiResponse<ResendVerificationEmailResponse>
    >(`${this.BASE_URL}/resend-verification`, data);

    if (!response.data.success) {
      throw new Error(
        response.data.message || "Failed to resend verification email",
      );
    }

    return response.data.data;
  }

  /**
   * Fetch current user information
   */
  static async fetchMe(): Promise<User> {
    const response = await http.get<ApiResponse<User>>("/users/me");

    if (!response.data.success) {
      throw new Error(response.data.message || "Failed to fetch user data");
    }

    return response.data.data;
  }
}

/**
 * Firebase Authentication helpers
 * Wrapper functions for Firebase auth operations
 */
export class FirebaseAuthAPI {
  /**
   * Login with Google
   */
  static async loginWithGoogle(): Promise<User> {
    try {
      const firebaseUser = await signInWithGoogle();
      const idToken = await firebaseUser.getIdToken();
      const { user, token } = await AuthAPI.firebaseLogin({ idToken });

      if (!token.accessToken) {
        throw new Error("No access token returned from server");
      }

      return user;
    } catch (error) {
      console.error("Firebase Google login error:", error);
      throw error;
    }
  }

  /**
   * Login with GitHub
   */
  static async loginWithGithub(): Promise<User> {
    try {
      const firebaseUser = await signInWithGithub();
      const idToken = await firebaseUser.getIdToken();
      const { user, token } = await AuthAPI.firebaseLogin({ idToken });

      if (!token.accessToken) {
        throw new Error("No access token returned from server");
      }

      return user;
    } catch (error) {
      console.error("Firebase GitHub login error:", error);
      throw error;
    }
  }

  /**
   * Login with X (Twitter)
   */
  static async loginWithX(): Promise<User> {
    try {
      const firebaseUser = await signInWithX();
      const idToken = await firebaseUser.getIdToken();
      const { user, token } = await AuthAPI.firebaseLogin({ idToken });

      if (!token.accessToken) {
        throw new Error("No access token returned from server");
      }

      return user;
    } catch (error) {
      console.error("Firebase X login error:", error);
      throw error;
    }
  }

  /**
   * Sign out from Firebase
   */
  static async signOut(): Promise<void> {
    await signOutFirebase();
  }
}

/**
 * OTP Authentication helpers
 * Wrapper functions for OTP operations
 */
export class OTPAuthAPI {
  /**
   * Request OTP and return request info
   */
  static async requestOTP(email: string): Promise<{
    requestId: string;
    expiresIn: number;
  }> {
    try {
      const response = await AuthAPI.requestOTP({ email });
      return {
        requestId: response.requestId,
        expiresIn: response.expiresInSec,
      };
    } catch (error) {
      console.error("OTP request error:", error);
      throw error;
    }
  }
}
