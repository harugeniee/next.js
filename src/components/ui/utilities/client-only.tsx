"use client";

import { useEffect, useState } from "react";

interface ClientOnlyProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

/**
 * ClientOnly component prevents hydration mismatches by only rendering children on the client side
 * Use this component to wrap any content that might differ between server and client
 */
export function ClientOnly({ children, fallback = null }: ClientOnlyProps) {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    // Defer state update to avoid cascading renders
    queueMicrotask(() => {
      setIsClient(true);
    });
  }, []);

  // Return fallback during SSR and initial render
  if (!isClient) {
    return <>{fallback}</>;
  }

  // Return children only after client-side hydration
  return <>{children}</>;
}

/**
 * Hook to check if component is mounted on client
 * Useful for conditional rendering that depends on client-side state
 */
export function useClientOnly() {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    // Defer state update to avoid cascading renders
    queueMicrotask(() => {
      setIsClient(true);
    });
  }, []);

  return isClient;
}
