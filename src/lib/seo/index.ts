/**
 * SEO Utilities
 * Barrel export for all SEO-related utilities
 */

// Server-side fetch utilities
export {
  serverFetch,
  fetchSeriesForSEO,
  fetchSeriesListForSitemap,
} from "./server-fetch";

// Metadata generators
export {
  generateSeriesMetadata,
  generateSeriesListMetadata,
} from "./metadata-generators";

// JSON-LD schema generators
export {
  generateSeriesJsonLd,
  generateBreadcrumbJsonLd,
  getSeriesBreadcrumbItems,
  getArticleBreadcrumbItems,
  type BreadcrumbItem,
} from "./json-ld";
