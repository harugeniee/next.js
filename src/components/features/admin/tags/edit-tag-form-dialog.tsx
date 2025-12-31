"use client";

import React from "react";
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
import type { Tag, UpdateTagDto } from "@/lib/api/tags";

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
    )
    .optional(),
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
  isFeatured: z.boolean().optional(),
});

type TagFormValues = z.infer<typeof tagSchema>;

interface EditTagFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  tag?: Tag;
  onSubmit: (data: UpdateTagDto) => Promise<void>;
  isLoading?: boolean;
}

export function EditTagFormDialog({
  open,
  onOpenChange,
  tag,
  onSubmit,
  isLoading,
}: EditTagFormDialogProps) {
  const { t } = useI18n();

  const form = useForm({
    resolver: zodResolver(tagSchema),
    defaultValues: {
      name: tag?.name || "",
      description: tag?.description || "",
      color: tag?.color || "",
      icon: tag?.icon || "",
      isFeatured: tag?.isFeatured || false,
    },
  });

  // Update form values when tag changes
  React.useEffect(() => {
    if (tag) {
      form.reset({
        name: tag.name,
        description: tag.description || "",
        color: tag.color || "",
        icon: tag.icon || "",
        isFeatured: tag.isFeatured || false,
      });
    }
  }, [tag, form]);

  const handleSubmit = async (data: TagFormValues) => {
    const submitData: UpdateTagDto = {
      name: data.name,
      description: data.description || undefined,
      color: data.color || undefined,
      icon: data.icon || undefined,
      isFeatured: data.isFeatured,
    };
    await onSubmit(submitData);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{t("form.editTitle", "tags")}</DialogTitle>
          <DialogDescription>
            {t("form.editDescription", "tags")}
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
            <FormField
              control={form.control}
              name="isFeatured"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t("form.isFeatured", "tags")}</FormLabel>
                  <Select
                    onValueChange={(value) => field.onChange(value === "true")}
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
                  : t("actions.update", "common")}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
