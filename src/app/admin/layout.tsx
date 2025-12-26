"use client";

import { useEffect } from "react";

import { AppSidebar } from "@/components/features/admin/sidebar/app-sidebar";
import { ProtectedRoute } from "@/components/features/auth";
import { useRequireRole } from "@/hooks/permissions";
import { Separator } from "@/components/ui/layout/separator";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";

export default function AdminLayout({
  children,
}: {
  readonly children: React.ReactNode;
}) {
  // Check if user has admin role - automatically redirects if not
  const { isLoading: isCheckingRole } = useRequireRole("admin");

  // Add robots meta tag to prevent search engine indexing
  useEffect(() => {
    // Helper function to update or create meta tag
    const updateMetaTag = (name: string, content: string) => {
      try {
        let element = document.querySelector(
          `meta[name="${name}"]`,
        ) as HTMLMetaElement;

        if (!element) {
          if (!document.head) {
            console.warn("document.head is not available");
            return;
          }

          element = document.createElement("meta");
          element.setAttribute("name", name);
          document.head.appendChild(element);
        }

        element.setAttribute("content", content);
      } catch (error) {
        console.warn(`Failed to update meta tag ${name}:`, error);
      }
    };

    // Set robots meta tag to prevent indexing
    updateMetaTag("robots", "noindex, nofollow");

    // Cleanup function to remove robots meta tag when leaving admin pages
    return () => {
      try {
        const robotsMeta = document.querySelector(
          'meta[name="robots"]',
        ) as HTMLMetaElement;
        if (
          robotsMeta &&
          robotsMeta.getAttribute("content") === "noindex, nofollow"
        ) {
          // Only remove if it's the one we set (in case other pages use robots meta)
          // Actually, we should keep it or let next page handle it
          // Removing cleanup to avoid conflicts with other pages
        }
      } catch {
        // Silently ignore cleanup errors
      }
    };
  }, []);

  return (
    <ProtectedRoute>
      {/* Show loading state while checking admin role */}
      {isCheckingRole ? (
        <div className="flex min-h-screen w-full items-center justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      ) : (
        <SidebarProvider>
          <AppSidebar />
          <SidebarInset>
            <header className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12">
              <div className="flex items-center gap-2 px-4">
                <SidebarTrigger className="-ml-1" />
                <Separator
                  orientation="vertical"
                  className="mr-2 data-[orientation=vertical]:h-4"
                />
              </div>
            </header>
            <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
              {children}
            </div>
          </SidebarInset>
        </SidebarProvider>
      )}
    </ProtectedRoute>
  );
}
