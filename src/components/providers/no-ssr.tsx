"use client";

import { useEffect, useState } from "react";

interface NoSSRProps {
  readonly children: React.ReactNode;
  readonly fallback?: React.ReactNode;
}

/**
 * NoSSR component that prevents hydration mismatches
 * Only renders children on the client side
 */
export function NoSSR({ children, fallback = null }: NoSSRProps) {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    // Defer state update to avoid cascading renders
    queueMicrotask(() => {
      setIsMounted(true);
    });
  }, []);

  if (!isMounted) {
    return <>{fallback}</>;
  }

  return <>{children}</>;
}

/**
 * Hook to check if component is mounted on client
 */
export function useIsMounted() {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    // Defer state update to avoid cascading renders
    queueMicrotask(() => {
      setIsMounted(true);
    });
  }, []);

  return isMounted;
}
