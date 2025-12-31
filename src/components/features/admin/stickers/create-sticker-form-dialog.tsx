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
import { STICKER_CONSTANTS } from "@/lib/constants/sticker.constants";
import type { CreateStickerDto } from "@/lib/interface/sticker.interface";

const stickerSchema = z.object({
  name: z
    .string()
    .min(1, "Name is required")
    .max(
      STICKER_CONSTANTS.NAME_MAX_LENGTH,
      `Name must be less than ${STICKER_CONSTANTS.NAME_MAX_LENGTH} characters`,
    ),
  mediaId: z.string().min(1, "Media ID is required"),
  tags: z.string().optional(),
  isAnimated: z.boolean(),
});

type StickerFormValues = z.infer<typeof stickerSchema>;

interface CreateStickerFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (data: CreateStickerDto) => Promise<void>;
  isLoading?: boolean;
}

export function CreateStickerFormDialog({
  open,
  onOpenChange,
  onSubmit,
  isLoading,
}: CreateStickerFormDialogProps) {
  const { t } = useI18n();

  const form = useForm({
    resolver: zodResolver(stickerSchema),
    defaultValues: {
      name: "",
      mediaId: "",
      tags: "",
      isAnimated: false,
    },
  });

  const handleSubmit = async (data: StickerFormValues) => {
    const submitData: CreateStickerDto = {
      ...data,
      tags: data.tags
        ? data.tags
            .split(",")
            .map((tag: string) => tag.trim())
            .filter(Boolean)
        : undefined,
    };
    await onSubmit(submitData);
    onOpenChange(false);
    form.reset();
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>{t("stickers.form.createTitle", "admin")}</DialogTitle>
          <DialogDescription>
            {t("stickers.form.createDescription", "admin")}
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
                  <FormLabel>{t("stickers.form.name", "admin")}</FormLabel>
                  <FormControl>
                    <Input placeholder="My Sticker" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="mediaId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t("stickers.form.mediaId", "admin")}</FormLabel>
                  <FormControl>
                    <Input placeholder="media_123" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="tags"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t("stickers.form.tags", "admin")}</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="funny, cute, animated (comma-separated)"
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
              name="isAnimated"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                  <div className="space-y-0.5">
                    <FormLabel className="text-base">
                      {t("stickers.form.isAnimated", "admin")}
                    </FormLabel>
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
                  : t("stickers.form.save", "admin")}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
