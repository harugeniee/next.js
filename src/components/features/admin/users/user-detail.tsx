"use client";

import { ArrowLeft, Edit, Trash2, Calendar, Mail, Phone, Shield, User as UserIcon, CheckCircle2, XCircle } from "lucide-react";
import { useState } from "react";
import Link from "next/link";
import { format } from "date-fns";

import { useI18n } from "@/components/providers/i18n-provider";
import { AnimatedSection } from "@/components/shared/animated-section";
import { Skeletonize } from "@/components/shared/skeletonize";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/core/avatar";
import { Badge } from "@/components/ui/core/badge";
import { Button } from "@/components/ui/core/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/core/card";
import { Separator } from "@/components/ui/layout/separator";
import { Skeleton } from "@/components/ui/core/skeleton";
import type { User } from "@/lib/interface/user.interface";
import { USER_CONSTANTS } from "@/lib/constants/user.constants";
import { UserFormDialog } from "./user-form-dialog";

interface UserDetailProps {
  user?: User;
  isLoading: boolean;
  onUpdate: (id: string, data: any) => Promise<void>;
  onDelete: (user: User) => void;
  isUpdating?: boolean;
}

export function UserDetail({
  user,
  isLoading,
  onUpdate,
  onDelete,
  isUpdating,
}: UserDetailProps) {
  const { t } = useI18n();
  const [showEditDialog, setShowEditDialog] = useState(false);

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
    <div className="space-y-6">
      {/* Back Button */}
      <AnimatedSection loading={false} data={true}>
        <Button variant="ghost" asChild>
          <Link href="/admin/users">
            <ArrowLeft className="mr-2 h-4 w-4" />
            {t("users.detail.actions.back", "admin")}
          </Link>
        </Button>
      </AnimatedSection>

      {/* User Header Card */}
      <AnimatedSection loading={isLoading} data={user}>
        <Card>
          <CardHeader>
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-4">
                <Skeletonize loading={isLoading}>
                  {user ? (
                    <Avatar className="h-20 w-20">
                      <AvatarImage src={user.avatar?.url || user.photoUrl} alt={user.username} />
                      <AvatarFallback className="text-lg">
                        {user.username.substring(0, 2).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                  ) : (
                    <div className="h-20 w-20 rounded-full bg-muted" />
                  )}
                </Skeletonize>
                <div>
                  <Skeletonize loading={isLoading}>
                    {user ? (
                      <>
                        <CardTitle className="text-2xl">
                          {user.name || user.username}
                        </CardTitle>
                        <CardDescription className="text-base">
                          @{user.username}
                        </CardDescription>
                      </>
                    ) : (
                      <>
                        <Skeleton className="h-8 w-48 mb-2" />
                        <Skeleton className="h-4 w-32" />
                      </>
                    )}
                  </Skeletonize>
                </div>
              </div>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  onClick={() => setShowEditDialog(true)}
                  disabled={isLoading}
                >
                  <Edit className="mr-2 h-4 w-4" />
                  {t("users.detail.actions.edit", "admin")}
                </Button>
                <Button
                  variant="destructive"
                  onClick={() => onDelete(user!)}
                  disabled={isLoading || !user}
                >
                  <Trash2 className="mr-2 h-4 w-4" />
                  {t("users.detail.actions.delete", "admin")}
                </Button>
              </div>
            </div>
          </CardHeader>
        </Card>
      </AnimatedSection>

      {/* User Information Cards */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Basic Information */}
        <AnimatedSection loading={isLoading} data={user}>
          <Card>
            <CardHeader>
              <CardTitle>{t("users.detail.sections.basicInfo", "admin")}</CardTitle>
              <CardDescription>
                {t("users.detail.sections.basicInfoDesc", "admin")}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Skeletonize loading={isLoading}>
                {user ? (
                  <>
                    <div className="flex items-center gap-3">
                      <Mail className="h-4 w-4 text-muted-foreground" />
                      <div className="flex-1">
                        <div className="text-sm text-muted-foreground">
                          {t("users.fields.email", "admin")}
                        </div>
                        <div className="font-medium">{user.email}</div>
                      </div>
                    </div>
                    {user.phoneNumber && (
                      <div className="flex items-center gap-3">
                        <Phone className="h-4 w-4 text-muted-foreground" />
                        <div className="flex-1">
                          <div className="text-sm text-muted-foreground">
                            {t("users.fields.phoneNumber", "admin")}
                          </div>
                          <div className="font-medium">{user.phoneNumber}</div>
                        </div>
                      </div>
                    )}
                    {user.dob && (
                      <div className="flex items-center gap-3">
                        <Calendar className="h-4 w-4 text-muted-foreground" />
                        <div className="flex-1">
                          <div className="text-sm text-muted-foreground">
                            {t("users.fields.dob", "admin")}
                          </div>
                          <div className="font-medium">{formatDate(user.dob)}</div>
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

        {/* Account Details */}
        <AnimatedSection loading={isLoading} data={user}>
          <Card>
            <CardHeader>
              <CardTitle>{t("users.detail.sections.accountDetails", "admin")}</CardTitle>
              <CardDescription>
                {t("users.detail.sections.accountDetailsDesc", "admin")}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Skeletonize loading={isLoading}>
                {user ? (
                  <>
                    <div className="flex items-center gap-3">
                      <Shield className="h-4 w-4 text-muted-foreground" />
                      <div className="flex-1">
                        <div className="text-sm text-muted-foreground">
                          {t("users.fields.role", "admin")}
                        </div>
                        <Badge variant="outline" className="mt-1">
                          {t(`users.roles.${user.role}`, "admin")}
                        </Badge>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <UserIcon className="h-4 w-4 text-muted-foreground" />
                      <div className="flex-1">
                        <div className="text-sm text-muted-foreground">
                          {t("users.fields.status", "admin")}
                        </div>
                        <Badge
                          variant={user.status === "active" ? "default" : "secondary"}
                          className="mt-1"
                        >
                          {t(`users.status.${user.status}`, "admin")}
                        </Badge>
                      </div>
                    </div>
                    <Separator />
                    <div className="space-y-2">
                      <div className="text-sm text-muted-foreground">
                        {t("users.fields.verified", "admin")}
                      </div>
                      <div className="flex gap-4">
                        <div className="flex items-center gap-2">
                          {user.isEmailVerified ? (
                            <CheckCircle2 className="h-4 w-4 text-green-600" />
                          ) : (
                            <XCircle className="h-4 w-4 text-muted-foreground" />
                          )}
                          <span className="text-sm">
                            {t("users.detail.fields.emailVerified", "admin")}
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          {user.isPhoneVerified ? (
                            <CheckCircle2 className="h-4 w-4 text-green-600" />
                          ) : (
                            <XCircle className="h-4 w-4 text-muted-foreground" />
                          )}
                          <span className="text-sm">
                            {t("users.detail.fields.phoneVerified", "admin")}
                          </span>
                        </div>
                      </div>
                    </div>
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

        {/* Authentication Information */}
        <AnimatedSection loading={isLoading} data={user}>
          <Card>
            <CardHeader>
              <CardTitle>{t("users.detail.sections.authentication", "admin")}</CardTitle>
              <CardDescription>
                {t("users.detail.sections.authenticationDesc", "admin")}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Skeletonize loading={isLoading}>
                {user ? (
                  <>
                    <div className="flex items-center gap-3">
                      <Shield className="h-4 w-4 text-muted-foreground" />
                      <div className="flex-1">
                        <div className="text-sm text-muted-foreground">
                          {t("users.detail.fields.authMethod", "admin")}
                        </div>
                        <div className="font-medium">{user.authMethod || "-"}</div>
                      </div>
                    </div>
                    {user.oauthProvider && (
                      <div className="flex items-center gap-3">
                        <UserIcon className="h-4 w-4 text-muted-foreground" />
                        <div className="flex-1">
                          <div className="text-sm text-muted-foreground">
                            {t("users.detail.fields.oauthProvider", "admin")}
                          </div>
                          <div className="font-medium">{user.oauthProvider}</div>
                        </div>
                      </div>
                    )}
                    {user.firebaseUid && (
                      <div className="flex items-center gap-3">
                        <Shield className="h-4 w-4 text-muted-foreground" />
                        <div className="flex-1">
                          <div className="text-sm text-muted-foreground">
                            {t("users.detail.fields.firebaseUid", "admin")}
                          </div>
                          <div className="font-mono text-xs break-all">{user.firebaseUid}</div>
                        </div>
                      </div>
                    )}
                  </>
                ) : (
                  <div className="space-y-4">
                    <Skeleton className="h-12 w-full" />
                    <Skeleton className="h-12 w-full" />
                  </div>
                )}
              </Skeletonize>
            </CardContent>
          </Card>
        </AnimatedSection>

        {/* Metadata */}
        <AnimatedSection loading={isLoading} data={user}>
          <Card>
            <CardHeader>
              <CardTitle>{t("users.detail.sections.metadata", "admin")}</CardTitle>
              <CardDescription>
                {t("users.detail.sections.metadataDesc", "admin")}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Skeletonize loading={isLoading}>
                {user ? (
                  <>
                    <div className="flex items-center gap-3">
                      <Calendar className="h-4 w-4 text-muted-foreground" />
                      <div className="flex-1">
                        <div className="text-sm text-muted-foreground">
                          {t("users.detail.fields.createdAt", "admin")}
                        </div>
                        <div className="font-medium">{formatDate(user.createdAt)}</div>
                      </div>
                    </div>
                    {user.updatedAt && (
                      <div className="flex items-center gap-3">
                        <Calendar className="h-4 w-4 text-muted-foreground" />
                        <div className="flex-1">
                          <div className="text-sm text-muted-foreground">
                            {t("users.detail.fields.updatedAt", "admin")}
                          </div>
                          <div className="font-medium">{formatDate(user.updatedAt)}</div>
                        </div>
                      </div>
                    )}
                    {user.id && (
                      <div className="flex items-center gap-3">
                        <Shield className="h-4 w-4 text-muted-foreground" />
                        <div className="flex-1">
                          <div className="text-sm text-muted-foreground">
                            {t("users.detail.fields.userId", "admin")}
                          </div>
                          <div className="font-mono text-xs break-all">{user.id}</div>
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

      {/* Edit Dialog */}
      {user && (
        <UserFormDialog
          open={showEditDialog}
          onOpenChange={setShowEditDialog}
          user={user}
          onSubmit={(data) => onUpdate(user.id, data)}
          isLoading={isUpdating}
        />
      )}
    </div>
  );
}

