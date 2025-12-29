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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  createApiKeySchema,
  updateApiKeySchema,
  type CreateApiKeyFormData,
  type UpdateApiKeyFormData,
} from "@/lib/validators/rate-limit.validator";
import type { ApiKey } from "@/lib/interface/rate-limit.interface";

interface ApiKeyFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  apiKey?: ApiKey;
  plans?: Array<{ name: string }>;
  onSubmit: (
    data: CreateApiKeyFormData | UpdateApiKeyFormData,
  ) => Promise<void>;
  isLoading?: boolean;
}

export function ApiKeyFormDialog({
  open,
  onOpenChange,
  apiKey,
  plans = [],
  onSubmit,
  isLoading,
}: ApiKeyFormDialogProps) {
  const { t } = useI18n();
  const isEditing = !!apiKey;

  const form = useForm<CreateApiKeyFormData | UpdateApiKeyFormData>({
    resolver: zodResolver(isEditing ? updateApiKeySchema : createApiKeySchema),
    defaultValues: {
      key: apiKey?.key || "",
      plan: apiKey?.plan?.name || apiKey?.planId || "",
      name: apiKey?.name || "",
      ownerId: apiKey?.userId || "",
      isWhitelist: apiKey?.isWhitelist || false,
      expiresAt: apiKey?.expiresAt
        ? new Date(apiKey.expiresAt).toISOString()
        : "",
    },
  });

  const handleSubmit = async (
    data: CreateApiKeyFormData | UpdateApiKeyFormData,
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
              ? t("rateLimit.apiKeys.edit.title", "admin")
              : t("rateLimit.apiKeys.createDialog.title", "admin")}
          </DialogTitle>
          <DialogDescription>
            {isEditing
              ? t("rateLimit.apiKeys.edit.description", "admin")
              : t("rateLimit.apiKeys.createDialog.description", "admin")}
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
            {!isEditing && (
              <FormField
                control={form.control}
                name="key"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      {t("rateLimit.apiKeys.form.key", "admin")}
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder={t(
                          "rateLimit.apiKeys.form.keyPlaceholder",
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
              name="plan"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    {t("rateLimit.apiKeys.form.plan", "admin")}
                  </FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue
                          placeholder={t(
                            "rateLimit.apiKeys.form.planPlaceholder",
                            "admin",
                          )}
                        />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {plans.map((plan) => (
                        <SelectItem key={plan.name} value={plan.name}>
                          {plan.name}
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
                  <FormLabel>
                    {t("rateLimit.apiKeys.form.name", "admin")}
                  </FormLabel>
                  <FormControl>
                    <Input
                      placeholder={t(
                        "rateLimit.apiKeys.form.namePlaceholder",
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
              name="ownerId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    {t("rateLimit.apiKeys.form.ownerId", "admin")}
                  </FormLabel>
                  <FormControl>
                    <Input
                      placeholder={t(
                        "rateLimit.apiKeys.form.ownerIdPlaceholder",
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
              name="isWhitelist"
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
                    {t("rateLimit.apiKeys.form.isWhitelist", "admin")}
                  </FormLabel>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="expiresAt"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    {t("rateLimit.apiKeys.form.expiresAt", "admin")}
                  </FormLabel>
                  <FormControl>
                    <Input
                      type="datetime-local"
                      {...field}
                      value={
                        field.value
                          ? new Date(field.value).toISOString().slice(0, 16)
                          : ""
                      }
                      onChange={(e) =>
                        field.onChange(
                          e.target.value ? new Date(e.target.value).toISOString() : "",
                        )
                      }
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
                      {t("rateLimit.apiKeys.form.active", "admin")}
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

