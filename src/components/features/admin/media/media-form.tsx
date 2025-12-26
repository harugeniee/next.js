"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect } from "react";
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
import type { Media } from "@/lib/interface/media.interface";
import {
  updateMediaSchema,
  type UpdateMediaFormData,
} from "@/lib/validators/media";

interface MediaFormProps {
  readonly media?: Media;
  readonly onSubmit: (data: UpdateMediaFormData) => Promise<void>;
  readonly onCancel: () => void;
  readonly isLoading?: boolean;
}

/**
 * Media Form Component
 * Handles editing media metadata with comprehensive validation
 */
export function MediaForm({
  media,
  onSubmit,
  onCancel,
  isLoading = false,
}: MediaFormProps) {
  const { t } = useI18n();

  // Parse tags from JSON string if needed
  const parseTags = (tags?: string | string[]): string[] => {
    if (!tags) return [];
    if (Array.isArray(tags)) return tags;
    try {
      const parsed = JSON.parse(tags);
      return Array.isArray(parsed) ? parsed : [];
    } catch {
      return tags
        .split(",")
        .map((tag) => tag.trim())
        .filter(Boolean);
    }
  };

  const form = useForm<UpdateMediaFormData>({
    resolver: zodResolver(updateMediaSchema),
    defaultValues: {
      name: media?.name || "",
      description: media?.description || "",
      altText: media?.altText || "",
      isPublic: media?.isPublic ?? false,
      tags: parseTags(media?.tags),
    },
  });

  // Update form when media changes
  useEffect(() => {
    if (media) {
      form.reset({
        name: media.name || "",
        description: media.description || "",
        altText: media.altText || "",
        isPublic: media.isPublic ?? false,
        tags: parseTags(media.tags),
      });
    }
  }, [media, form]);

  const handleSubmit = async (data: UpdateMediaFormData) => {
    // Clean up empty strings to undefined
    const cleanedData: UpdateMediaFormData = {
      name: data.name || undefined,
      description: data.description || undefined,
      altText: data.altText || undefined,
      isPublic: data.isPublic,
      tags: data.tags && data.tags.length > 0 ? data.tags : undefined,
    };
    await onSubmit(cleanedData);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
        {/* Basic Information */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">
            {t("form.basicInfo", "media")}
          </h3>

          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t("fields.name", "media")}</FormLabel>
                <FormControl>
                  <Input
                    placeholder={t("form.namePlaceholder", "media")}
                    {...field}
                    value={field.value || ""}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t("fields.description", "media")}</FormLabel>
                <FormControl>
                  <textarea
                    placeholder={t("form.descriptionPlaceholder", "media")}
                    className="flex min-h-[100px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 resize-none"
                    {...field}
                    value={field.value || ""}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="altText"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t("fields.altText", "media")}</FormLabel>
                <FormControl>
                  <Input
                    placeholder={t("form.altTextPlaceholder", "media")}
                    {...field}
                    value={field.value || ""}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        {/* Visibility Settings */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">
            {t("form.visibilitySettings", "media")}
          </h3>

          <FormField
            control={form.control}
            name="isPublic"
            render={({ field }) => (
              <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                <div className="space-y-0.5">
                  <FormLabel className="text-base">
                    {t("fields.isPublic", "media")}
                  </FormLabel>
                  <p className="text-sm text-muted-foreground">
                    {t("fields.isPublicDesc", "media")}
                  </p>
                </div>
                <FormControl>
                  <input
                    type="checkbox"
                    checked={field.value}
                    onChange={(e) => field.onChange(e.target.checked)}
                    className="h-4 w-4 rounded border-input text-primary focus:ring-ring disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                  />
                </FormControl>
              </FormItem>
            )}
          />
        </div>

        {/* Tags */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">{t("form.tags", "media")}</h3>

          <FormField
            control={form.control}
            name="tags"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t("fields.tags", "media")}</FormLabel>
                <FormControl>
                  <Input
                    placeholder={t("form.tagsPlaceholder", "media")}
                    value={
                      Array.isArray(field.value)
                        ? field.value.join(", ")
                        : field.value || ""
                    }
                    onChange={(e) => {
                      const value = e.target.value;
                      const tags = value
                        .split(",")
                        .map((tag) => tag.trim())
                        .filter(Boolean);
                      field.onChange(tags.length > 0 ? tags : undefined);
                    }}
                  />
                </FormControl>
                <FormMessage />
                <p className="text-xs text-muted-foreground">
                  {t("form.tagsHint", "media")}
                </p>
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
            {t("form.cancel", "media")}
          </Button>
          <Button type="submit" disabled={isLoading}>
            {(() => {
              if (isLoading) return t("form.saving", "media");
              return t("form.update", "media");
            })()}
          </Button>
        </div>
      </form>
    </Form>
  );
}
