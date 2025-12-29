"use client";

import { Plus } from "lucide-react";
import { useState } from "react";

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
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/core/table";
import type {
  ApiKey,
  CreateApiKeyDto,
  UpdateApiKeyDto,
} from "@/lib/interface/rate-limit.interface";
import { ApiKeyActions } from "./api-key-actions";
import { ApiKeyDisplay } from "./api-key-display";
import { ApiKeyFormDialog } from "./api-key-form-dialog";

interface ApiKeyListProps {
  data?: ApiKey[];
  isLoading: boolean;
  plans?: Array<{ name: string }>;
  onCreate: (data: CreateApiKeyDto) => Promise<void>;
  onUpdate: (id: string, data: UpdateApiKeyDto) => Promise<void>;
  onDelete: (id: string) => Promise<void>;
  isCreating?: boolean;
  isUpdating?: boolean;
}

export function ApiKeyList({
  data,
  isLoading,
  plans = [],
  onCreate,
  onUpdate,
  onDelete,
  isCreating,
  isUpdating,
}: ApiKeyListProps) {
  const { t } = useI18n();
  const [showCreateDialog, setShowCreateDialog] = useState(false);

  const handleCreate = async (
    data: CreateApiKeyDto | UpdateApiKeyDto,
  ): Promise<void> => {
    // When creating, data must be CreateApiKeyDto (with key and plan)
    // The form dialog only shows key field when creating, so this is safe
    if (
      "key" in data &&
      typeof data.key === "string" &&
      data.key.length > 0 &&
      data.plan &&
      typeof data.plan === "string" &&
      data.plan.length > 0
    ) {
      const createData: CreateApiKeyDto = {
        key: data.key,
        plan: data.plan,
        name: data.name,
        ownerId: data.ownerId,
        isWhitelist: data.isWhitelist,
        expiresAt: data.expiresAt,
      };
      await onCreate(createData);
    }
  };

  return (
    <AnimatedSection loading={isLoading} data={data} className="w-full">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>{t("rateLimit.apiKeys.title", "admin")}</CardTitle>
              <CardDescription>
                {t("rateLimit.apiKeys.description", "admin")}
              </CardDescription>
            </div>
            <Button size="sm" onClick={() => setShowCreateDialog(true)}>
              <Plus className="mr-2 h-4 w-4" />
              {t("rateLimit.apiKeys.create", "admin")}
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <Skeletonize loading={isLoading}>
            {(() => {
              if (isLoading) {
                return (
                  <div className="space-y-2">
                    {[1, 2, 3].map((i) => (
                      <div key={i} className="h-12 w-full rounded bg-muted" />
                    ))}
                  </div>
                );
              }

              if (data && data.length > 0) {
                return (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>
                          {t("rateLimit.apiKeys.key", "admin")}
                        </TableHead>
                        <TableHead>
                          {t("rateLimit.apiKeys.name", "admin")}
                        </TableHead>
                        <TableHead>
                          {t("rateLimit.apiKeys.plan", "admin")}
                        </TableHead>
                        <TableHead>
                          {t("rateLimit.apiKeys.isWhitelist", "admin")}
                        </TableHead>
                        <TableHead>
                          {t("rateLimit.apiKeys.expiresAt", "admin")}
                        </TableHead>
                        <TableHead>
                          {t("rateLimit.apiKeys.status", "admin")}
                        </TableHead>
                        <TableHead className="text-right">
                          {t("common.actions", "common")}
                        </TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {data.map((apiKey) => (
                        <TableRow key={apiKey.id}>
                          <TableCell>
                            <ApiKeyDisplay apiKey={apiKey.key} />
                          </TableCell>
                          <TableCell>{apiKey.name || "-"}</TableCell>
                          <TableCell>
                            {apiKey.plan?.name || apiKey.planId || "-"}
                          </TableCell>
                          <TableCell>
                            <Badge
                              variant={
                                apiKey.isWhitelist ? "default" : "secondary"
                              }
                            >
                              {apiKey.isWhitelist
                                ? t("common.yes", "common")
                                : t("common.no", "common")}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            {apiKey.expiresAt
                              ? new Date(apiKey.expiresAt).toLocaleDateString()
                              : "-"}
                          </TableCell>
                          <TableCell>
                            <Badge
                              variant={apiKey.active ? "default" : "secondary"}
                            >
                              {apiKey.active
                                ? t("rateLimit.apiKeys.status.active", "admin")
                                : t(
                                    "rateLimit.apiKeys.status.inactive",
                                    "admin",
                                  )}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-right">
                            <ApiKeyActions
                              apiKey={apiKey}
                              onUpdate={onUpdate}
                              onDelete={onDelete}
                              isUpdating={isUpdating}
                            />
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                );
              }

              return (
                <div className="py-8 text-center text-muted-foreground">
                  {t("rateLimit.apiKeys.empty", "admin")}
                </div>
              );
            })()}
          </Skeletonize>
        </CardContent>
      </Card>

      <ApiKeyFormDialog
        open={showCreateDialog}
        onOpenChange={setShowCreateDialog}
        plans={plans}
        onSubmit={handleCreate}
        isLoading={isCreating}
      />
    </AnimatedSection>
  );
}
