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
import type { CreatePlanDto, Plan, UpdatePlanDto } from "@/lib/interface/rate-limit.interface";
import { PlanActions } from "./plan-actions";
import { PlanFormDialog } from "./plan-form-dialog";

interface PlanListProps {
  data?: Plan[];
  isLoading: boolean;
  onCreate: (data: CreatePlanDto) => Promise<void>;
  onUpdate: (name: string, data: UpdatePlanDto) => Promise<void>;
  isCreating?: boolean;
  isUpdating?: boolean;
}

export function PlanList({
  data,
  isLoading,
  onCreate,
  onUpdate,
  isCreating,
  isUpdating,
}: PlanListProps) {
  const { t } = useI18n();
  const [showCreateDialog, setShowCreateDialog] = useState(false);

  return (
    <AnimatedSection loading={isLoading} data={data} className="w-full">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>{t("rateLimit.plans.title", "admin")}</CardTitle>
              <CardDescription>
                {t("rateLimit.plans.description", "admin")}
              </CardDescription>
            </div>
            <Button size="sm" onClick={() => setShowCreateDialog(true)}>
              <Plus className="mr-2 h-4 w-4" />
              {t("rateLimit.plans.create", "admin")}
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
                    <TableHead>{t("rateLimit.plans.name", "admin")}</TableHead>
                    <TableHead>
                      {t("rateLimit.plans.limitPerMin", "admin")}
                    </TableHead>
                    <TableHead>
                      {t("rateLimit.plans.ttlSec", "admin")}
                    </TableHead>
                    <TableHead>
                      {t("rateLimit.plans.descriptionLabel", "admin")}
                    </TableHead>
                    <TableHead>
                      {t("rateLimit.plans.displayOrder", "admin")}
                    </TableHead>
                    <TableHead>
                      {t("rateLimit.plans.status", "admin")}
                    </TableHead>
                    <TableHead className="text-right">
                      {t("common.actions", "common")}
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {data.map((plan) => (
                    <TableRow key={plan.id}>
                      <TableCell className="font-medium">{plan.name}</TableCell>
                      <TableCell>{plan.limitPerMin}</TableCell>
                      <TableCell>{plan.ttlSec}s</TableCell>
                      <TableCell className="max-w-xs truncate">
                        {plan.description || "-"}
                      </TableCell>
                      <TableCell>{plan.displayOrder}</TableCell>
                      <TableCell>
                        <Badge variant={plan.active ? "default" : "secondary"}>
                          {plan.active
                            ? t("rateLimit.plans.status.active", "admin")
                            : t("rateLimit.plans.status.inactive", "admin")}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <PlanActions
                          plan={plan}
                          onUpdate={onUpdate}
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
                  {t("rateLimit.plans.empty", "admin")}
                </div>
              );
            })()}
          </Skeletonize>
        </CardContent>
      </Card>

      <PlanFormDialog
        open={showCreateDialog}
        onOpenChange={setShowCreateDialog}
        onSubmit={onCreate}
        isLoading={isCreating}
      />
    </AnimatedSection>
  );
}

