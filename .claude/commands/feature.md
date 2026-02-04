# Scaffold New Feature

Create a complete feature with page, components, hooks, and API.

## Arguments
- `$ARGUMENTS`: Feature name and path (e.g., "Article articles/[article_id]")

## Instructions

### 1. Create API Wrapper
File: `src/lib/api/{feature}.ts`
```typescript
import { http } from "@/lib/http/client";
import type { ApiResponse, ApiResponseOffset } from "@/lib/types/response";
import type { Feature, CreateFeatureDto, UpdateFeatureDto } from "@/lib/interface/feature.interface";

export class FeatureAPI {
  static async getFeature(id: string): Promise<Feature> {
    const response = await http.get<ApiResponse<Feature>>(`/features/${id}`);
    return response.data.data;
  }

  static async getFeatures(params?: QueryParams): Promise<ApiResponseOffset<Feature>> {
    const response = await http.get<ApiResponseOffset<Feature>>("/features", { params });
    return response.data;
  }

  static async createFeature(data: CreateFeatureDto): Promise<Feature> {
    const response = await http.post<ApiResponse<Feature>>("/features", data);
    return response.data.data;
  }

  static async updateFeature(id: string, data: UpdateFeatureDto): Promise<Feature> {
    const response = await http.patch<ApiResponse<Feature>>(`/features/${id}`, data);
    return response.data.data;
  }

  static async deleteFeature(id: string): Promise<void> {
    await http.delete(`/features/${id}`);
  }
}
```

### 2. Create Interface
File: `src/lib/interface/{feature}.interface.ts`
- Define Feature type
- Define CreateFeatureDto
- Define UpdateFeatureDto

### 3. Add Query Keys
File: `src/lib/utils/query-keys.ts`
```typescript
feature: {
  all: () => ["feature"] as const,
  lists: () => ["feature", "list"] as const,
  list: (params?: QueryParams) => ["feature", "list", params] as const,
  detail: (id: string) => ["feature", "detail", id] as const,
},
```

### 4. Create Hooks
Directory: `src/hooks/{feature}/`
- `useFeatureQuery.ts` - Query hooks
- `index.ts` - Barrel export

### 5. Create Page (SEO Hybrid Pattern)
Directory: `src/app/{path}/`
- `page.tsx` - Server component with generateMetadata
- `_components/feature-detail-content.tsx` - Client component
- `_components/index.ts` - Barrel export

### 6. Add SEO Support (if public page)
- Server fetch in `src/lib/seo/server-fetch.ts`
- Metadata generator in `src/lib/seo/metadata-generators.ts`
- JSON-LD schema in `src/lib/seo/json-ld/`
- Update sitemap in `src/app/sitemap.ts`

### 7. Add i18n Keys
- `src/i18n/locales/en/{feature}.json`
- `src/i18n/locales/vi/{feature}.json`

## Checklist
- [ ] API wrapper created
- [ ] Interface defined
- [ ] Query keys added
- [ ] Hooks created
- [ ] Page created (hybrid pattern if SEO needed)
- [ ] i18n keys added
- [ ] Loading states implemented
- [ ] Error handling added
- [ ] Toast notifications working

## Reference
- Example feature: `src/app/series/[series_id]/`
- Rules: `.cursor/rules/` or `.agent/rules/`
