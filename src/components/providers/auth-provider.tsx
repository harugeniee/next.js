"use client";

import { ClientOnly } from "@/components/ui";
import { authLoadingAtom, currentUserAtom, fetchMeAction } from "@/lib/auth";
import { useAtom } from "jotai";
import { useEffect, useRef } from "react";

export default function AuthProvider({
  children,
}: {
  readonly children: React.ReactNode;
}) {
  const [, setUser] = useAtom(currentUserAtom);
  const [, setAuthLoading] = useAtom(authLoadingAtom);
  const hasCheckedAuth = useRef(false);

  useEffect(() => {
    // Prevent double calls in development mode or component re-mounting
    if (hasCheckedAuth.current) {
      console.log("AuthProvider: Auth already checked, skipping...");
      return;
    }

    // Check if user is already authenticated on app load
    const checkAuth = async () => {
      try {
        console.log(
          "AuthProvider: Starting auth check...",
          new Date().toISOString(),
        );
        hasCheckedAuth.current = true;
        setAuthLoading(true);

        // Try to fetch user data directly
        // If there's a valid token, this will succeed
        // If not, it will fail and we'll clear the state
        const user = await fetchMeAction();
        // console.log("AuthProvider: User fetched successfully:", user);
        setUser(user);
      } catch (error) {
        // User is not authenticated or API failed, clear state
        console.log("AuthProvider: Auth check failed:", error);
        setUser(null);
      } finally {
        console.log(
          "AuthProvider: Auth check complete, setting loading to false",
          new Date().toISOString(),
        );
        setAuthLoading(false);
      }
    };

    checkAuth();
  }, [setUser, setAuthLoading]);

  return (
    <ClientOnly fallback={<div className="min-h-screen bg-background" />}>
      {children}
    </ClientOnly>
  );
}
