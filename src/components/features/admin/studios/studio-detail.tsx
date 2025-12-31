"use client";

import {
  ArrowLeft,
  Edit,
  Trash2,
  Calendar,
  Link as LinkIcon,
  Info,
  BookOpen,
  Copy,
  Shield,
} from "lucide-react";
import { useState } from "react";
import Link from "next/link";
import { format } from "date-fns";
import { toast } from "sonner";

import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/animate-ui/components/radix/tabs";
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
import type { Studio, UpdateStudioDto } from "@/lib/interface/studio.interface";
import { EditStudioFormDialog } from "./edit-studio-form-dialog";
import { StudioSeriesList } from "./studio-series-list";

interface StudioDetailProps {
  studio?: Studio;
  isLoading: boolean;
  onUpdate: (id: string, data: UpdateStudioDto) => Promise<void>;
  onDelete: (studio: Studio) => void;
  isUpdating?: boolean;
}

/**
 * Studio Detail Component
 * Displays detailed studio information with edit and delete functionality
 */
export function StudioDetail({
  studio,
  isLoading,
  onUpdate,
  onDelete,
  isUpdating,
}: StudioDetailProps) {
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

  const handleSubmit = async (data: UpdateStudioDto) => {
    if (studio) {
      await onUpdate(studio.id, data);
      setShowEditDialog(false);
    }
  };

  const handleCopyId = async () => {
    if (!studio?.id) return;
    try {
      await navigator.clipboard.writeText(studio.id);
      toast.success(t("studios.detail.idCopied", "admin"));
    } catch {
      toast.error(t("studios.detail.idCopyError", "admin"));
    }
  };

  return (
    <div className="space-y-6">
      {/* Action Buttons */}
      <AnimatedSection loading={isLoading} data={studio}>
        <div className="flex items-center justify-between">
          <Link href="/admin/studios">
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
              disabled={isUpdating || !studio}
            >
              <Edit className="mr-2 h-4 w-4" />
              {t("actions.edit", "common")}
            </Button>
            <Button
              variant="destructive"
              size="sm"
              onClick={() => studio && onDelete(studio)}
              disabled={isUpdating || !studio}
            >
              <Trash2 className="mr-2 h-4 w-4" />
              {t("actions.delete", "common")}
            </Button>
          </div>
        </div>
      </AnimatedSection>

      {/* Tabs */}
      {studio ? (
        <Tabs defaultValue="detail" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="detail">
              <Info className="mr-2 h-4 w-4" />
              {t("studios.detail.tabs.detail", "admin")}
            </TabsTrigger>
            <TabsTrigger value="series">
              <BookOpen className="mr-2 h-4 w-4" />
              {t("studios.detail.tabs.series", "admin")}
            </TabsTrigger>
          </TabsList>

          {/* Detail Tab */}
          <TabsContent value="detail" className="mt-6">
            <AnimatedSection loading={isLoading} data={studio}>
              <Card>
                <CardHeader>
                  <CardTitle>
                    {t("studios.detail.information", "admin")}
                  </CardTitle>
                  <CardDescription>
                    {t("studios.detail.informationDescription", "admin")}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Skeletonize loading={isLoading}>
                    {studio ? (
                      <div className="space-y-6">
                        {/* Studio ID */}
                        {studio.id && (
                          <div className="flex items-center gap-3">
                            <Shield className="h-4 w-4 text-muted-foreground" />
                            <div className="flex-1">
                              <div className="text-sm text-muted-foreground">
                                {t("studios.detail.studioId", "admin")}
                              </div>
                              <div className="flex items-center gap-2 mt-1">
                                <code className="font-mono text-xs break-all">
                                  {studio.id}
                                </code>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  className="h-6 w-6 p-0"
                                  onClick={handleCopyId}
                                  aria-label={t("studios.detail.copyId", "admin")}
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
                              {t("studios.list.name", "admin")}
                            </label>
                            <p className="mt-1 text-lg font-semibold">
                              {studio.name}
                            </p>
                          </div>
                          <div>
                            <label className="text-sm font-medium text-muted-foreground">
                              {t("studios.list.type", "admin")}
                            </label>
                            <div className="mt-1">
                              <Badge variant="outline">
                                {studio.type
                                  ? t(
                                      `studios.types.${studio.type}`,
                                      "admin",
                                      {},
                                      studio.type,
                                    )
                                  : "-"}
                              </Badge>
                            </div>
                          </div>
                          <div>
                            <label className="text-sm font-medium text-muted-foreground">
                              {t("studios.list.status", "admin")}
                            </label>
                            <div className="mt-1">
                              <Badge
                                variant={
                                  studio.status === "active"
                                    ? "default"
                                    : studio.status === "inactive"
                                      ? "secondary"
                                      : "outline"
                                }
                              >
                                {studio.status
                                  ? t(
                                      `studios.status.${studio.status}`,
                                      "admin",
                                      {},
                                      studio.status,
                                    )
                                  : "-"}
                              </Badge>
                            </div>
                          </div>
                          {studio.siteUrl && (
                            <div>
                              <label className="text-sm font-medium text-muted-foreground">
                                {t("studios.list.siteUrl", "admin")}
                              </label>
                              <div className="mt-1">
                                <a
                                  href={studio.siteUrl}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="flex items-center gap-2 text-sm text-primary hover:underline"
                                >
                                  <LinkIcon className="h-4 w-4" />
                                  {studio.siteUrl}
                                </a>
                              </div>
                            </div>
                          )}
                        </div>

                        {/* External IDs */}
                        {(studio.myAnimeListId || studio.aniListId) && (
                          <div className="border-t pt-4">
                            <h3 className="mb-4 text-sm font-medium">
                              {t("studios.detail.externalIds", "admin")}
                            </h3>
                            <div className="grid gap-4 md:grid-cols-2">
                              {studio.myAnimeListId && (
                                <div>
                                  <label className="text-sm font-medium text-muted-foreground">
                                    {t("studios.form.myAnimeListId", "admin")}
                                  </label>
                                  <p className="mt-1">
                                    {studio.myAnimeListId}
                                  </p>
                                </div>
                              )}
                              {studio.aniListId && (
                                <div>
                                  <label className="text-sm font-medium text-muted-foreground">
                                    {t("studios.form.aniListId", "admin")}
                                  </label>
                                  <p className="mt-1">{studio.aniListId}</p>
                                </div>
                              )}
                            </div>
                          </div>
                        )}

                        {/* Metadata */}
                        {studio.metadata &&
                          Object.keys(studio.metadata).length > 0 && (
                            <div className="border-t pt-4">
                              <h3 className="mb-4 text-sm font-medium">
                                {t("studios.detail.metadata", "admin")}
                              </h3>
                              <pre className="rounded-md bg-muted p-4 text-xs">
                                {JSON.stringify(studio.metadata, null, 2)}
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
                                  {t("studios.detail.createdAt", "admin")}
                                </label>
                                <p className="mt-1 text-sm">
                                  {formatDate(studio.createdAt)}
                                </p>
                              </div>
                            </div>
                            <div className="flex items-center gap-2">
                              <Calendar className="h-4 w-4 text-muted-foreground" />
                              <div>
                                <label className="text-sm font-medium text-muted-foreground">
                                  {t("studios.detail.updatedAt", "admin")}
                                </label>
                                <p className="mt-1 text-sm">
                                  {formatDate(studio.updatedAt)}
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
          </TabsContent>

          {/* Series Tab */}
          <TabsContent value="series" className="mt-6">
            <StudioSeriesList studio={studio} isLoading={isLoading} />
          </TabsContent>
        </Tabs>
      ) : (
        <AnimatedSection loading={isLoading} data={studio}>
          <Card>
            <CardHeader>
              <CardTitle>{t("studios.detail.information", "admin")}</CardTitle>
              <CardDescription>
                {t("studios.detail.informationDescription", "admin")}
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
      <EditStudioFormDialog
        open={showEditDialog}
        onOpenChange={setShowEditDialog}
        studio={studio}
        onSubmit={handleSubmit}
        isLoading={isUpdating}
      />
    </div>
  );
}
