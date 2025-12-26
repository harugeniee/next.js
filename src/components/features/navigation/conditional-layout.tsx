"use client";

import { usePathname } from "next/navigation";
import { SiteFooter, SiteNav } from "./index";

export function ConditionalLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  // Check if the path starts with /admin (handling potential trailing slashes or subpaths)
  const isAdmin = pathname?.startsWith("/admin");

  return (
    <>
      {!isAdmin && <SiteNav />}
      {children}
      {!isAdmin && <SiteFooter />}
    </>
  );
}

