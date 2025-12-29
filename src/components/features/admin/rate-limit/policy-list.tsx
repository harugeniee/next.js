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
  CreateRateLimitPolicyDto,
  RateLimitPolicy,
  UpdateRateLimitPolicyDto,
} from "@/lib/interface/rate-limit.interface";
import { PolicyActions } from "./policy-actions";
import { PolicyFormDialog } from "./policy-form-dialog";

interface PolicyListProps {
  data?: RateLimitPolicy[];
  isLoading: boolean;
  onCreate: (data: CreateRateLimitPolicyDto) => Promise<void>;
  onUpdate: (id: string, data: UpdateRateLimitPolicyDto) => Promise<void>;
  onDelete: (id: string) => Promise<void>;
  onTestMatch?: (id: string) => void;
  isCreating?: boolean;
  isUpdating?: boolean;
}

export function PolicyList({
  data,
  isLoading,
  onCreate,
  onUpdate,
  onDelete,
  onTestMatch,
  isCreating,
  isUpdating,
}: PolicyListProps) {
  const { t } = useI18n();
  const [showCreateDialog, setShowCreateDialog] = useState(false);

  const handleCreate = async (
    data: CreateRateLimitPolicyDto | UpdateRateLimitPolicyDto,
  ): Promise<void> => {
    // When creating, data must be CreateRateLimitPolicyDto (with name and scope)
    if (
      "name" in data &&
      typeof data.name === "string" &&
      data.name.length > 0 &&
      "scope" in data
    ) {
      const createData: CreateRateLimitPolicyDto = {
        name: data.name,
        scope: data.scope,
        enabled: data.enabled,
        priority: data.priority,
        routePattern: data.routePattern,
        strategy: data.strategy,
        limit: data.limit,
        windowSec: data.windowSec,
        burst: data.burst,
        refillPerSec: data.refillPerSec,
        extra: data.extra,
        description: data.description,
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
              <CardTitle>{t("rateLimit.policies.title", "admin")}</CardTitle>
              <CardDescription>
                {t("rateLimit.policies.description", "admin")}
              </CardDescription>
            </div>
            <Button size="sm" onClick={() => setShowCreateDialog(true)}>
              <Plus className="mr-2 h-4 w-4" />
              {t("rateLimit.policies.create", "admin")}
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
                          {t("rateLimit.policies.name", "admin")}
                        </TableHead>
                        <TableHead>
                          {t("rateLimit.policies.scope", "admin")}
                        </TableHead>
                        <TableHead>
                          {t("rateLimit.policies.strategy", "admin")}
                        </TableHead>
                        <TableHead>
                          {t("rateLimit.policies.priority", "admin")}
                        </TableHead>
                        <TableHead>
                          {t("rateLimit.policies.status", "admin")}
                        </TableHead>
                        <TableHead>
                          {t("rateLimit.policies.descriptionLabel", "admin")}
                        </TableHead>
                        <TableHead className="text-right">
                          {t("common.actions", "common")}
                        </TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {data.map((policy) => (
                        <TableRow key={policy.id}>
                          <TableCell className="font-medium">
                            {policy.name}
                          </TableCell>
                          <TableCell>
                            <Badge variant="outline">{policy.scope}</Badge>
                          </TableCell>
                          <TableCell>
                            <Badge variant="outline">{policy.strategy}</Badge>
                          </TableCell>
                          <TableCell>{policy.priority}</TableCell>
                          <TableCell>
                            <Badge
                              variant={policy.enabled ? "default" : "secondary"}
                            >
                              {policy.enabled
                                ? t("rateLimit.policies.status.active", "admin")
                                : t(
                                    "rateLimit.policies.status.inactive",
                                    "admin",
                                  )}
                            </Badge>
                          </TableCell>
                          <TableCell className="max-w-xs truncate">
                            {policy.description || "-"}
                          </TableCell>
                          <TableCell className="text-right">
                            <PolicyActions
                              policy={policy}
                              onUpdate={onUpdate}
                              onDelete={onDelete}
                              onTestMatch={onTestMatch}
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
                  {t("rateLimit.policies.empty", "admin")}
                </div>
              );
            })()}
          </Skeletonize>
        </CardContent>
      </Card>

      <PolicyFormDialog
        open={showCreateDialog}
        onOpenChange={setShowCreateDialog}
        onSubmit={handleCreate}
        isLoading={isCreating}
      />
    </AnimatedSection>
  );
}
