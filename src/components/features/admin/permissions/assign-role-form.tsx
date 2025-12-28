"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect } from "react";
import { useForm, useWatch } from "react-hook-form";

import { useI18n } from "@/components/providers/i18n-provider";
import { Button } from "@/components/ui/core/button";
import { Input } from "@/components/ui/core/input";
import {
  Form,
  FormControl,
  FormDescription,
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
import { useRoles } from "@/hooks/admin/usePermissions";
import type { Role } from "@/lib/interface/permission.interface";
import {
  assignRoleFormSchema,
  type AssignRoleFormData,
} from "@/lib/validators/permissions";
import { SearchableUserSelect } from "./searchable-user-select";

interface AssignRoleFormProps {
  readonly role?: Role;
  readonly onSubmit: (data: AssignRoleFormData) => Promise<void>;
  readonly onCancel: () => void;
  readonly isLoading?: boolean;
}

/**
 * AssignRoleForm Component
 * Handles assigning roles to users with optional temporary assignment
 */
export function AssignRoleForm({
  role: preselectedRole,
  onSubmit,
  onCancel,
  isLoading = false,
}: AssignRoleFormProps) {
  const { t } = useI18n();

  // Fetch roles for selection if no role is preselected
  const { data: rolesData } = useRoles();

  const form = useForm<AssignRoleFormData>({
    resolver: zodResolver(assignRoleFormSchema),
    defaultValues: {
      userId: "",
      roleId: preselectedRole?.id || "",
      reason: "",
      isTemporary: false,
      expiresAt: "",
    },
  });

  // Use useWatch hook instead of form.watch() to avoid React Compiler warnings
  const isTemporary = useWatch({
    control: form.control,
    name: "isTemporary",
  });

  // Update form when preselected role changes
  useEffect(() => {
    if (preselectedRole) {
      form.setValue("roleId", preselectedRole.id);
    }
  }, [preselectedRole, form]);

  const handleSubmit = async (data: AssignRoleFormData) => {
    // Clean up empty strings to undefined
    const cleanedData = {
      ...data,
      reason: data.reason || undefined,
      expiresAt: data.expiresAt || undefined,
      assignedBy: undefined, // Will be set by backend from auth context
    };
    await onSubmit(cleanedData);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
        {/* User Selection */}
        <FormField
          control={form.control}
          name="userId"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t("assignRole.form.user", "permissions")}</FormLabel>
              <FormControl>
                <SearchableUserSelect
                  value={field.value}
                  onValueChange={field.onChange}
                  disabled={isLoading}
                  placeholder={t("assignRole.form.selectUser", "permissions")}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Role Selection - Only show if role not preselected */}
        {!preselectedRole && (
          <FormField
            control={form.control}
            name="roleId"
            render={({ field }) => (
              <FormItem>
                <FormLabel>
                  {t("assignRole.form.role", "permissions")}
                </FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                  disabled={isLoading}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue
                        placeholder={t(
                          "assignRole.form.selectRole",
                          "permissions",
                        )}
                      />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {rolesData?.map((role: Role) => (
                      <SelectItem key={role.id} value={role.id}>
                        <div className="flex items-center gap-2">
                          {role.color && (
                            <div
                              className="h-3 w-3 rounded-full"
                              style={{ backgroundColor: role.color }}
                            />
                          )}
                          {role.unicodeEmoji && (
                            <span>{role.unicodeEmoji}</span>
                          )}
                          <span>{role.name}</span>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        )}

        {/* Reason Field */}
        <FormField
          control={form.control}
          name="reason"
          render={({ field }) => (
            <FormItem>
              <FormLabel>
                {t("assignRole.form.reason", "permissions")}
              </FormLabel>
              <FormControl>
                <textarea
                  className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                  placeholder={t(
                    "assignRole.form.reasonPlaceholder",
                    "permissions",
                  )}
                  {...field}
                  disabled={isLoading}
                />
              </FormControl>
              <FormDescription>
                {t("assignRole.form.reasonDesc", "permissions")}
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Temporary Assignment */}
        <FormField
          control={form.control}
          name="isTemporary"
          render={({ field }) => (
            <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
              <div className="space-y-0.5">
                <FormLabel className="text-base">
                  {t("assignRole.form.isTemporary", "permissions")}
                </FormLabel>
                <div className="text-sm text-muted-foreground">
                  {t("assignRole.form.isTemporaryDesc", "permissions")}
                </div>
              </div>
              <FormControl>
                <input
                  type="checkbox"
                  checked={field.value}
                  onChange={(e) => field.onChange(e.target.checked)}
                  className="h-4 w-4 rounded border-gray-300"
                  disabled={isLoading}
                />
              </FormControl>
            </FormItem>
          )}
        />

        {/* Expiration Date - Only show if isTemporary is true */}
        {isTemporary && (
          <FormField
            control={form.control}
            name="expiresAt"
            render={({ field }) => (
              <FormItem>
                <FormLabel>
                  {t("assignRole.form.expiresAt", "permissions")}
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
                    disabled={isLoading}
                  />
                </FormControl>
                <FormDescription>
                  {t("assignRole.form.expiresAtDesc", "permissions")}
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        )}

        {/* Form Actions */}
        <div className="flex justify-end gap-2">
          <Button
            type="button"
            variant="outline"
            onClick={onCancel}
            disabled={isLoading}
          >
            {t("assignRole.form.cancel", "permissions")}
          </Button>
          <Button type="submit" disabled={isLoading}>
            {isLoading
              ? t("assignRole.form.assigning", "permissions")
              : t("assignRole.form.assign", "permissions")}
          </Button>
        </div>
      </form>
    </Form>
  );
}
