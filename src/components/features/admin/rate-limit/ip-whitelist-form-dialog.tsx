"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

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
  createIpWhitelistSchema,
  updateIpWhitelistSchema,
  type CreateIpWhitelistFormData,
  type UpdateIpWhitelistFormData,
} from "@/lib/validators/rate-limit.validator";
import type { IpWhitelist } from "@/lib/interface/rate-limit.interface";

interface IpWhitelistFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  entry?: IpWhitelist;
  onSubmit: (
    data: CreateIpWhitelistFormData | UpdateIpWhitelistFormData,
  ) => Promise<void>;
  isLoading?: boolean;
}

export function IpWhitelistFormDialog({
  open,
  onOpenChange,
  entry,
  onSubmit,
  isLoading,
}: IpWhitelistFormDialogProps) {
  const { t } = useI18n();
  const isEditing = !!entry;

  const form = useForm<CreateIpWhitelistFormData | UpdateIpWhitelistFormData>({
    resolver: zodResolver(
      isEditing ? updateIpWhitelistSchema : createIpWhitelistSchema,
    ),
    defaultValues: {
      ip: entry?.ip || "",
      description: entry?.description || "",
      reason: entry?.reason || "",
    },
  });

  const handleSubmit = async (
    data: CreateIpWhitelistFormData | UpdateIpWhitelistFormData,
  ) => {
    await onSubmit(data);
    onOpenChange(false);
    form.reset();
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>
            {isEditing
              ? t("rateLimit.ipWhitelist.edit.title", "admin")
              : t("rateLimit.ipWhitelist.createDialog.title", "admin")}
          </DialogTitle>
          <DialogDescription>
            {isEditing
              ? t("rateLimit.ipWhitelist.edit.description", "admin")
              : t("rateLimit.ipWhitelist.createDialog.description", "admin")}
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(handleSubmit)}
            className="space-y-4"
          >
            {!isEditing && (
              <FormField
                control={form.control}
                name="ip"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      {t("rateLimit.ipWhitelist.form.ip", "admin")}
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder={t(
                          "rateLimit.ipWhitelist.form.ipPlaceholder",
                          "admin",
                        )}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    {t("rateLimit.ipWhitelist.form.description", "admin")}
                  </FormLabel>
                  <FormControl>
                    <Input
                      placeholder={t(
                        "rateLimit.ipWhitelist.form.descriptionPlaceholder",
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
              name="reason"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    {t("rateLimit.ipWhitelist.form.reason", "admin")}
                  </FormLabel>
                  <FormControl>
                    <Input
                      placeholder={t(
                        "rateLimit.ipWhitelist.form.reasonPlaceholder",
                        "admin",
                      )}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            {isEditing && (
              <FormField
                control={form.control}
                name="active"
                render={({ field }) => (
                  <FormItem className="flex items-center space-x-2 space-y-0">
                    <FormControl>
                      <input
                        type="checkbox"
                        checked={field.value}
                        onChange={field.onChange}
                        className="h-4 w-4 rounded border-gray-300"
                      />
                    </FormControl>
                    <FormLabel className="!mt-0">
                      {t("rateLimit.ipWhitelist.form.active", "admin")}
                    </FormLabel>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}
            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
              >
                {t("common.cancel", "common")}
              </Button>
              <Button type="submit" disabled={isLoading}>
                {isLoading
                  ? t("common.saving", "common")
                  : isEditing
                    ? t("common.save", "common")
                    : t("common.create", "common")}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
