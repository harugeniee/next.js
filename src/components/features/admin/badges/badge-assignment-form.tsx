"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

import { useI18n } from "@/components/providers/i18n-provider";
import { Button } from "@/components/ui/core/button";
import { Input } from "@/components/ui/core/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/layout/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  assignBadgeSchema,
  type AssignBadgeFormData,
} from "@/lib/validators/badges";
import { BadgeEntityType, type Badge } from "@/lib/types/badges";
import { useBadges } from "@/hooks/admin/useBadges";

interface BadgeAssignmentFormProps {
  readonly badge?: Badge;
  readonly onSubmit: (data: AssignBadgeFormData) => Promise<void>;
  readonly onCancel: () => void;
  readonly isLoading?: boolean;
}

/**
 * Badge Assignment Form Component
 * Handles assigning badges to entities
 */
export function BadgeAssignmentForm({
  badge: preselectedBadge,
  onSubmit,
  onCancel,
  isLoading = false,
}: BadgeAssignmentFormProps) {
  const { t } = useI18n();

  // Fetch badges for selection if no badge is preselected
  const { data: badgesData } = useBadges({
    limit: 100,
    isManuallyAssignable: true,
    statuses: ["active" as const],
  });

  const form = useForm<AssignBadgeFormData>({
    resolver: zodResolver(assignBadgeSchema),
    defaultValues: {
      badgeId: preselectedBadge?.id || "",
      entityType: BadgeEntityType.USER,
      entityId: "",
      expiresAt: "",
      assignmentReason: "",
      isVisible: true,
    },
  });

  const handleSubmit = async (data: AssignBadgeFormData) => {
    // Clean up empty strings to undefined
    const cleanedData = {
      ...data,
      expiresAt: data.expiresAt || undefined,
      assignmentReason: data.assignmentReason || undefined,
    };
    await onSubmit(cleanedData);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
        {/* Badge Selection */}
        <FormField
          control={form.control}
          name="badgeId"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t("badges.assignment.badge", "admin")}</FormLabel>
              <Select
                onValueChange={field.onChange}
                defaultValue={field.value}
                disabled={!!preselectedBadge}
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue
                      placeholder={t("badges.assignment.selectBadge", "admin")}
                    />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {badgesData?.result.map((badge) => (
                    <SelectItem key={badge.id} value={badge.id}>
                      {badge.name} ({badge.type})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Entity Information */}
        <div className="grid gap-4 sm:grid-cols-2">
          <FormField
            control={form.control}
            name="entityType"
            render={({ field }) => (
              <FormItem>
                <FormLabel>
                  {t("badges.assignment.entityType", "admin")}
                </FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {Object.values(BadgeEntityType).map((type) => (
                      <SelectItem key={type} value={type}>
                        {t(`badges.entityTypes.${type}`, "admin") || type}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="entityId"
            render={({ field }) => (
              <FormItem>
                <FormLabel>
                  {t("badges.assignment.entityId", "admin")}
                </FormLabel>
                <FormControl>
                  <Input
                    placeholder={t(
                      "badges.assignment.entityIdPlaceholder",
                      "admin",
                    )}
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        {/* Assignment Details */}
        <div className="space-y-4">
          <FormField
            control={form.control}
            name="expiresAt"
            render={({ field }) => (
              <FormItem>
                <FormLabel>
                  {t("badges.assignment.expiresAt", "admin")}
                </FormLabel>
                <FormControl>
                  <Input
                    type="datetime-local"
                    value={
                      field.value
                        ? new Date(field.value).toISOString().slice(0, 16)
                        : ""
                    }
                    onChange={(e) => {
                      const value = e.target.value;
                      field.onChange(
                        value ? new Date(value).toISOString() : "",
                      );
                    }}
                  />
                </FormControl>
                <div className="text-sm text-muted-foreground">
                  {t("badges.assignment.expiresAtDesc", "admin")}
                </div>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="assignmentReason"
            render={({ field }) => (
              <FormItem>
                <FormLabel>
                  {t("badges.assignment.assignmentReason", "admin")}
                </FormLabel>
                <FormControl>
                  <textarea
                    className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                    placeholder={t(
                      "badges.assignment.assignmentReasonPlaceholder",
                      "admin",
                    )}
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="isVisible"
            render={({ field }) => (
              <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                <div className="space-y-0.5">
                  <FormLabel className="text-base">
                    {t("badges.assignment.isVisible", "admin")}
                  </FormLabel>
                  <div className="text-sm text-muted-foreground">
                    {t("badges.assignment.isVisibleDesc", "admin")}
                  </div>
                </div>
                <FormControl>
                  <input
                    type="checkbox"
                    checked={field.value}
                    onChange={(e) => field.onChange(e.target.checked)}
                    className="h-4 w-4 rounded border-gray-300"
                  />
                </FormControl>
              </FormItem>
            )}
          />
        </div>

        {/* Form Actions */}
        <div className="flex justify-end gap-2">
          <Button
            type="button"
            variant="outline"
            onClick={onCancel}
            disabled={isLoading}
          >
            {t("badges.assignment.cancel", "admin")}
          </Button>
          <Button type="submit" disabled={isLoading}>
            {isLoading
              ? t("badges.assignment.assigning", "admin")
              : t("badges.assignment.assign", "admin")}
          </Button>
        </div>
      </form>
    </Form>
  );
}
