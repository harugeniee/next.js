# SEO (Hybrid Pattern)

## Overview

SEO-critical pages use a **hybrid pattern**: server component for metadata + client component for content. This enables search engines to see metadata in the initial HTML while maintaining the NoSSR architecture for interactive content.

## Architecture

```
Server Component (page.tsx)          Client Component (_components/)
┌─────────────────────────────┐     ┌─────────────────────────────┐
│ • generateMetadata()        │     │ • All interactivity         │
│ • JSON-LD structured data   │ ──▶ │ • TanStack Query hooks      │
│ • Renders client component  │     │ • seriesId as prop          │
└─────────────────────────────┘     └─────────────────────────────┘
```

## Directory Structure

```
src/
├── app/
│   ├── sitemap.ts                    # Dynamic sitemap generation
│   └── series/[series_id]/
│       ├── page.tsx                  # Server component (SEO)
│       └── _components/
│           ├── index.ts              # Barrel export
│           └── series-detail-content.tsx  # Client component
├── components/
│   └── seo/
│       ├── index.ts
│       └── json-ld-script.tsx        # JSON-LD injection component
└── lib/
    ├── seo/
    │   ├── index.ts                  # Barrel export
    │   ├── server-fetch.ts           # Server-side fetch (native fetch)
    │   ├── metadata-generators.ts    # Next.js Metadata generators
    │   └── json-ld/
    │       ├── index.ts
    │       ├── series-schema.ts      # Series JSON-LD
    │       └── breadcrumb-schema.ts  # BreadcrumbList JSON-LD
    └── constants/
        └── seo.constants.ts          # SEO configuration
```

## Server-Side Fetch

Located in `@/lib/seo/server-fetch.ts`. Uses native `fetch()` instead of axios because:
1. Server components cannot use client-side interceptors
2. No authentication needed for public SEO data
3. Next.js fetch has built-in caching

```typescript
import { fetchSeriesForSEO } from "@/lib/seo/server-fetch";

// Returns null on error (safe for metadata generation)
const series = await fetchSeriesForSEO(seriesId);
```

### Configuration

```typescript
// src/lib/constants/seo.constants.ts
export const SEO_CONSTANTS = {
  SITE_NAME: "MangaSBS",
  SITE_URL: process.env.NEXT_PUBLIC_SITE_URL || "https://mangasbs.com",
  DEFAULT_LOCALE: "en_US",
  CACHE: {
    METADATA: 3600,   // 1 hour for page metadata
    SITEMAP: 86400,   // 24 hours for sitemap
  },
} as const;
```

## Hybrid Page Pattern

### Server Component (page.tsx)

```typescript
// src/app/series/[series_id]/page.tsx
// NO "use client" directive - this is a server component

import type { Metadata } from "next";
import { fetchSeriesForSEO } from "@/lib/seo/server-fetch";
import { generateSeriesMetadata } from "@/lib/seo/metadata-generators";
import {
  generateSeriesJsonLd,
  generateBreadcrumbJsonLd,
  getSeriesBreadcrumbItems,
} from "@/lib/seo/json-ld";
import { JsonLdScript } from "@/components/seo";
import { SeriesDetailContent } from "./_components";

interface Props {
  params: Promise<{ series_id: string }>;
}

// generateMetadata runs on server - SEO friendly
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { series_id } = await params;
  const series = await fetchSeriesForSEO(series_id);
  return generateSeriesMetadata(series, series_id);
}

export default async function SeriesDetailPage({ params }: Props) {
  const { series_id } = await params;
  const series = await fetchSeriesForSEO(series_id);

  const seriesTitle =
    series?.title?.userPreferred ||
    series?.title?.english ||
    series?.title?.romaji ||
    "Series";

  return (
    <>
      {/* JSON-LD Structured Data */}
      {series && (
        <>
          <JsonLdScript data={generateSeriesJsonLd(series, series_id)} />
          <JsonLdScript
            data={generateBreadcrumbJsonLd(getSeriesBreadcrumbItems(seriesTitle))}
          />
        </>
      )}

      {/* Client Component - receives seriesId as prop */}
      <SeriesDetailContent seriesId={series_id} />
    </>
  );
}
```

### Client Component (_components/)

```typescript
// src/app/series/[series_id]/_components/series-detail-content.tsx
"use client";

import { useSeriesFull } from "@/hooks/series";
// ... other imports

interface SeriesDetailContentProps {
  seriesId: string;  // Received as prop, NOT from useParams()
}

export function SeriesDetailContent({ seriesId }: SeriesDetailContentProps) {
  // Use TanStack Query for client-side data fetching
  const { data: backendSeries, isLoading, error } = useSeriesFull(seriesId);

  // ... rest of component logic
}
```

## Metadata Generators

Located in `@/lib/seo/metadata-generators.ts`:

```typescript
import { generateSeriesMetadata } from "@/lib/seo/metadata-generators";

// Returns Next.js Metadata object
const metadata = generateSeriesMetadata(series, seriesId);
// {
//   title: "Naruto",
//   description: "...",
//   openGraph: { ... },
//   twitter: { ... },
//   alternates: { canonical: "..." },
// }
```

## JSON-LD Structured Data

### Series Schema

```typescript
import { generateSeriesJsonLd } from "@/lib/seo/json-ld";

const jsonLd = generateSeriesJsonLd(series, seriesId);
// {
//   "@context": "https://schema.org",
//   "@type": "ComicSeries" | "TVSeries",
//   "name": "...",
//   "description": "...",
//   "author": [...],
//   "genre": [...],
//   "aggregateRating": {...},
// }
```

### BreadcrumbList Schema

```typescript
import {
  generateBreadcrumbJsonLd,
  getSeriesBreadcrumbItems,
} from "@/lib/seo/json-ld";

const breadcrumbs = getSeriesBreadcrumbItems("Naruto");
// [
//   { name: "Home", url: "/" },
//   { name: "Series", url: "/series/latest" },
//   { name: "Naruto" }  // Current page - no URL
// ]

const jsonLd = generateBreadcrumbJsonLd(breadcrumbs);
// {
//   "@context": "https://schema.org",
//   "@type": "BreadcrumbList",
//   "itemListElement": [...]
// }
```

### JsonLdScript Component

```typescript
// src/components/seo/json-ld-script.tsx
interface JsonLdScriptProps {
  readonly data: Record<string, unknown>;
}

export function JsonLdScript({ data }: JsonLdScriptProps) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}
```

## Dynamic Sitemap

Located in `src/app/sitemap.ts`:

```typescript
import type { MetadataRoute } from "next";
import { SEO_CONSTANTS } from "@/lib/constants/seo.constants";
import { fetchSeriesListForSitemap } from "@/lib/seo/server-fetch";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = SEO_CONSTANTS.SITE_URL;

  // Static pages
  const staticPages: MetadataRoute.Sitemap = [
    { url: baseUrl, changeFrequency: "daily", priority: 1 },
    { url: `${baseUrl}/series/latest`, changeFrequency: "hourly", priority: 0.9 },
  ];

  // Dynamic series pages
  const seriesResponse = await fetchSeriesListForSitemap(1000);
  const seriesPages = seriesResponse?.result.map((series) => ({
    url: `${baseUrl}/series/${series.id}`,
    lastModified: series.updatedAt ? new Date(series.updatedAt) : new Date(),
    changeFrequency: "weekly" as const,
    priority: 0.8,
  })) || [];

  return [...staticPages, ...seriesPages];
}
```

## robots.txt

Located in `public/robots.txt`:

```
User-agent: *
Allow: /

# Private/authenticated pages
Disallow: /admin
Disallow: /auth
Disallow: /settings
Disallow: /write

# Sitemap location
Sitemap: https://mangasbs.com/sitemap.xml
```

## Best Practices

1. **Use hybrid pattern for SEO-critical pages** - Series detail, article pages
2. **Pass IDs as props** - Client components receive IDs as props, not from useParams()
3. **Server fetch returns null on error** - Safe for metadata generation
4. **Cache appropriately** - 1 hour for metadata, 24 hours for sitemap
5. **Include multiple JSON-LD blocks** - Series schema + BreadcrumbList
6. **Test structured data** - Validate at https://validator.schema.org/

## Anti-Patterns

```typescript
// ❌ WRONG: "use client" in SEO page
"use client";
export async function generateMetadata() { ... }  // Won't work!

// ❌ WRONG: Using axios in server component
import { http } from "@/lib/http/client";
const series = await http.get(`/series/${id}`);  // Has client interceptors

// ❌ WRONG: Using useParams in extracted client component
export function SeriesDetailContent() {
  const { series_id } = useParams();  // Should receive as prop
}

// ❌ WRONG: Throwing errors in server fetch
export async function fetchSeriesForSEO(id: string) {
  const res = await fetch(...);
  if (!res.ok) throw new Error();  // Should return null instead
}
```

## Verification Checklist

- [ ] View page source shows metadata in HTML (not JS-rendered)
- [ ] JSON-LD validates at https://validator.schema.org/
- [ ] Open Graph works (test with Facebook Sharing Debugger)
- [ ] Twitter Cards work (test with Twitter Card Validator)
- [ ] Sitemap accessible at `/sitemap.xml`
- [ ] Client-side navigation still works
- [ ] TanStack Query caching unaffected
