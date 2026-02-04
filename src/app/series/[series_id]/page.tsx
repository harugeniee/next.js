import type { Metadata } from "next";
import { fetchSeriesForSEO } from "@/lib/seo/server-fetch";
import { generateSeriesMetadata } from "@/lib/seo/metadata-generators";
import { generateSeriesJsonLd } from "@/lib/seo/json-ld";
import { JsonLdScript } from "@/components/seo";
import { SeriesDetailContent } from "./_components";

interface Props {
  params: Promise<{ series_id: string }>;
}

/**
 * Generate metadata for SEO - runs on server
 * This function fetches series data and generates appropriate meta tags
 * for search engines and social media sharing.
 */
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { series_id } = await params;
  const series = await fetchSeriesForSEO(series_id);
  return generateSeriesMetadata(series, series_id);
}

/**
 * Series Detail Page
 *
 * Server component that:
 * 1. Fetches data for SEO metadata (via generateMetadata)
 * 2. Injects JSON-LD structured data for rich search results
 * 3. Renders the client component for interactive content
 *
 * URL pattern: /series/[series_id]
 */
export default async function SeriesDetailPage({ params }: Props) {
  const { series_id } = await params;

  // Fetch series data for JSON-LD (Next.js caches this, so it's efficient)
  const series = await fetchSeriesForSEO(series_id);

  return (
    <>
      {/* JSON-LD Structured Data - renders in document for SEO */}
      {series && (
        <JsonLdScript data={generateSeriesJsonLd(series, series_id)} />
      )}

      {/* Client Component - handles all interactivity */}
      <SeriesDetailContent seriesId={series_id} />
    </>
  );
}
