# Create API Wrapper Class

Create a new API wrapper class for an entity.

## Arguments
- `$ARGUMENTS`: Entity name and endpoint (e.g., "Studio /studios")

## Instructions

1. **Create interface** at `src/lib/interface/{entity}.interface.ts`:
   ```typescript
   export interface Entity {
     id: string;
     name: string;
     createdAt: string;
     updatedAt: string;
     // Add entity-specific fields
   }

   export interface CreateEntityDto {
     name: string;
     // Add required fields for creation
   }

   export interface UpdateEntityDto {
     name?: string;
     // Add optional fields for update
   }

   export interface EntityQueryDto {
     page?: number;
     limit?: number;
     search?: string;
     sortBy?: string;
     order?: "ASC" | "DESC";
   }
   ```

2. **Create API class** at `src/lib/api/{entity}.ts`:
   ```typescript
   import { http } from "@/lib/http/client";
   import type { ApiResponse, ApiResponseOffset } from "@/lib/types/response";
   import type {
     Entity,
     CreateEntityDto,
     UpdateEntityDto,
     EntityQueryDto,
   } from "@/lib/interface/entity.interface";

   export class EntityAPI {
     private static readonly BASE_PATH = "/entities";

     static async getEntity(id: string): Promise<Entity> {
       const response = await http.get<ApiResponse<Entity>>(
         `${this.BASE_PATH}/${id}`
       );
       return response.data.data;
     }

     static async getEntities(
       params?: EntityQueryDto
     ): Promise<ApiResponseOffset<Entity>["data"]> {
       const response = await http.get<ApiResponseOffset<Entity>>(
         this.BASE_PATH,
         { params }
       );
       return response.data.data;
     }

     static async createEntity(data: CreateEntityDto): Promise<Entity> {
       const response = await http.post<ApiResponse<Entity>>(
         this.BASE_PATH,
         data
       );
       return response.data.data;
     }

     static async updateEntity(
       id: string,
       data: UpdateEntityDto
     ): Promise<Entity> {
       const response = await http.patch<ApiResponse<Entity>>(
         `${this.BASE_PATH}/${id}`,
         data
       );
       return response.data.data;
     }

     static async deleteEntity(id: string): Promise<void> {
       await http.delete(`${this.BASE_PATH}/${id}`);
     }
   }
   ```

3. **Update barrel export** at `src/lib/api/index.ts`

4. **Update interface barrel export** at `src/lib/interface/index.ts`

## Response Types Reference
Located in `src/lib/types/response.ts`:
- `ApiResponse<T>` - Single entity response
- `ApiResponseOffset<T>` - Paginated response (offset-based)
- `ApiResponseCursor<T>` - Paginated response (cursor-based)

## HTTP Client
- Uses axios with interceptors from `@/lib/http/client`
- Automatically handles auth tokens
- Has error interceptor for common error handling

## Reference
- Pattern: `src/lib/api/series.ts`
- HTTP client: `src/lib/http/client.ts`
- Response types: `src/lib/types/response.ts`
- Rule: `.cursor/rules/04-http-client.mdc`
