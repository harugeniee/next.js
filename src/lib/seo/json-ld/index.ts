/**
 * JSON-LD Schema Generators
 * Barrel export for structured data generators
 */

export { generateSeriesJsonLd } from "./series-schema";
export {
  generateBreadcrumbJsonLd,
  getSeriesBreadcrumbItems,
  getArticleBreadcrumbItems,
  type BreadcrumbItem,
} from "./breadcrumb-schema";
