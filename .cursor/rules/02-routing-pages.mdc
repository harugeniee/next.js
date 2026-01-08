---
alwaysApply: true
---

# Routing & Pages

## All Pages Are Client Components

Every page in this application uses `"use client"` directive. The app is wrapped in `NoSSR` provider, so there is no server-side rendering.

```tsx
// ✅ CORRECT: All pages start with "use client"
"use client";

import { useParams } from "next/navigation";
import { usePageMetadata } from "@/hooks/ui/use-page-metadata";
import { useI18n } from "@/components/providers/i18n-provider";

export default function MyPage() {
  const { t } = useI18n();
  const params = useParams();
  
  usePageMetadata({
    title: t("pageTitle", "namespace"),
    description: t("pageDescription", "namespace"),
  });
  
  return <div>...</div>;
}
```

## Route Parameters

Use `useParams()` hook to access route parameters (not async params):

```tsx
// src/app/series/[series_id]/page.tsx
"use client";

import { useParams } from "next/navigation";

export default function SeriesPage() {
  const params = useParams();
  const seriesId = params.series_id as string;
  
  // Use seriesId in queries
  const { data: series } = useSeries(seriesId);
  
  return <div>...</div>;
}
```

## Page Structure Pattern

```tsx
"use client";

import { useState } from "react";
import { useParams } from "next/navigation";

// Providers and hooks
import { useI18n } from "@/components/providers/i18n-provider";
import { usePageMetadata } from "@/hooks/ui/use-page-metadata";

// Components
import { AnimatedSection } from "@/components/shared";
import { Breadcrumb, BreadcrumbList, ... } from "@/components/ui/navigation/breadcrumb";

// Domain hooks
import { useSeries } from "@/hooks/series/useSeriesQuery";

export default function SeriesDetailPage() {
  const { t } = useI18n();
  const params = useParams();
  const seriesId = params.series_id as string;
  
  // Page metadata
  usePageMetadata({
    title: series?.title || t("series.pageTitle", "series"),
    description: series?.description,
  });
  
  // Data fetching
  const { data: series, isLoading } = useSeries(seriesId);
  
  return (
    <div className="space-y-6">
      {/* Breadcrumb */}
      <AnimatedSection loading={false} data={true}>
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink href="/">{t("home", "common")}</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>{series?.title}</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      </AnimatedSection>
      
      {/* Page Header */}
      <AnimatedSection loading={isLoading} data={series}>
        <h1 className="text-3xl font-bold">{series?.title}</h1>
      </AnimatedSection>
      
      {/* Content */}
      <AnimatedSection loading={isLoading} data={series}>
        <Skeletonize loading={isLoading}>
          {series ? <Content data={series} /> : <Placeholder />}
        </Skeletonize>
      </AnimatedSection>
    </div>
  );
}
```

## Admin Page Pattern

Admin pages follow a consistent structure:

```tsx
// src/app/admin/studios/page.tsx
"use client";

import { useState } from "react";
import { useI18n } from "@/components/providers/i18n-provider";
import { usePageMetadata } from "@/hooks/ui/use-page-metadata";
import { AnimatedSection } from "@/components/shared";
import { Breadcrumb, ... } from "@/components/ui/navigation/breadcrumb";
import { StudiosList } from "@/components/features/admin/studios/studios-list";
import { useStudios } from "@/hooks/admin/useStudios";

export default function AdminStudiosPage() {
  const { t } = useI18n();
  
  // Filters state
  const [filters, setFilters] = useState({
    page: 1,
    limit: 20,
    query: "",
  });
  
  // Page metadata
  usePageMetadata({
    title: t("studios.pageTitle", "admin"),
    description: t("studios.pageDescription", "admin"),
  });
  
  // Data fetching with CRUD operations
  const { listQuery, create, update, remove } = useStudios(filters);
  
  // Handlers
  const handlePageChange = (page: number) => {
    setFilters((prev) => ({ ...prev, page }));
  };
  
  return (
    <div className="space-y-6">
      {/* Breadcrumb */}
      <AnimatedSection loading={false} data={true}>
        <Breadcrumb>...</Breadcrumb>
      </AnimatedSection>
      
      {/* Page Header */}
      <AnimatedSection loading={false} data={true}>
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            {t("studios.pageTitle", "admin")}
          </h1>
          <p className="text-muted-foreground mt-2">
            {t("studios.pageDescription", "admin")}
          </p>
        </div>
      </AnimatedSection>
      
      {/* List Component */}
      <StudiosList
        data={listQuery.data}
        isLoading={listQuery.isLoading}
        page={filters.page}
        limit={filters.limit}
        onPageChange={handlePageChange}
        onCreate={create.mutateAsync}
        onUpdate={update.mutateAsync}
        onDelete={remove.mutateAsync}
        isCreating={create.isPending}
        isUpdating={update.isPending || remove.isPending}
      />
    </div>
  );
}
```

## Route Groups

The app uses route groups for organization:

```
src/app/
├── admin/                    # Admin section
│   ├── layout.tsx           # Admin layout with sidebar
│   ├── page.tsx             # Admin dashboard
│   ├── studios/
│   │   ├── page.tsx         # Studios list
│   │   └── [id]/
│   │       └── page.tsx     # Studio detail
│   └── ...
├── auth/
│   ├── login/page.tsx
│   ├── register/page.tsx
│   └── callback/...
├── series/
│   ├── [series_id]/
│   │   ├── page.tsx         # Series detail
│   │   └── segments/...
│   └── create/page.tsx
└── ...
```

## Layout Pattern

```tsx
// src/app/admin/layout.tsx
"use client";

import { SidebarProvider, SidebarInset, SidebarTrigger } from "@/components/ui/sidebar";
import { AdminSidebar } from "@/components/features/admin/sidebar";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SidebarProvider>
      <AdminSidebar />
      <SidebarInset>
        <header className="flex h-16 items-center gap-4 border-b px-4">
          <SidebarTrigger />
          {/* Header content */}
        </header>
        <main className="flex-1 p-4 md:p-6">{children}</main>
      </SidebarInset>
    </SidebarProvider>
  );
}
```

## Anti-Patterns

```tsx
// ❌ WRONG: No "use client" directive
export default function MyPage() { ... }

// ❌ WRONG: Using async params (this is for RSC)
export default async function MyPage({ params }: { params: { id: string } }) { ... }

// ❌ WRONG: Server-side data fetching
export default async function MyPage() {
  const data = await fetchData(); // No async in client components
}

// ❌ WRONG: Using server actions
async function submitForm(formData: FormData) {
  "use server"; // Not allowed
}
```
