"use client";

import { User } from "lucide-react";
import Image from "next/image";

import { useI18n } from "@/components/providers/i18n-provider";
import { Badge } from "@/components/ui/core/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/core/card";
import { Skeleton } from "@/components/ui/core/skeleton";
import { Skeletonize } from "@/components/shared/skeletonize";
import type { Staff } from "@/lib/interface/staff.interface";

interface StaffCharacterListProps {
  staff?: Staff;
  isLoading: boolean;
}

/**
 * Staff Character List Component
 * Displays characters voiced by this staff member
 */
export function StaffCharacterList({
  staff,
  isLoading,
}: StaffCharacterListProps) {
  const { t } = useI18n();

  return (
    <Card>
      <CardHeader>
        <CardTitle>{t("detail.characterRoles", "staff")}</CardTitle>
        <CardDescription>
          {t("detail.characterRolesDescription", "staff")}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Skeletonize loading={isLoading}>
          {staff?.characterRoles && staff.characterRoles.length > 0 ? (
            <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3">
              {staff.characterRoles.map((role) => {
                const characterName =
                  role.character?.name?.full ||
                  role.character?.name?.userPreferred ||
                  "Unknown Character";

                return (
                  <div
                    key={role.id}
                    className="flex items-center gap-3 rounded-lg border p-3"
                  >
                    <div className="relative h-12 w-12 rounded-full overflow-hidden bg-muted flex-shrink-0">
                      {role.character?.image?.url ? (
                        <Image
                          src={role.character.image.url}
                          alt={characterName}
                          fill
                          className="object-cover"
                        />
                      ) : (
                        <div className="h-full w-full flex items-center justify-center">
                          <User className="h-6 w-6 text-muted-foreground" />
                        </div>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium truncate">{characterName}</p>
                      {role.language && (
                        <Badge variant="outline" className="mt-1 text-xs">
                          {role.language}
                        </Badge>
                      )}
                      {role.isPrimary && (
                        <Badge variant="secondary" className="mt-1 ml-1 text-xs">
                          {t("detail.primaryRole", "staff")}
                        </Badge>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="text-center text-muted-foreground py-8">
              {isLoading ? (
                <div className="space-y-2">
                  <Skeleton className="h-16 w-full" />
                  <Skeleton className="h-16 w-full" />
                </div>
              ) : (
                <p>{t("detail.noCharacterRoles", "staff")}</p>
              )}
            </div>
          )}
        </Skeletonize>
      </CardContent>
    </Card>
  );
}

