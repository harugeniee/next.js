"use client";

import { Calendar, Key, Palette, Shield } from "lucide-react";

import { useI18n } from "@/components/providers/i18n-provider";
import { AnimatedSection } from "@/components/shared/animated-section";
import { Skeletonize } from "@/components/shared/skeletonize";
import { Badge } from "@/components/ui/core/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/core/card";
import { Skeleton } from "@/components/ui/core/skeleton";
import { Separator } from "@/components/ui/layout/separator";
import { format } from "date-fns";
import type { Role } from "@/lib/interface/permission.interface";

interface RoleDetailsTabProps {
  role?: Role;
  isLoading: boolean;
}

/**
 * RoleDetailsTab Component
 * Displays role information and metadata in the Details tab
 */
export function RoleDetailsTab({
  role,
  isLoading,
}: RoleDetailsTabProps) {
  const { t } = useI18n();

  const formatDate = (date?: Date | string) => {
    if (!date) return "-";
    try {
      const dateObj = typeof date === "string" ? new Date(date) : date;
      return format(dateObj, "PPP");
    } catch {
      return "-";
    }
  };

  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
      {/* Role Information */}
      <AnimatedSection loading={isLoading} data={role}>
        <Card>
          <CardHeader>
            <CardTitle>
              {t("detail.sections.roleInfo", "permissions")}
            </CardTitle>
            <CardDescription>
              {t("detail.sections.roleInfoDesc", "permissions")}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Skeletonize loading={isLoading}>
              {role ? (
                <>
                  <div className="flex items-center gap-3">
                    <Shield className="h-4 w-4 text-muted-foreground" />
                    <div className="flex-1">
                      <div className="text-sm text-muted-foreground">
                        {t("fields.name", "permissions")}
                      </div>
                      <div className="font-medium">{role.name}</div>
                    </div>
                  </div>
                  {role.description && (
                    <div className="flex items-center gap-3">
                      <Key className="h-4 w-4 text-muted-foreground" />
                      <div className="flex-1">
                        <div className="text-sm text-muted-foreground">
                          {t("fields.description", "permissions")}
                        </div>
                        <div className="font-medium">{role.description}</div>
                      </div>
                    </div>
                  )}
                  <div className="flex items-center gap-3">
                    <Shield className="h-4 w-4 text-muted-foreground" />
                    <div className="flex-1">
                      <div className="text-sm text-muted-foreground">
                        {t("fields.position", "permissions")}
                      </div>
                      <Badge variant="outline" className="mt-1">
                        {role.position}
                      </Badge>
                    </div>
                  </div>
                  {role.color && (
                    <div className="flex items-center gap-3">
                      <Palette className="h-4 w-4 text-muted-foreground" />
                      <div className="flex-1">
                        <div className="text-sm text-muted-foreground">
                          {t("fields.color", "permissions")}
                        </div>
                        <div className="flex items-center gap-2 mt-1">
                          <div
                            className="h-6 w-6 rounded border"
                            style={{ backgroundColor: role.color }}
                          />
                          <span className="font-medium">{role.color}</span>
                        </div>
                      </div>
                    </div>
                  )}
                  <Separator />
                  <div className="space-y-2">
                    <div className="text-sm text-muted-foreground">
                      {t("fields.mentionable", "permissions")}
                    </div>
                    <Badge variant={role.mentionable ? "default" : "secondary"}>
                      {role.mentionable ? t("yes", "common") : t("no", "common")}
                    </Badge>
                  </div>
                  <div className="space-y-2">
                    <div className="text-sm text-muted-foreground">
                      {t("fields.managed", "permissions")}
                    </div>
                    <Badge variant={role.managed ? "default" : "secondary"}>
                      {role.managed ? t("yes", "common") : t("no", "common")}
                    </Badge>
                  </div>
                  {role.icon && (
                    <div className="flex items-center gap-3">
                      <Key className="h-4 w-4 text-muted-foreground" />
                      <div className="flex-1">
                        <div className="text-sm text-muted-foreground">
                          {t("fields.icon", "permissions")}
                        </div>
                        <div className="font-medium break-all text-xs">
                          {role.icon}
                        </div>
                      </div>
                    </div>
                  )}
                  {role.unicodeEmoji && (
                    <div className="flex items-center gap-3">
                      <Key className="h-4 w-4 text-muted-foreground" />
                      <div className="flex-1">
                        <div className="text-sm text-muted-foreground">
                          {t("fields.unicodeEmoji", "permissions")}
                        </div>
                        <div className="text-2xl">{role.unicodeEmoji}</div>
                      </div>
                    </div>
                  )}
                </>
              ) : (
                <div className="space-y-4">
                  <Skeleton className="h-12 w-full" />
                  <Skeleton className="h-12 w-full" />
                  <Skeleton className="h-12 w-full" />
                </div>
              )}
            </Skeletonize>
          </CardContent>
        </Card>
      </AnimatedSection>

      {/* Metadata */}
      <AnimatedSection loading={isLoading} data={role}>
        <Card>
          <CardHeader>
            <CardTitle>
              {t("detail.sections.metadata", "permissions")}
            </CardTitle>
            <CardDescription>
              {t("detail.sections.metadataDesc", "permissions")}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Skeletonize loading={isLoading}>
              {role ? (
                <>
                  <div className="flex items-center gap-3">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    <div className="flex-1">
                      <div className="text-sm text-muted-foreground">
                        {t("detail.fields.createdAt", "permissions")}
                      </div>
                      <div className="font-medium">
                        {formatDate(role.createdAt)}
                      </div>
                    </div>
                  </div>
                  {role.updatedAt && (
                    <div className="flex items-center gap-3">
                      <Calendar className="h-4 w-4 text-muted-foreground" />
                      <div className="flex-1">
                        <div className="text-sm text-muted-foreground">
                          {t("detail.fields.updatedAt", "permissions")}
                        </div>
                        <div className="font-medium">
                          {formatDate(role.updatedAt)}
                        </div>
                      </div>
                    </div>
                  )}
                  {role.id && (
                    <div className="flex items-center gap-3">
                      <Shield className="h-4 w-4 text-muted-foreground" />
                      <div className="flex-1">
                        <div className="text-sm text-muted-foreground">
                          {t("detail.fields.roleId", "permissions")}
                        </div>
                        <div className="font-mono text-xs break-all">
                          {role.id}
                        </div>
                      </div>
                    </div>
                  )}
                </>
              ) : (
                <div className="space-y-4">
                  <Skeleton className="h-12 w-full" />
                  <Skeleton className="h-12 w-full" />
                  <Skeleton className="h-12 w-full" />
                </div>
              )}
            </Skeletonize>
          </CardContent>
        </Card>
      </AnimatedSection>
    </div>
  );
}

