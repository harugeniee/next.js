# Create Detail Page

Create a detail page for viewing and managing a single entity.

## Arguments
- `$ARGUMENTS`: Entity name and route path (e.g., "Studio admin/studios/[studio_id]")

## Instructions

Parse `$ARGUMENTS` to extract:
- `{Entity}` - PascalCase entity name (e.g., "Studio")
- `{entity}` - camelCase (e.g., "studio")
- `{entity_id}` - route parameter name (e.g., "studio_id")
- `{path}` - route path (e.g., "admin/studios/[studio_id]")

### 1. Create Page Component

File: `src/app/{path}/page.tsx`

```typescript
"use client";

import { useParams, useRouter } from "next/navigation";
import { ArrowLeft, Pencil, Trash2 } from "lucide-react";
import { useState } from "react";

import { useI18n } from "@/components/providers/i18n-provider";
import { AnimatedSection } from "@/components/shared/animated-section";
import { Skeletonize } from "@/components/shared/skeletonize";
import { Button } from "@/components/ui/core/button";
import { Badge } from "@/components/ui/core/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/core/card";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/navigation/breadcrumb";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { use{Entity} } from "@/hooks/admin/use{Entities}";
import { use{Entities} } from "@/hooks/admin/use{Entities}";
import { usePageMetadata } from "@/hooks/ui/use-page-metadata";
import { Edit{Entity}FormDialog } from "@/components/features/admin/{entities}/edit-{entity}-form-dialog";

export default function {Entity}DetailPage() {
  const { t } = useI18n();
  const router = useRouter();
  const params = useParams();
  const {entity}Id = params.{entity_id} as string;

  const [showEditDialog, setShowEditDialog] = useState(false);

  // Fetch {entity} data
  const { data: {entity}, isLoading, error } = use{Entity}({entity}Id);

  // Mutations
  const { update, remove } = use{Entities}();

  usePageMetadata({
    title: {entity}?.name ?? t("{entities}.detail.title", "admin"),
    description: t("{entities}.detail.description", "admin"),
  });

  const handleUpdate = async (id: string, data: Parameters<typeof update.mutateAsync>[0]["dto"]) => {
    await update.mutateAsync({ id, dto: data });
    setShowEditDialog(false);
  };

  const handleDelete = async () => {
    await remove.mutateAsync({entity}Id);
    router.push("/admin/{entities}");
  };

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center py-12">
        <p className="text-destructive">{t("common.error", "common")}</p>
        <Button variant="outline" onClick={() => router.back()} className="mt-4">
          <ArrowLeft className="mr-2 h-4 w-4" />
          {t("common.goBack", "common")}
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Breadcrumb */}
      <AnimatedSection loading={false} data={true}>
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem className="hidden md:block">
              <BreadcrumbLink href="/admin">{t("admin", "common")}</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator className="hidden md:block" />
            <BreadcrumbItem className="hidden md:block">
              <BreadcrumbLink href="/admin/{entities}">
                {t("{entities}.pageTitle", "admin")}
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator className="hidden md:block" />
            <BreadcrumbItem>
              <BreadcrumbPage>
                <Skeletonize loading={isLoading} className="h-4 w-24">
                  {{entity}?.name ?? t("{entities}.detail.title", "admin")}
                </Skeletonize>
              </BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      </AnimatedSection>

      {/* Header */}
      <AnimatedSection loading={isLoading} data={{entity}}>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" onClick={() => router.back()}>
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <div>
              <h1 className="text-3xl font-bold tracking-tight">
                <Skeletonize loading={isLoading} className="h-9 w-48">
                  {{entity}?.name}
                </Skeletonize>
              </h1>
              <div className="flex items-center gap-2 mt-1">
                <Skeletonize loading={isLoading} className="h-5 w-16">
                  {{entity}?.status && (
                    <Badge variant={{entity}.status === "active" ? "default" : "secondary"}>
                      {t(`{entities}.status.${{entity}.status}`, "admin")}
                    </Badge>
                  )}
                </Skeletonize>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" onClick={() => setShowEditDialog(true)}>
              <Pencil className="mr-2 h-4 w-4" />
              {t("actions.edit", "common")}
            </Button>
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="destructive">
                  <Trash2 className="mr-2 h-4 w-4" />
                  {t("actions.delete", "common")}
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>
                    {t("{entities}.detail.deleteTitle", "admin")}
                  </AlertDialogTitle>
                  <AlertDialogDescription>
                    {t("{entities}.detail.deleteDescription", "admin", {
                      name: {entity}?.name,
                    })}
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>{t("common.cancel", "common")}</AlertDialogCancel>
                  <AlertDialogAction
                    onClick={handleDelete}
                    className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                  >
                    {t("actions.delete", "common")}
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        </div>
      </AnimatedSection>

      {/* Content Tabs */}
      <AnimatedSection loading={isLoading} data={{entity}}>
        <Tabs defaultValue="overview" className="space-y-4">
          <TabsList>
            <TabsTrigger value="overview">
              {t("{entities}.detail.tabs.overview", "admin")}
            </TabsTrigger>
            <TabsTrigger value="related">
              {t("{entities}.detail.tabs.related", "admin")}
            </TabsTrigger>
            <TabsTrigger value="settings">
              {t("{entities}.detail.tabs.settings", "admin")}
            </TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>{t("{entities}.detail.info.title", "admin")}</CardTitle>
                <CardDescription>
                  {t("{entities}.detail.info.description", "admin")}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Skeletonize loading={isLoading}>
                  <dl className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <dt className="text-sm font-medium text-muted-foreground">
                        {t("{entities}.detail.info.name", "admin")}
                      </dt>
                      <dd className="mt-1">{entity}?.name}</dd>
                    </div>
                    <div>
                      <dt className="text-sm font-medium text-muted-foreground">
                        {t("{entities}.detail.info.status", "admin")}
                      </dt>
                      <dd className="mt-1">
                        {{entity}?.status && (
                          <Badge variant={{entity}.status === "active" ? "default" : "secondary"}>
                            {t(`{entities}.status.${{entity}.status}`, "admin")}
                          </Badge>
                        )}
                      </dd>
                    </div>
                    <div>
                      <dt className="text-sm font-medium text-muted-foreground">
                        {t("{entities}.detail.info.createdAt", "admin")}
                      </dt>
                      <dd className="mt-1">
                        {{entity}?.createdAt && new Date({entity}.createdAt).toLocaleString()}
                      </dd>
                    </div>
                    <div>
                      <dt className="text-sm font-medium text-muted-foreground">
                        {t("{entities}.detail.info.updatedAt", "admin")}
                      </dt>
                      <dd className="mt-1">
                        {{entity}?.updatedAt && new Date({entity}.updatedAt).toLocaleString()}
                      </dd>
                    </div>
                  </dl>
                </Skeletonize>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="related" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>{t("{entities}.detail.related.title", "admin")}</CardTitle>
                <CardDescription>
                  {t("{entities}.detail.related.description", "admin")}
                </CardDescription>
              </CardHeader>
              <CardContent>
                {/* Related items list */}
                <p className="text-muted-foreground">
                  {t("{entities}.detail.related.empty", "admin")}
                </p>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="settings" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>{t("{entities}.detail.settings.title", "admin")}</CardTitle>
                <CardDescription>
                  {t("{entities}.detail.settings.description", "admin")}
                </CardDescription>
              </CardHeader>
              <CardContent>
                {/* Settings form */}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </AnimatedSection>

      {/* Edit Dialog */}
      {{entity} && (
        <Edit{Entity}FormDialog
          open={showEditDialog}
          onOpenChange={setShowEditDialog}
          {entity}={{entity}}
          onSubmit={handleUpdate}
          isLoading={update.isPending}
        />
      )}
    </div>
  );
}
```

### 2. Add i18n Keys

Add to `src/i18n/locales/en/admin.json`:

```json
"{entities}": {
  "detail": {
    "title": "{Entity} Detail",
    "description": "View and manage {entity} details",
    "deleteTitle": "Delete {Entity}",
    "deleteDescription": "Are you sure you want to delete {name}? This action cannot be undone.",
    "tabs": {
      "overview": "Overview",
      "related": "Related Items",
      "settings": "Settings"
    },
    "info": {
      "title": "{Entity} Information",
      "description": "Basic information about this {entity}",
      "name": "Name",
      "status": "Status",
      "createdAt": "Created At",
      "updatedAt": "Updated At"
    },
    "related": {
      "title": "Related Items",
      "description": "Items associated with this {entity}",
      "empty": "No related items found"
    },
    "settings": {
      "title": "Settings",
      "description": "Configure {entity} settings"
    }
  }
}
```

## Variants

### With SEO (Hybrid Pattern)

For public detail pages, use the SEO hybrid pattern:

```typescript
// page.tsx (Server Component)
import type { Metadata } from "next";
import { fetch{Entity}ForSEO } from "@/lib/seo/server-fetch";
import { generate{Entity}Metadata } from "@/lib/seo/metadata-generators";
import { generate{Entity}JsonLd } from "@/lib/seo/json-ld";
import { JsonLdScript } from "@/components/seo";
import { {Entity}DetailContent } from "./_components";

interface Props {
  params: Promise<{ {entity_id}: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { {entity_id} } = await params;
  const {entity} = await fetch{Entity}ForSEO({entity_id});
  return generate{Entity}Metadata({entity}, {entity_id});
}

export default async function {Entity}DetailPage({ params }: Props) {
  const { {entity_id} } = await params;
  const {entity} = await fetch{Entity}ForSEO({entity_id});

  return (
    <>
      {{entity} && <JsonLdScript data={generate{Entity}JsonLd({entity}, {entity_id})} />}
      <{Entity}DetailContent {entity}Id={{entity_id}} />
    </>
  );
}
```

### With Sidebar Navigation

```typescript
<div className="flex gap-6">
  <aside className="w-64 shrink-0">
    <nav className="sticky top-4 space-y-1">
      {sections.map((section) => (
        <Button
          key={section.id}
          variant={activeSection === section.id ? "secondary" : "ghost"}
          className="w-full justify-start"
          onClick={() => setActiveSection(section.id)}
        >
          {section.icon}
          {section.label}
        </Button>
      ))}
    </nav>
  </aside>
  <main className="flex-1">
    {/* Content */}
  </main>
</div>
```

## Reference

- Pattern: `src/app/admin/studios/[studio_id]/page.tsx`
- SEO Pattern: `src/app/series/[series_id]/page.tsx`
- Rule: `.cursor/rules/02-routing-pages.mdc`
- Rule: `.cursor/rules/16-seo.mdc`
