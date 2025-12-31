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
import type { CreateStickerPackDto } from "@/lib/interface/sticker.interface";

const stickerPackSchema = z.object({
  name: z
    .string()
    .min(1, "Name is required")
    .max(
      STICKER_CONSTANTS.PACK_NAME_MAX_LENGTH,
      `Name must be less than ${STICKER_CONSTANTS.PACK_NAME_MAX_LENGTH} characters`,
    ),
  description: z
    .string()
    .max(
      STICKER_CONSTANTS.PACK_DESCRIPTION_MAX_LENGTH,
      `Description must be less than ${STICKER_CONSTANTS.PACK_DESCRIPTION_MAX_LENGTH} characters`,
    )
    .optional(),
  coverMediaId: z.string().optional(),
});

type StickerPackFormValues = z.infer<typeof stickerPackSchema>;

interface CreateStickerPackFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (data: CreateStickerPackDto) => Promise<void>;
  isLoading?: boolean;
}

export function CreateStickerPackFormDialog({
  open,
  onOpenChange,
  onSubmit,
  isLoading,
}: CreateStickerPackFormDialogProps) {
  const { t } = useI18n();

  const form = useForm<StickerPackFormValues>({
    resolver: zodResolver(stickerPackSchema),
    defaultValues: {
      name: "",
      description: "",
      coverMediaId: "",
    },
  });

  const handleSubmit = async (data: StickerPackFormValues) => {
    await onSubmit(data);
    onOpenChange(false);
    form.reset();
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>
            {t("stickers.form.createPackTitle", "admin")}
          </DialogTitle>
          <DialogDescription>
            {t("stickers.form.createPackDescription", "admin")}
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
                  <FormLabel>{t("stickers.form.packName", "admin")}</FormLabel>
                  <FormControl>
                    <Input placeholder="My Sticker Pack" {...field} />
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
                  <FormLabel>
                    {t("stickers.form.packDescription", "admin")}
                  </FormLabel>
                  <FormControl>
                    <textarea
                      placeholder="A collection of fun stickers..."
                      {...field}
                      value={field.value || ""}
                      className="flex min-h-[60px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                      rows={3}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="coverMediaId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    {t("stickers.form.packCoverMediaId", "admin")}
                  </FormLabel>
                  <FormControl>
                    <Input placeholder="media_123 (optional)" {...field} />
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
                  : t("stickers.form.save", "admin")}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
