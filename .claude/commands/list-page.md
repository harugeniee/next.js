# Create List Page Component

Create a list page with table, pagination, and CRUD actions.

## Arguments
- `$ARGUMENTS`: Entity name and domain (e.g., "Publisher admin" or "Article series")

## Instructions

Parse `$ARGUMENTS` to extract:
- `{Entity}` - PascalCase entity name (e.g., "Publisher")
- `{entity}` - camelCase (e.g., "publisher")
- `{entities}` - plural camelCase (e.g., "publishers")
- `{domain}` - domain folder (e.g., "admin" or "series")

### 1. Create List Component

File: `src/components/features/{domain}/{entities}/{entities}-list.tsx`

```typescript
"use client";

import { Plus } from "lucide-react";
import { useState } from "react";
import { useRouter } from "next/navigation";

import { useI18n } from "@/components/providers/i18n-provider";
import { AnimatedSection } from "@/components/shared/animated-section";
import { Skeletonize } from "@/components/shared/skeletonize";
import { Button } from "@/components/ui/core/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/core/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/core/table";
import { Badge } from "@/components/ui/core/badge";
import { Pagination } from "@/components/ui/pagination";
import type { Create{Entity}Dto, Update{Entity}Dto } from "@/lib/interface";
import type { {Entity} } from "@/lib/interface/{entity}.interface";
import { Create{Entity}FormDialog } from "./create-{entity}-form-dialog";
import { {Entity}Actions } from "./{entity}-actions";

interface {Entities}ListProps {
  data?: {
    result: {Entity}[];
    metaData: {
      currentPage?: number;
      totalPages?: number;
      totalRecords?: number;
    };
  };
  isLoading: boolean;
  page?: number;
  limit?: number;
  onPageChange?: (page: number) => void;
  onCreate: (data: Create{Entity}Dto) => Promise<void>;
  onUpdate: (id: string, data: Update{Entity}Dto) => Promise<void>;
  onDelete: ({entity}: {Entity}) => void;
  isCreating?: boolean;
  isUpdating?: boolean;
}

export function {Entities}List({
  data,
  isLoading,
  page = 1,
  limit: _limit = 20,
  onPageChange,
  onCreate,
  onUpdate,
  onDelete,
  isCreating,
  isUpdating,
}: {Entities}ListProps) {
  const { t } = useI18n();
  const router = useRouter();
  const [showCreateDialog, setShowCreateDialog] = useState(false);

  const handleCreate = async (formData: Create{Entity}Dto) => {
    await onCreate(formData);
    setShowCreateDialog(false);
  };

  const handlePageChange = (newPage: number) => {
    onPageChange?.(newPage);
  };

  const {entities} = data?.result ?? [];
  const metaData = data?.metaData;

  return (
    <AnimatedSection loading={isLoading} data={{entities}} className="w-full">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>{t("{entities}.list.title", "{domain}")}</CardTitle>
              <CardDescription>
                {t("{entities}.list.description", "{domain}")}
              </CardDescription>
            </div>
            <Button size="sm" onClick={() => setShowCreateDialog(true)}>
              <Plus className="mr-2 h-4 w-4" />
              {t("{entities}.list.create", "{domain}")}
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <Skeletonize loading={isLoading}>
            {{entities} && {entities}.length > 0 ? (
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>{t("{entities}.list.name", "{domain}")}</TableHead>
                      <TableHead>{t("{entities}.list.status", "{domain}")}</TableHead>
                      <TableHead>{t("{entities}.list.createdAt", "{domain}")}</TableHead>
                      <TableHead className="text-right">
                        {t("common.actions", "common")}
                      </TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {{entities}.map(({entity}) => (
                      <TableRow
                        key={{entity}.id}
                        className="cursor-pointer hover:bg-muted/50 transition-colors"
                        onClick={() => router.push(`/{domain}/{entities}/${{entity}.id}`)}
                      >
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <span className="font-medium">{{entity}.name}</span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge
                            variant={{entity}.status === "active" ? "default" : "secondary"}
                          >
                            {{entity}.status
                              ? t(`{entities}.status.${{entity}.status}`, "{domain}", {}, {entity}.status)
                              : "-"}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <span className="text-sm text-muted-foreground">
                            {new Date({entity}.createdAt).toLocaleDateString()}
                          </span>
                        </TableCell>
                        <TableCell
                          className="text-right"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <div className="flex items-center justify-end">
                            <{Entity}Actions
                              {entity}={{entity}}
                              onDelete={onDelete}
                              onUpdate={onUpdate}
                              isUpdating={isUpdating}
                            />
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <p className="text-muted-foreground">
                  {t("{entities}.list.empty", "{domain}")}
                </p>
                <Button
                  variant="outline"
                  className="mt-4"
                  onClick={() => setShowCreateDialog(true)}
                >
                  <Plus className="mr-2 h-4 w-4" />
                  {t("{entities}.list.createFirst", "{domain}")}
                </Button>
              </div>
            )}
          </Skeletonize>

          {/* Pagination */}
          {{entities} &&
            {entities}.length > 0 &&
            onPageChange &&
            metaData?.totalPages &&
            metaData.totalPages > 1 && (
              <div className="mt-4">
                <Pagination
                  currentPage={page}
                  totalPages={metaData.totalPages}
                  onPageChange={handlePageChange}
                />
              </div>
            )}
        </CardContent>
      </Card>

      <Create{Entity}FormDialog
        open={showCreateDialog}
        onOpenChange={setShowCreateDialog}
        onSubmit={handleCreate}
        isLoading={isCreating}
      />
    </AnimatedSection>
  );
}

export default {Entities}List;
```

### 2. Create Actions Component

File: `src/components/features/{domain}/{entities}/{entity}-actions.tsx`

```typescript
"use client";

import { MoreHorizontal, Pencil, Trash2, Eye } from "lucide-react";
import { useState } from "react";
import { useRouter } from "next/navigation";

import { useI18n } from "@/components/providers/i18n-provider";
import { Button } from "@/components/ui/core/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/layout/dropdown-menu";
import type { {Entity}, Update{Entity}Dto } from "@/lib/interface/{entity}.interface";
import { Edit{Entity}FormDialog } from "./edit-{entity}-form-dialog";

interface {Entity}ActionsProps {
  {entity}: {Entity};
  onUpdate: (id: string, data: Update{Entity}Dto) => Promise<void>;
  onDelete: ({entity}: {Entity}) => void;
  isUpdating?: boolean;
}

export function {Entity}Actions({
  {entity},
  onUpdate,
  onDelete,
  isUpdating,
}: {Entity}ActionsProps) {
  const { t } = useI18n();
  const router = useRouter();
  const [showEditDialog, setShowEditDialog] = useState(false);

  const handleEdit = async (id: string, data: Update{Entity}Dto) => {
    await onUpdate(id, data);
    setShowEditDialog(false);
  };

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="icon" className="h-8 w-8">
            <MoreHorizontal className="h-4 w-4" />
            <span className="sr-only">{t("common.openMenu", "common")}</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem
            onClick={() => router.push(`/{domain}/{entities}/${{entity}.id}`)}
          >
            <Eye className="mr-2 h-4 w-4" />
            {t("actions.view", "common")}
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => setShowEditDialog(true)}>
            <Pencil className="mr-2 h-4 w-4" />
            {t("actions.edit", "common")}
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem
            onClick={() => onDelete({entity})}
            className="text-destructive focus:text-destructive"
          >
            <Trash2 className="mr-2 h-4 w-4" />
            {t("actions.delete", "common")}
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <Edit{Entity}FormDialog
        open={showEditDialog}
        onOpenChange={setShowEditDialog}
        {entity}={{entity}}
        onSubmit={handleEdit}
        isLoading={isUpdating}
      />
    </>
  );
}
```

### 3. Create Barrel Export

File: `src/components/features/{domain}/{entities}/index.ts`

```typescript
export * from "./{entities}-list";
export * from "./{entity}-actions";
export * from "./create-{entity}-form-dialog";
export * from "./edit-{entity}-form-dialog";
```

## Table Variants

### With Search & Filters
```typescript
<div className="flex items-center gap-4 mb-4">
  <Input
    placeholder={t("{entities}.list.searchPlaceholder", "{domain}")}
    value={searchQuery}
    onChange={(e) => setSearchQuery(e.target.value)}
    className="max-w-sm"
  />
  <Select value={statusFilter} onValueChange={setStatusFilter}>
    <SelectTrigger className="w-[180px]">
      <SelectValue placeholder="Filter by status" />
    </SelectTrigger>
    <SelectContent>
      <SelectItem value="all">All</SelectItem>
      <SelectItem value="active">Active</SelectItem>
      <SelectItem value="inactive">Inactive</SelectItem>
    </SelectContent>
  </Select>
</div>
```

### With Sorting
```typescript
<TableHead
  className="cursor-pointer"
  onClick={() => handleSort("name")}
>
  <div className="flex items-center gap-1">
    {t("{entities}.list.name", "{domain}")}
    {sortField === "name" && (
      sortOrder === "ASC" ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />
    )}
  </div>
</TableHead>
```

### With Selection
```typescript
<TableHead className="w-[50px]">
  <Checkbox
    checked={selectedAll}
    onCheckedChange={handleSelectAll}
  />
</TableHead>
// ...
<TableCell>
  <Checkbox
    checked={selected.includes({entity}.id)}
    onCheckedChange={() => handleSelect({entity}.id)}
  />
</TableCell>
```

## Reference

- Pattern: `src/components/features/admin/studios/studios-list.tsx`
- Pattern: `src/components/features/admin/studios/studio-actions.tsx`
- AnimatedSection: `src/components/shared/animated-section.tsx`
- Skeletonize: `src/components/shared/skeletonize.tsx`
