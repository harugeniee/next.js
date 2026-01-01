"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";

import { useI18n } from "@/components/providers/i18n-provider";
import { Button } from "@/components/ui/core/button";
import { Input } from "@/components/ui/core/input";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/layout/dialog";
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
import { TAG_CONSTANTS } from "@/lib/constants/tag.constants";
import type { CreateTagDto } from "@/lib/api/tags";

const tagSchema = z.object({
  name: z
    .string()
    .min(
      TAG_CONSTANTS.VALIDATION.NAME_MIN_LENGTH,
      `Name must be at least ${TAG_CONSTANTS.VALIDATION.NAME_MIN_LENGTH} character`,
    )
    .max(
      TAG_CONSTANTS.VALIDATION.NAME_MAX_LENGTH,
      `Name must be less than ${TAG_CONSTANTS.VALIDATION.NAME_MAX_LENGTH} characters`,
    ),
  slug: z
    .string()
    .min(
      TAG_CONSTANTS.VALIDATION.SLUG_MIN_LENGTH,
      `Slug must be at least ${TAG_CONSTANTS.VALIDATION.SLUG_MIN_LENGTH} character`,
    )
    .max(
      TAG_CONSTANTS.VALIDATION.SLUG_MAX_LENGTH,
      `Slug must be less than ${TAG_CONSTANTS.VALIDATION.SLUG_MAX_LENGTH} characters`,
    )
    .optional()
    .or(z.literal("")),
  description: z
    .string()
    .max(
      TAG_CONSTANTS.VALIDATION.DESCRIPTION_MAX_LENGTH,
      `Description must be less than ${TAG_CONSTANTS.VALIDATION.DESCRIPTION_MAX_LENGTH} characters`,
    )
    .optional()
    .or(z.literal("")),
  color: z
    .string()
    .regex(
      TAG_CONSTANTS.VALIDATION.COLOR_PATTERN,
      "Color must be a valid hex color (e.g., #3B82F6)",
    )
    .optional()
    .or(z.literal("")),
  icon: z
    .string()
    .max(
      TAG_CONSTANTS.VALIDATION.ICON_MAX_LENGTH,
      `Icon must be less than ${TAG_CONSTANTS.VALIDATION.ICON_MAX_LENGTH} characters`,
    )
    .optional()
    .or(z.literal("")),
  isActive: z.boolean().optional(),
  isFeatured: z.boolean().optional(),
  metaTitle: z
    .string()
    .max(
      TAG_CONSTANTS.VALIDATION.META_TITLE_MAX_LENGTH,
      `Meta title must be less than ${TAG_CONSTANTS.VALIDATION.META_TITLE_MAX_LENGTH} characters`,
    )
    .optional()
    .or(z.literal("")),
  metaDescription: z
    .string()
    .max(
      TAG_CONSTANTS.VALIDATION.META_DESCRIPTION_MAX_LENGTH,
      `Meta description must be less than ${TAG_CONSTANTS.VALIDATION.META_DESCRIPTION_MAX_LENGTH} characters`,
    )
    .optional()
    .or(z.literal("")),
});

type TagFormValues = z.infer<typeof tagSchema>;

interface CreateTagFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (data: CreateTagDto) => Promise<void>;
  isLoading?: boolean;
}

export function CreateTagFormDialog({
  open,
  onOpenChange,
  onSubmit,
  isLoading,
}: CreateTagFormDialogProps) {
  const { t } = useI18n();

  const form = useForm({
    resolver: zodResolver(tagSchema),
    defaultValues: {
      name: "",
      slug: "",
      description: "",
      color: "",
      icon: "",
      isActive: true,
      isFeatured: false,
      metaTitle: "",
      metaDescription: "",
    },
  });

  const handleSubmit = async (data: TagFormValues) => {
    const submitData: CreateTagDto = {
      name: data.name,
      slug: data.slug || undefined,
      description: data.description || undefined,
      color: data.color || undefined,
      icon: data.icon || undefined,
      isActive: data.isActive,
      isFeatured: data.isFeatured,
      metaTitle: data.metaTitle || undefined,
      metaDescription: data.metaDescription || undefined,
    };
    await onSubmit(submitData);
    onOpenChange(false);
    form.reset();
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{t("form.createTitle", "tags")}</DialogTitle>
          <DialogDescription>
            {t("form.createDescription", "tags")}
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(handleSubmit)}
            className="space-y-4"
          >
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t("form.name", "tags")}</FormLabel>
                  <FormControl>
                    <Input placeholder="Tag Name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="slug"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t("form.slug", "tags")}</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="tag-slug (auto-generated if empty)"
                      {...field}
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
                  <FormLabel>{t("form.description", "tags")}</FormLabel>
                  <FormControl>
                    <textarea
                      className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                      placeholder="Tag description"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="color"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t("form.color", "tags")}</FormLabel>
                    <FormControl>
                      <Input type="text" placeholder="#3B82F6" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="icon"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t("form.icon", "tags")}</FormLabel>
                    <FormControl>
                      <Input placeholder="🚀 or icon-name" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="isActive"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t("form.isActive", "tags")}</FormLabel>
                    <Select
                      onValueChange={(value) =>
                        field.onChange(value === "true")
                      }
                      value={field.value ? "true" : "false"}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="true">
                          {t("status.active", "tags")}
                        </SelectItem>
                        <SelectItem value="false">
                          {t("status.inactive", "tags")}
                        </SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="isFeatured"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t("form.isFeatured", "tags")}</FormLabel>
                    <Select
                      onValueChange={(value) =>
                        field.onChange(value === "true")
                      }
                      value={field.value ? "true" : "false"}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="true">
                          {t("featured.yes", "tags")}
                        </SelectItem>
                        <SelectItem value="false">
                          {t("featured.no", "tags")}
                        </SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <FormField
              control={form.control}
              name="metaTitle"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t("form.metaTitle", "tags")}</FormLabel>
                  <FormControl>
                    <Input placeholder="SEO meta title" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="metaDescription"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t("form.metaDescription", "tags")}</FormLabel>
                  <FormControl>
                    <textarea
                      className="flex min-h-[60px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                      placeholder="SEO meta description"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
                disabled={isLoading}
              >
                {t("actions.cancel", "common")}
              </Button>
              <Button type="submit" disabled={isLoading}>
                {isLoading
                  ? t("actions.saving", "common")
                  : t("actions.create", "common")}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
