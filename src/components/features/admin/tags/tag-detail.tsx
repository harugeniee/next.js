"use client";

import {
  ArrowLeft,
  Edit,
  Trash2,
  Calendar,
  Copy,
  Tag as TagIcon,
  TrendingUp,
} from "lucide-react";
import { useState } from "react";
import Link from "next/link";
import { format } from "date-fns";
import { toast } from "sonner";

import { useI18n } from "@/components/providers/i18n-provider";
import { AnimatedSection } from "@/components/shared/animated-section";
import { Skeletonize } from "@/components/shared/skeletonize";
import { Badge } from "@/components/ui/core/badge";
import { Button } from "@/components/ui/core/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/core/card";
import { Skeleton } from "@/components/ui/core/skeleton";
import type { Tag, UpdateTagDto } from "@/lib/api/tags";
import { EditTagFormDialog } from "./edit-tag-form-dialog";

interface TagDetailProps {
  tag?: Tag;
  isLoading: boolean;
  onUpdate: (id: string, data: UpdateTagDto) => Promise<void>;
  onDelete: (tag: Tag) => void;
  isUpdating?: boolean;
}

/**
 * Tag Detail Component
 * Displays detailed tag information with edit and delete functionality
 */
export function TagDetail({
  tag,
  isLoading,
  onUpdate,
  onDelete,
  isUpdating,
}: TagDetailProps) {
  const { t } = useI18n();
  const [showEditDialog, setShowEditDialog] = useState(false);

  const formatDate = (date?: Date | string | null) => {
    if (!date) return "-";
    try {
      const dateObj = typeof date === "string" ? new Date(date) : date;
      return format(dateObj, "PPP");
    } catch {
      return "-";
    }
  };

  const handleSubmit = async (data: UpdateTagDto) => {
    if (tag) {
      await onUpdate(tag.id, data);
      setShowEditDialog(false);
    }
  };

  const handleCopyId = async () => {
    if (!tag?.id) return;
    try {
      await navigator.clipboard.writeText(tag.id);
      toast.success(t("detail.idCopied", "tags"));
    } catch {
      toast.error(t("detail.idCopyError", "tags"));
    }
  };

  return (
    <div className="space-y-6">
      {/* Action Buttons */}
      <AnimatedSection loading={isLoading} data={tag}>
        <div className="flex items-center justify-between">
          <Link href="/admin/tags">
            <Button variant="ghost" size="sm">
              <ArrowLeft className="mr-2 h-4 w-4" />
              {t("actions.back", "common")}
            </Button>
          </Link>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowEditDialog(true)}
              disabled={isUpdating || !tag}
            >
              <Edit className="mr-2 h-4 w-4" />
              {t("actions.edit", "common")}
            </Button>
            <Button
              variant="destructive"
              size="sm"
              onClick={() => tag && onDelete(tag)}
              disabled={isUpdating || !tag}
            >
              <Trash2 className="mr-2 h-4 w-4" />
              {t("actions.delete", "common")}
            </Button>
          </div>
        </div>
      </AnimatedSection>

      {/* Tag Information */}
      {tag ? (
        <AnimatedSection loading={isLoading} data={tag}>
          <Card>
            <CardHeader>
              <CardTitle>{t("detail.information", "tags")}</CardTitle>
              <CardDescription>
                {t("detail.informationDescription", "tags")}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Skeletonize loading={isLoading}>
                {tag ? (
                  <div className="space-y-6">
                    {/* Tag Header */}
                    <div className="flex items-center gap-3 pb-4 border-b">
                      {tag.icon && <span className="text-3xl">{tag.icon}</span>}
                      {tag.color && (
                        <div
                          className="h-8 w-8 rounded-full border-2 border-border"
                          style={{ backgroundColor: tag.color }}
                        />
                      )}
                      <div className="flex-1">
                        <h2 className="text-2xl font-bold">{tag.name}</h2>
                        {tag.slug && (
                          <p className="text-sm text-muted-foreground font-mono mt-1">
                            {tag.slug}
                          </p>
                        )}
                      </div>
                    </div>

                    {/* Tag ID */}
                    {tag.id && (
                      <div className="flex items-center gap-3">
                        <TagIcon className="h-4 w-4 text-muted-foreground" />
                        <div className="flex-1">
                          <div className="text-sm text-muted-foreground">
                            {t("detail.tagId", "tags")}
                          </div>
                          <div className="flex items-center gap-2 mt-1">
                            <code className="font-mono text-xs break-all">
                              {tag.id}
                            </code>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-6 w-6 p-0"
                              onClick={handleCopyId}
                              aria-label={t("detail.copyId", "tags")}
                            >
                              <Copy className="h-3 w-3" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Basic Information */}
                    <div className="grid gap-4 md:grid-cols-2">
                      <div>
                        <label className="text-sm font-medium text-muted-foreground">
                          {t("list.name", "tags")}
                        </label>
                        <p className="mt-1 text-lg font-semibold">{tag.name}</p>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-muted-foreground">
                          {t("list.slug", "tags")}
                        </label>
                        <div className="mt-1">
                          <code className="text-sm font-mono bg-muted px-2 py-1 rounded">
                            {tag.slug}
                          </code>
                        </div>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-muted-foreground">
                          {t("list.status", "tags")}
                        </label>
                        <div className="mt-1">
                          <Badge
                            variant={tag.isActive ? "default" : "secondary"}
                          >
                            {tag.isActive
                              ? t("status.active", "tags")
                              : t("status.inactive", "tags")}
                          </Badge>
                        </div>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-muted-foreground">
                          {t("list.featured", "tags")}
                        </label>
                        <div className="mt-1">
                          <Badge
                            variant={tag.isFeatured ? "default" : "outline"}
                          >
                            {tag.isFeatured
                              ? t("featured.yes", "tags")
                              : t("featured.no", "tags")}
                          </Badge>
                        </div>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-muted-foreground">
                          {t("list.usageCount", "tags")}
                        </label>
                        <div className="mt-1 flex items-center gap-2">
                          <TrendingUp className="h-4 w-4 text-muted-foreground" />
                          <p className="text-lg font-semibold">
                            {tag.usageCount ?? 0}
                          </p>
                        </div>
                      </div>
                      {tag.color && (
                        <div>
                          <label className="text-sm font-medium text-muted-foreground">
                            {t("form.color", "tags")}
                          </label>
                          <div className="mt-1 flex items-center gap-2">
                            <div
                              className="h-6 w-6 rounded border border-border"
                              style={{ backgroundColor: tag.color }}
                            />
                            <code className="text-sm font-mono">
                              {tag.color}
                            </code>
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Description */}
                    {tag.description && (
                      <div className="border-t pt-4">
                        <label className="text-sm font-medium text-muted-foreground">
                          {t("list.description", "tags")}
                        </label>
                        <p className="mt-2 text-sm">{tag.description}</p>
                      </div>
                    )}

                    {/* SEO Information */}
                    {(tag.metaTitle || tag.metaDescription) && (
                      <div className="border-t pt-4">
                        <h3 className="mb-4 text-sm font-medium">
                          {t("detail.seo", "tags")}
                        </h3>
                        <div className="space-y-4">
                          {tag.metaTitle && (
                            <div>
                              <label className="text-sm font-medium text-muted-foreground">
                                {t("form.metaTitle", "tags")}
                              </label>
                              <p className="mt-1 text-sm">{tag.metaTitle}</p>
                            </div>
                          )}
                          {tag.metaDescription && (
                            <div>
                              <label className="text-sm font-medium text-muted-foreground">
                                {t("form.metaDescription", "tags")}
                              </label>
                              <p className="mt-1 text-sm">
                                {tag.metaDescription}
                              </p>
                            </div>
                          )}
                        </div>
                      </div>
                    )}

                    {/* Metadata */}
                    {tag.metadata && Object.keys(tag.metadata).length > 0 && (
                      <div className="border-t pt-4">
                        <h3 className="mb-4 text-sm font-medium">
                          {t("detail.metadata", "tags")}
                        </h3>
                        <pre className="rounded-md bg-muted p-4 text-xs overflow-auto">
                          {JSON.stringify(tag.metadata, null, 2)}
                        </pre>
                      </div>
                    )}

                    {/* Timestamps */}
                    <div className="border-t pt-4">
                      <div className="grid gap-4 md:grid-cols-2">
                        <div className="flex items-center gap-2">
                          <Calendar className="h-4 w-4 text-muted-foreground" />
                          <div>
                            <label className="text-sm font-medium text-muted-foreground">
                              {t("detail.createdAt", "tags")}
                            </label>
                            <p className="mt-1 text-sm">
                              {formatDate(tag.createdAt)}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Calendar className="h-4 w-4 text-muted-foreground" />
                          <div>
                            <label className="text-sm font-medium text-muted-foreground">
                              {t("detail.updatedAt", "tags")}
                            </label>
                            <p className="mt-1 text-sm">
                              {formatDate(tag.updatedAt)}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <Skeleton className="h-8 w-full" />
                    <Skeleton className="h-8 w-full" />
                    <Skeleton className="h-8 w-full" />
                  </div>
                )}
              </Skeletonize>
            </CardContent>
          </Card>
        </AnimatedSection>
      ) : (
        <AnimatedSection loading={isLoading} data={tag}>
          <Card>
            <CardHeader>
              <CardTitle>{t("detail.information", "tags")}</CardTitle>
              <CardDescription>
                {t("detail.informationDescription", "tags")}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <Skeleton className="h-8 w-full" />
                <Skeleton className="h-8 w-full" />
                <Skeleton className="h-8 w-full" />
              </div>
            </CardContent>
          </Card>
        </AnimatedSection>
      )}

      {/* Edit Dialog */}
      <EditTagFormDialog
        open={showEditDialog}
        onOpenChange={setShowEditDialog}
        tag={tag}
        onSubmit={handleSubmit}
        isLoading={isUpdating}
      />
    </div>
  );
}
