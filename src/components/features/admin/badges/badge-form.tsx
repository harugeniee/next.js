"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect } from "react";
import { useForm } from "react-hook-form";

import { useI18n } from "@/components/providers/i18n-provider";
import { Button } from "@/components/ui/core/button";
import { Input } from "@/components/ui/core/input";
import { Label } from "@/components/ui/core/label";
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
  createBadgeSchema,
  updateBadgeSchema,
  type CreateBadgeFormData,
  type UpdateBadgeFormData,
} from "@/lib/validators/badges";
import {
  BadgeCategory,
  BadgeRarity,
  BadgeStatus,
  BadgeType,
  type Badge,
} from "@/lib/types/badges";

interface BadgeFormProps {
  readonly badge?: Badge;
  readonly onSubmit: (data: CreateBadgeFormData | UpdateBadgeFormData) => Promise<void>;
  readonly onCancel: () => void;
  readonly isLoading?: boolean;
}

/**
 * Badge Form Component
 * Handles creating and editing badges with comprehensive validation
 */
export function BadgeForm({
  badge,
  onSubmit,
  onCancel,
  isLoading = false,
}: BadgeFormProps) {
  const { t } = useI18n();
  const isEditMode = !!badge;

  const form = useForm<CreateBadgeFormData>({
    resolver: zodResolver(isEditMode ? updateBadgeSchema : createBadgeSchema),
    defaultValues: {
      type: badge?.type || BadgeType.CONTENT_CREATOR,
      name: badge?.name || "",
      description: badge?.description || "",
      category: badge?.category || BadgeCategory.CUSTOM,
      rarity: badge?.rarity || BadgeRarity.COMMON,
      status: badge?.status || BadgeStatus.ACTIVE,
      isVisible: badge?.isVisible ?? true,
      isObtainable: badge?.isObtainable ?? true,
      displayOrder: badge?.displayOrder || 0,
      iconUrl: badge?.iconUrl || "",
      color: badge?.color || "",
      requirements: badge?.requirements || "",
      isAutoAssigned: badge?.isAutoAssigned ?? false,
      isManuallyAssignable: badge?.isManuallyAssignable ?? true,
      isRevokable: badge?.isRevokable ?? true,
      expiresAt: badge?.expiresAt
        ? typeof badge.expiresAt === "string"
          ? badge.expiresAt
          : new Date(badge.expiresAt).toISOString()
        : "",
    },
  });

  // Update form when badge changes
  useEffect(() => {
    if (badge) {
      form.reset({
        type: badge.type,
        name: badge.name,
        description: badge.description || "",
        category: badge.category,
        rarity: badge.rarity,
        status: badge.status,
        isVisible: badge.isVisible,
        isObtainable: badge.isObtainable,
        displayOrder: badge.displayOrder,
        iconUrl: badge.iconUrl || "",
        color: badge.color || "",
        requirements: badge.requirements || "",
        isAutoAssigned: badge.isAutoAssigned,
        isManuallyAssignable: badge.isManuallyAssignable,
        isRevokable: badge.isRevokable,
        expiresAt: badge.expiresAt
          ? typeof badge.expiresAt === "string"
            ? badge.expiresAt
            : new Date(badge.expiresAt).toISOString()
          : "",
      });
    }
  }, [badge, form]);

  const handleSubmit = async (data: CreateBadgeFormData) => {
    // Clean up empty strings to undefined
    const cleanedData = {
      ...data,
      description: data.description || undefined,
      iconUrl: data.iconUrl || undefined,
      color: data.color || undefined,
      requirements: data.requirements || undefined,
      expiresAt: data.expiresAt || undefined,
    };
    await onSubmit(cleanedData);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
        {/* Basic Information */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">
            {t("badges.form.basicInfo", "admin")}
          </h3>

          <div className="grid gap-4 sm:grid-cols-2">
            <FormField
              control={form.control}
              name="type"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t("badges.form.type", "admin")}</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                    disabled={isEditMode}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder={t("badges.form.selectType", "admin")} />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {Object.values(BadgeType).map((type) => (
                        <SelectItem key={type} value={type}>
                          {t(`badges.types.${type}`, "admin") || type}
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
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t("badges.form.name", "admin")}</FormLabel>
                  <FormControl>
                    <Input
                      placeholder={t("badges.form.namePlaceholder", "admin")}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t("badges.form.description", "admin")}</FormLabel>
                <FormControl>
                  <textarea
                    className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                    placeholder={t("badges.form.descriptionPlaceholder", "admin")}
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="grid gap-4 sm:grid-cols-2">
            <FormField
              control={form.control}
              name="category"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t("badges.form.category", "admin")}</FormLabel>
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
                      {Object.values(BadgeCategory).map((category) => (
                        <SelectItem key={category} value={category}>
                          {t(`badges.categories.${category}`, "admin")}
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
              name="rarity"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t("badges.form.rarity", "admin")}</FormLabel>
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
                      {Object.values(BadgeRarity).map((rarity) => (
                        <SelectItem key={rarity} value={rarity}>
                          {t(`badges.rarities.${rarity}`, "admin")}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <FormField
            control={form.control}
            name="status"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t("badges.form.status", "admin")}</FormLabel>
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
                    {Object.values(BadgeStatus).map((status) => (
                      <SelectItem key={status} value={status}>
                        {t(`badges.statuses.${status}`, "admin")}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        {/* Display Settings */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">
            {t("badges.form.displaySettings", "admin")}
          </h3>

          <div className="grid gap-4 sm:grid-cols-2">
            <FormField
              control={form.control}
              name="iconUrl"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t("badges.form.iconUrl", "admin")}</FormLabel>
                  <FormControl>
                    <Input
                      type="url"
                      placeholder={t("badges.form.iconUrlPlaceholder", "admin")}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="color"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t("badges.form.color", "admin")}</FormLabel>
                  <FormControl>
                    <div className="flex gap-2">
                      <Input
                        type="color"
                        className="w-16 h-10"
                        value={field.value || "#000000"}
                        onChange={(e) => field.onChange(e.target.value)}
                      />
                      <Input
                        placeholder="#FF0000"
                        value={field.value || ""}
                        onChange={field.onChange}
                      />
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <FormField
            control={form.control}
            name="displayOrder"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t("badges.form.displayOrder", "admin")}</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    min={0}
                    max={9999}
                    {...field}
                    onChange={(e) => field.onChange(parseInt(e.target.value) || 0)}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        {/* Behavior Settings */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">
            {t("badges.form.behaviorSettings", "admin")}
          </h3>

          <div className="space-y-4">
            <FormField
              control={form.control}
              name="isVisible"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                  <div className="space-y-0.5">
                    <FormLabel className="text-base">
                      {t("badges.form.isVisible", "admin")}
                    </FormLabel>
                    <div className="text-sm text-muted-foreground">
                      {t("badges.form.isVisibleDesc", "admin")}
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

            <FormField
              control={form.control}
              name="isObtainable"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                  <div className="space-y-0.5">
                    <FormLabel className="text-base">
                      {t("badges.form.isObtainable", "admin")}
                    </FormLabel>
                    <div className="text-sm text-muted-foreground">
                      {t("badges.form.isObtainableDesc", "admin")}
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

            <FormField
              control={form.control}
              name="isAutoAssigned"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                  <div className="space-y-0.5">
                    <FormLabel className="text-base">
                      {t("badges.form.isAutoAssigned", "admin")}
                    </FormLabel>
                    <div className="text-sm text-muted-foreground">
                      {t("badges.form.isAutoAssignedDesc", "admin")}
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

            <FormField
              control={form.control}
              name="isManuallyAssignable"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                  <div className="space-y-0.5">
                    <FormLabel className="text-base">
                      {t("badges.form.isManuallyAssignable", "admin")}
                    </FormLabel>
                    <div className="text-sm text-muted-foreground">
                      {t("badges.form.isManuallyAssignableDesc", "admin")}
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

            <FormField
              control={form.control}
              name="isRevokable"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                  <div className="space-y-0.5">
                    <FormLabel className="text-base">
                      {t("badges.form.isRevokable", "admin")}
                    </FormLabel>
                    <div className="text-sm text-muted-foreground">
                      {t("badges.form.isRevokableDesc", "admin")}
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
        </div>

        {/* Additional Information */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">
            {t("badges.form.additionalInfo", "admin")}
          </h3>

          <FormField
            control={form.control}
            name="requirements"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t("badges.form.requirements", "admin")}</FormLabel>
                <FormControl>
                  <textarea
                    className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                    placeholder={t("badges.form.requirementsPlaceholder", "admin")}
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="expiresAt"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t("badges.form.expiresAt", "admin")}</FormLabel>
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
                      field.onChange(value ? new Date(value).toISOString() : "");
                    }}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        {/* Form Actions */}
        <div className="flex justify-end gap-2">
          <Button type="button" variant="outline" onClick={onCancel} disabled={isLoading}>
            {t("badges.form.cancel", "admin")}
          </Button>
          <Button type="submit" disabled={isLoading}>
            {isLoading
              ? t("badges.form.saving", "admin")
              : isEditMode
                ? t("badges.form.update", "admin")
                : t("badges.form.create", "admin")}
          </Button>
        </div>
      </form>
    </Form>
  );
}

