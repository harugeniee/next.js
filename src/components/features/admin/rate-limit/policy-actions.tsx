"use client";

import { Edit, MoreHorizontal, TestTube, Trash2 } from "lucide-react";
import { useState } from "react";

import { useI18n } from "@/components/providers/i18n-provider";
import { Button } from "@/components/ui/core/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/layout/dropdown-menu";
import type {
  RateLimitPolicy,
  UpdateRateLimitPolicyDto,
} from "@/lib/interface/rate-limit.interface";
import { PolicyFormDialog } from "./policy-form-dialog";
import { PolicyTestDialog } from "./policy-test-dialog";

interface PolicyActionsProps {
  readonly policy: RateLimitPolicy;
  readonly onUpdate: (id: string, data: UpdateRateLimitPolicyDto) => Promise<void>;
  readonly onDelete: (id: string) => void;
  readonly onTestMatch?: (id: string) => void;
  readonly isUpdating?: boolean;
}

export function PolicyActions({
  policy,
  onUpdate,
  onDelete,
  onTestMatch,
  isUpdating,
}: Readonly<PolicyActionsProps>) {
  const { t } = useI18n();
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [showTestDialog, setShowTestDialog] = useState(false);

  const handleDelete = () => {
    if (
      confirm(
        t("rateLimit.policies.deleteConfirm", "admin", { name: policy.name }),
      )
    ) {
      onDelete(policy.id);
    }
  };

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
          {onTestMatch && (
            <DropdownMenuItem onClick={() => setShowTestDialog(true)}>
              <TestTube className="mr-2 h-4 w-4" />
              {t("rateLimit.policies.testMatch", "admin")}
            </DropdownMenuItem>
          )}
          <DropdownMenuItem onClick={() => setShowEditDialog(true)}>
            <Edit className="mr-2 h-4 w-4" />
            {t("actions.edit", "common")}
          </DropdownMenuItem>
          <DropdownMenuItem
            className="text-destructive focus:text-destructive"
            onClick={handleDelete}
          >
            <Trash2 className="mr-2 h-4 w-4" />
            {t("actions.delete", "common")}
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <PolicyFormDialog
        open={showEditDialog}
        onOpenChange={setShowEditDialog}
        policy={policy}
        onSubmit={(data) => onUpdate(policy.id, data as UpdateRateLimitPolicyDto)}
        isLoading={isUpdating}
      />

      {onTestMatch && (
        <PolicyTestDialog
          open={showTestDialog}
          onOpenChange={setShowTestDialog}
          policyId={policy.id}
        />
      )}
    </>
  );
}

