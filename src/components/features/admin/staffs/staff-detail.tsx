"use client";

import {
  ArrowLeft,
  Edit,
  Trash2,
  Calendar,
  Globe,
  Info,
  Clapperboard,
  User,
} from "lucide-react";
import { useState } from "react";
import Link from "next/link";
import Image from "next/image";

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
import type { Staff } from "@/lib/interface/staff.interface";
import type { UpdateStaffFormData } from "@/lib/validators/staffs";
import { StaffForm } from "./staff-form";
import { StaffSeriesList } from "./staff-series-list";
import { StaffCharacterManagement } from "./staff-character-management";

interface StaffDetailProps {
  staff?: Staff;
  isLoading: boolean;
  onUpdate: (id: string, data: UpdateStaffFormData) => Promise<void>;
  onDelete: (staff: Staff) => void;
  isUpdating?: boolean;
}

/**
 * Staff Detail Component
 * Displays detailed staff information with edit and delete functionality
 */
export function StaffDetail({
  staff,
  isLoading,
  onUpdate,
  onDelete,
  isUpdating,
}: StaffDetailProps) {
  const { t } = useI18n();
  const [isEditMode, setIsEditMode] = useState(false);

  const formatDate = (date?: Date | string | null) => {
    if (!date) return "-";
    try {
      const dateObj = typeof date === "string" ? new Date(date) : date;
      return new Intl.DateTimeFormat("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      }).format(dateObj);
    } catch {
      return "-";
    }
  };

  const handleEdit = () => {
    setIsEditMode(true);
  };

  const handleCancelEdit = () => {
    setIsEditMode(false);
  };

  const handleSubmitEdit = async (data: UpdateStaffFormData) => {
    if (!staff) return;
    try {
      await onUpdate(staff.id, data);
      setIsEditMode(false);
    } catch (error) {
      // Error handled by mutation
      throw error;
    }
  };

  const handleDelete = () => {
    if (!staff) return;
    onDelete(staff);
  };

  const staffName =
    staff?.name?.full ||
    staff?.name?.userPreferred ||
    staff?.name?.first ||
    "Unknown Staff";

  return (
    <div className="space-y-6">
      {/* Header with Actions */}
      <AnimatedSection loading={isLoading} data={staff}>
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-4">
            <Link href="/admin/staffs">
              <Button variant="outline" size="sm">
                <ArrowLeft className="mr-2 h-4 w-4" />
                {t("actions.back", "common")}
              </Button>
            </Link>
          </div>

          <Skeletonize loading={isLoading}>
            {staff && !isEditMode ? (
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleEdit}
                  disabled={isUpdating}
                >
                  <Edit className="mr-2 h-4 w-4" />
                  {t("actions.edit", "common")}
                </Button>
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={handleDelete}
                  disabled={isUpdating}
                >
                  <Trash2 className="mr-2 h-4 w-4" />
                  {t("actions.delete", "common")}
                </Button>
              </div>
            ) : isEditMode ? (
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleCancelEdit}
                  disabled={isUpdating}
                >
                  {t("actions.cancel", "common")}
                </Button>
              </div>
            ) : (
              <div className="flex gap-2">
                <Skeleton className="h-9 w-20" />
                <Skeleton className="h-9 w-20" />
              </div>
            )}
          </Skeletonize>
        </div>
      </AnimatedSection>

      {/* Staff Information - Tabs or Edit Form */}
      {isEditMode && staff ? (
        <AnimatedSection loading={false} data={true}>
          <Card>
            <CardHeader>
              <CardTitle>{t("form.editTitle", "staff")}</CardTitle>
              <CardDescription>
                {t("form.editDescription", "staff")}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <StaffForm
                staff={staff}
                onSubmit={handleSubmitEdit}
                onCancel={handleCancelEdit}
                isLoading={isUpdating}
              />
            </CardContent>
          </Card>
        </AnimatedSection>
      ) : (
        <Tabs defaultValue="detail" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="detail">
              <Info className="mr-2 h-4 w-4" />
              {t("detail.title", "staff")}
            </TabsTrigger>
            <TabsTrigger value="characters">
              <User className="mr-2 h-4 w-4" />
              {t("detail.characterRoles", "staff")}
            </TabsTrigger>
            <TabsTrigger value="series">
              <Clapperboard className="mr-2 h-4 w-4" />
              {t("detail.seriesRoles", "staff")}
            </TabsTrigger>
          </TabsList>

          {/* Detail Tab - All staff information */}
          <TabsContent value="detail" className="mt-6">
            <div className="space-y-6">
              <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
                {/* Basic Information */}
                <AnimatedSection loading={isLoading} data={staff}>
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <User className="h-5 w-5" />
                        {t("detail.personalInfo", "staff")}
                      </CardTitle>
                      <CardDescription>
                        {t("detail.description", "staff")}
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <Skeletonize loading={isLoading}>
                        {staff ? (
                          <div className="space-y-4">
                            {/* Profile Image */}
                            {staff.imageUrls?.medium && (
                              <div className="flex justify-center">
                                <div className="relative h-48 w-48 overflow-hidden rounded-lg">
                                  <Image
                                    src={staff.imageUrls.medium}
                                    alt={staffName}
                                    fill
                                    className="object-cover"
                                    sizes="192px"
                                  />
                                </div>
                              </div>
                            )}

                            {/* Names */}
                            <div className="space-y-3">
                              {staff.name?.full && (
                                <div>
                                  <label className="text-sm font-medium text-muted-foreground">
                                    {t("form.nameFull", "staff")}
                                  </label>
                                  <p className="mt-1">{staff.name.full}</p>
                                </div>
                              )}
                              {staff.name?.native && (
                                <div>
                                  <label className="text-sm font-medium text-muted-foreground">
                                    {t("form.nameNative", "staff")}
                                  </label>
                                  <p className="mt-1">{staff.name.native}</p>
                                </div>
                              )}
                              {staff.name?.userPreferred && (
                                <div>
                                  <label className="text-sm font-medium text-muted-foreground">
                                    {t("form.nameUserPreferred", "staff")}
                                  </label>
                                  <p className="mt-1">
                                    {staff.name.userPreferred}
                                  </p>
                                </div>
                              )}
                              {staff.name?.alternative &&
                                staff.name.alternative.length > 0 && (
                                  <div>
                                    <label className="text-sm font-medium text-muted-foreground">
                                      {t("form.nameAlternative", "staff")}
                                    </label>
                                    <div className="mt-2 flex flex-wrap gap-2">
                                      {staff.name.alternative.map(
                                        (name, idx) => (
                                          <Badge key={idx} variant="outline">
                                            {name}
                                          </Badge>
                                        ),
                                      )}
                                    </div>
                                  </div>
                                )}
                            </div>

                            {/* Personal Details */}
                            <div className="space-y-3 border-t pt-4">
                              <div className="grid gap-3 sm:grid-cols-2">
                                <div>
                                  <label className="text-sm font-medium text-muted-foreground">
                                    {t("form.gender", "staff")}
                                  </label>
                                  <p className="mt-1">
                                    {staff.gender
                                      ? t(
                                          `form.genderOptions.${staff.gender}`,
                                          "staff",
                                          {},
                                          staff.gender,
                                        )
                                      : "-"}
                                  </p>
                                </div>
                                <div>
                                  <label className="text-sm font-medium text-muted-foreground">
                                    {t("form.language", "staff")}
                                  </label>
                                  <p className="mt-1">
                                    {staff.language || "-"}
                                  </p>
                                </div>
                              </div>

                              <div className="grid gap-3 sm:grid-cols-2">
                                <div>
                                  <label className="text-sm font-medium text-muted-foreground flex items-center gap-1">
                                    <Calendar className="h-3 w-3" />
                                    {t("detail.dateOfBirth", "staff")}
                                  </label>
                                  <p className="mt-1">
                                    {formatDate(staff.dateOfBirth)}
                                  </p>
                                </div>
                                <div>
                                  <label className="text-sm font-medium text-muted-foreground">
                                    {t("detail.age", "staff")}
                                  </label>
                                  <p className="mt-1">{staff.age || "-"}</p>
                                </div>
                              </div>

                              <div className="grid gap-3 sm:grid-cols-2">
                                <div>
                                  <label className="text-sm font-medium text-muted-foreground">
                                    {t("detail.homeTown", "staff")}
                                  </label>
                                  <p className="mt-1">
                                    {staff.homeTown || "-"}
                                  </p>
                                </div>
                                <div>
                                  <label className="text-sm font-medium text-muted-foreground">
                                    {t("detail.bloodType", "staff")}
                                  </label>
                                  <p className="mt-1">
                                    {staff.bloodType || "-"}
                                  </p>
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

                {/* Professional Information */}
                <AnimatedSection loading={isLoading} data={staff}>
                  <Card>
                    <CardHeader>
                      <CardTitle>
                        {t("detail.professionalInfo", "staff")}
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <Skeletonize loading={isLoading}>
                        {staff ? (
                          <div className="space-y-4">
                            {/* Primary Occupations */}
                            {staff.primaryOccupations &&
                              staff.primaryOccupations.length > 0 && (
                                <div>
                                  <label className="text-sm font-medium text-muted-foreground">
                                    {t("form.primaryOccupations", "staff")}
                                  </label>
                                  <div className="mt-2 flex flex-wrap gap-2">
                                    {staff.primaryOccupations.map(
                                      (occupation, index) => (
                                        <Badge key={index} variant="default">
                                          {occupation}
                                        </Badge>
                                      ),
                                    )}
                                  </div>
                                </div>
                              )}

                            {/* Status */}
                            <div>
                              <label className="text-sm font-medium text-muted-foreground">
                                {t("form.status", "staff")}
                              </label>
                              <div className="mt-2">
                                <Badge
                                  variant={
                                    staff.status === "active"
                                      ? "default"
                                      : "secondary"
                                  }
                                >
                                  {staff.status
                                    ? t(
                                        `form.statusOptions.${staff.status}`,
                                        "staff",
                                        {},
                                        staff.status,
                                      )
                                    : "-"}
                                </Badge>
                              </div>
                            </div>

                            {/* Debut Date */}
                            {staff.debutDate && (
                              <div>
                                <label className="text-sm font-medium text-muted-foreground flex items-center gap-1">
                                  <Calendar className="h-3 w-3" />
                                  {t("detail.debutDate", "staff")}
                                </label>
                                <p className="mt-1">
                                  {formatDate(staff.debutDate)}
                                </p>
                              </div>
                            )}

                            {/* Description */}
                            {staff.description && (
                              <div className="border-t pt-4">
                                <label className="text-sm font-medium text-muted-foreground">
                                  {t("form.description", "staff")}
                                </label>
                                <div className="prose dark:prose-invert max-w-none mt-2">
                                  <p className="text-sm whitespace-pre-wrap">
                                    {staff.description}
                                  </p>
                                </div>
                              </div>
                            )}
                          </div>
                        ) : (
                          <div className="space-y-4">
                            <Skeleton className="h-8 w-full" />
                            <Skeleton className="h-8 w-full" />
                          </div>
                        )}
                      </Skeletonize>
                    </CardContent>
                  </Card>
                </AnimatedSection>
              </div>

              {/* External IDs & Links */}
              {staff &&
                (staff.myAnimeListId || staff.aniListId || staff.siteUrl) && (
                  <AnimatedSection loading={isLoading} data={staff}>
                    <Card>
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                          <Globe className="h-5 w-5" />
                          {t("detail.externalIds", "staff")}
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                          {staff.myAnimeListId && (
                            <div>
                              <label className="text-sm font-medium text-muted-foreground">
                                {t("form.myAnimeListId", "staff")}
                              </label>
                              <p className="mt-1 font-mono text-sm">
                                {staff.myAnimeListId}
                              </p>
                            </div>
                          )}
                          {staff.aniListId && (
                            <div>
                              <label className="text-sm font-medium text-muted-foreground">
                                {t("form.aniListId", "staff")}
                              </label>
                              <p className="mt-1 font-mono text-sm">
                                {staff.aniListId}
                              </p>
                            </div>
                          )}
                          {staff.siteUrl && (
                            <div className="sm:col-span-2 lg:col-span-1">
                              <label className="text-sm font-medium text-muted-foreground">
                                {t("detail.siteUrl", "staff")}
                              </label>
                              <div className="mt-1">
                                <a
                                  href={staff.siteUrl}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="text-sm text-primary hover:underline flex items-center gap-1"
                                >
                                  <Globe className="h-3 w-3" />
                                  {t("detail.siteUrl", "staff")}
                                </a>
                              </div>
                            </div>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  </AnimatedSection>
                )}

              {/* Metadata */}
              {staff && (
                <AnimatedSection loading={isLoading} data={staff}>
                  <Card>
                    <CardHeader>
                      <CardTitle>{t("form.metadata", "staff")}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="grid gap-4 sm:grid-cols-2">
                        <div>
                          <label className="text-sm font-medium text-muted-foreground">
                            {t("detail.createdAt", "staff")}
                          </label>
                          <p className="mt-1 text-sm">
                            {formatDate(staff.createdAt)}
                          </p>
                        </div>
                        <div>
                          <label className="text-sm font-medium text-muted-foreground">
                            {t("detail.updatedAt", "staff")}
                          </label>
                          <p className="mt-1 text-sm">
                            {formatDate(staff.updatedAt)}
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </AnimatedSection>
              )}
            </div>
          </TabsContent>

          {/* Characters Tab */}
          <TabsContent value="characters" className="mt-6">
            <StaffCharacterManagement staff={staff} isLoading={isLoading} />
          </TabsContent>

          {/* Series Tab */}
          <TabsContent value="series" className="mt-6">
            <StaffSeriesList staff={staff} isLoading={isLoading} />
          </TabsContent>
        </Tabs>
      )}
    </div>
  );
}
