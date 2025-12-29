"use client";

import { Edit, MoreHorizontal } from "lucide-react";
import { useState } from "react";

import { useI18n } from "@/components/providers/i18n-provider";
import { Button } from "@/components/ui/core/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/layout/dropdown-menu";
import type { Plan, UpdatePlanDto } from "@/lib/interface/rate-limit.interface";
import { PlanFormDialog } from "./plan-form-dialog";

interface PlanActionsProps {
  readonly plan: Plan;
  readonly onUpdate: (name: string, data: UpdatePlanDto) => Promise<void>;
  readonly isUpdating?: boolean;
}

export function PlanActions({
  plan,
  onUpdate,
  isUpdating,
}: Readonly<PlanActionsProps>) {
  const { t } = useI18n();
  const [showEditDialog, setShowEditDialog] = useState(false);

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
            <MoreHorizontal className="h-4 w-4" />
            <span className="sr-only">{t("common.actions", "common")}</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem onClick={() => setShowEditDialog(true)}>
            <Edit className="mr-2 h-4 w-4" />
            {t("actions.edit", "common")}
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <PlanFormDialog
        open={showEditDialog}
        onOpenChange={setShowEditDialog}
        plan={plan}
        onSubmit={(data) => onUpdate(plan.name, data as UpdatePlanDto)}
        isLoading={isUpdating}
      />
    </>
  );
}

