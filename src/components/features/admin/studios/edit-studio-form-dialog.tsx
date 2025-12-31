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
import { STUDIO_CONSTANTS } from "@/lib/constants/studio.constants";
import type {
  Studio,
  UpdateStudioDto,
} from "@/lib/interface/studio.interface";

const studioSchema = z.object({
  name: z
    .string()
    .min(1, "Name is required")
    .max(
      STUDIO_CONSTANTS.NAME_MAX_LENGTH,
      `Name must be less than ${STUDIO_CONSTANTS.NAME_MAX_LENGTH} characters`,
    )
    .optional(),
  myAnimeListId: z.string().optional(),
  aniListId: z.string().optional(),
  type: z
    .enum([
      STUDIO_CONSTANTS.TYPES.ANIMATION_STUDIO,
      STUDIO_CONSTANTS.TYPES.PRODUCTION_COMPANY,
    ])
    .optional(),
  siteUrl: z
    .string()
    .url("Invalid URL")
    .max(
      STUDIO_CONSTANTS.SITE_URL_MAX_LENGTH,
      `URL must be less than ${STUDIO_CONSTANTS.SITE_URL_MAX_LENGTH} characters`,
    )
    .optional()
    .or(z.literal("")),
  status: z
    .enum([
      STUDIO_CONSTANTS.STATUS.ACTIVE,
      STUDIO_CONSTANTS.STATUS.INACTIVE,
      STUDIO_CONSTANTS.STATUS.PENDING,
      STUDIO_CONSTANTS.STATUS.ARCHIVED,
    ])
    .optional(),
});

type StudioFormValues = z.infer<typeof studioSchema>;

interface EditStudioFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  studio?: Studio;
  onSubmit: (data: UpdateStudioDto) => Promise<void>;
  isLoading?: boolean;
}

export function EditStudioFormDialog({
  open,
  onOpenChange,
  studio,
  onSubmit,
  isLoading,
}: EditStudioFormDialogProps) {
  const { t } = useI18n();

  const form = useForm({
    resolver: zodResolver(studioSchema),
    defaultValues: {
      name: studio?.name || "",
      myAnimeListId: studio?.myAnimeListId || "",
      aniListId: studio?.aniListId || "",
      type: studio?.type,
      siteUrl: studio?.siteUrl || "",
      status: studio?.status || STUDIO_CONSTANTS.STATUS.ACTIVE,
    },
  });

  // Update form values when studio changes
  React.useEffect(() => {
    if (studio) {
      form.reset({
        name: studio.name,
        myAnimeListId: studio.myAnimeListId || "",
        aniListId: studio.aniListId || "",
        type: studio.type,
        siteUrl: studio.siteUrl || "",
        status: studio.status || STUDIO_CONSTANTS.STATUS.ACTIVE,
      });
    }
  }, [studio, form]);

  const handleSubmit = async (data: StudioFormValues) => {
    const submitData: UpdateStudioDto = {
      name: data.name,
      myAnimeListId: data.myAnimeListId || undefined,
      aniListId: data.aniListId || undefined,
      type: data.type,
      siteUrl: data.siteUrl || undefined,
      status: data.status,
    };
    await onSubmit(submitData);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>{t("studios.form.editTitle", "admin")}</DialogTitle>
          <DialogDescription>
            {t("studios.form.editDescription", "admin")}
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
                  <FormLabel>{t("studios.form.name", "admin")}</FormLabel>
                  <FormControl>
                    <Input placeholder="Studio Name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="type"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t("studios.form.type", "admin")}</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    value={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder={t("studios.form.selectType", "admin")} />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value={STUDIO_CONSTANTS.TYPES.ANIMATION_STUDIO}>
                        {t("studios.types.animation_studio", "admin")}
                      </SelectItem>
                      <SelectItem value={STUDIO_CONSTANTS.TYPES.PRODUCTION_COMPANY}>
                        {t("studios.types.production_company", "admin")}
                      </SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="status"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t("studios.form.status", "admin")}</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    value={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder={t("studios.form.selectStatus", "admin")} />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value={STUDIO_CONSTANTS.STATUS.ACTIVE}>
                        {t("studios.status.active", "admin")}
                      </SelectItem>
                      <SelectItem value={STUDIO_CONSTANTS.STATUS.INACTIVE}>
                        {t("studios.status.inactive", "admin")}
                      </SelectItem>
                      <SelectItem value={STUDIO_CONSTANTS.STATUS.PENDING}>
                        {t("studios.status.pending", "admin")}
                      </SelectItem>
                      <SelectItem value={STUDIO_CONSTANTS.STATUS.ARCHIVED}>
                        {t("studios.status.archived", "admin")}
                      </SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="myAnimeListId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    {t("studios.form.myAnimeListId", "admin")}
                  </FormLabel>
                  <FormControl>
                    <Input placeholder="MAL ID" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="aniListId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t("studios.form.aniListId", "admin")}</FormLabel>
                  <FormControl>
                    <Input placeholder="AniList ID" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="siteUrl"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t("studios.form.siteUrl", "admin")}</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="https://example.com"
                      type="url"
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
                {t("common.cancel", "common")}
              </Button>
              <Button type="submit" disabled={isLoading}>
                {isLoading
                  ? t("actions.saving", "common")
                  : t("studios.form.save", "admin")}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}

