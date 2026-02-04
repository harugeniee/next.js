# Create SEO-Optimized Page

Create a new page using the hybrid SEO pattern (server component + client component).

## Arguments
- `$ARGUMENTS`: Page path and entity name (e.g., "articles/[article_id] Article")

## Instructions

1. **Parse arguments**: Extract page path and entity name from `$ARGUMENTS`

2. **Create server component** at `src/app/{path}/page.tsx`:
   ```typescript
   import type { Metadata } from "next";
   import { fetchEntityForSEO } from "@/lib/seo/server-fetch";
   import { generateEntityMetadata } from "@/lib/seo/metadata-generators";
   import { generateEntityJsonLd, generateBreadcrumbJsonLd, getEntityBreadcrumbItems } from "@/lib/seo/json-ld";
   import { JsonLdScript } from "@/components/seo";
   import { EntityDetailContent } from "./_components";

   interface Props {
     params: Promise<{ entity_id: string }>;
   }

   export async function generateMetadata({ params }: Props): Promise<Metadata> {
     const { entity_id } = await params;
     const entity = await fetchEntityForSEO(entity_id);
     return generateEntityMetadata(entity, entity_id);
   }

   export default async function EntityDetailPage({ params }: Props) {
     const { entity_id } = await params;
     const entity = await fetchEntityForSEO(entity_id);
     const entityTitle = entity?.title || "Entity";

     return (
       <>
         {entity && (
           <>
             <JsonLdScript data={generateEntityJsonLd(entity, entity_id)} />
             <JsonLdScript data={generateBreadcrumbJsonLd(getEntityBreadcrumbItems(entityTitle))} />
           </>
         )}
         <EntityDetailContent entityId={entity_id} />
       </>
     );
   }
   ```

3. **Create client component** at `src/app/{path}/_components/entity-detail-content.tsx`:
   - Add `"use client"` directive
   - Receive ID as prop (NOT useParams)
   - Use TanStack Query hooks for data fetching
   - Include loading and error states

4. **Create barrel export** at `src/app/{path}/_components/index.ts`

5. **Add SEO utilities** if needed:
   - Server fetch function in `src/lib/seo/server-fetch.ts`
   - Metadata generator in `src/lib/seo/metadata-generators.ts`
   - JSON-LD schema in `src/lib/seo/json-ld/`
   - Breadcrumb items function

6. **Update sitemap** at `src/app/sitemap.ts` if entity should be indexed

## Reference
- Pattern: `src/app/series/[series_id]/page.tsx`
- SEO utilities: `src/lib/seo/`
- Rule: `.cursor/rules/16-seo.mdc`
