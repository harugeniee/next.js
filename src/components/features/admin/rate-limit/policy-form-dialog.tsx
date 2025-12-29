"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, useWatch } from "react-hook-form";
import { useEffect } from "react";

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
  RateLimitScope,
  RateLimitStrategy,
} from "@/lib/interface/rate-limit.interface";
import {
  createPolicySchema,
  updatePolicySchema,
  type CreatePolicyFormData,
  type UpdatePolicyFormData,
} from "@/lib/validators/rate-limit.validator";
import type { RateLimitPolicy } from "@/lib/interface/rate-limit.interface";

interface PolicyFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  policy?: RateLimitPolicy;
  onSubmit: (
    data: CreatePolicyFormData | UpdatePolicyFormData,
  ) => Promise<void>;
  isLoading?: boolean;
}

export function PolicyFormDialog({
  open,
  onOpenChange,
  policy,
  onSubmit,
  isLoading,
}: PolicyFormDialogProps) {
  const { t } = useI18n();
  const isEditing = !!policy;

  const form = useForm<CreatePolicyFormData | UpdatePolicyFormData>({
    resolver: zodResolver(isEditing ? updatePolicySchema : createPolicySchema),
    defaultValues: {
      name: policy?.name || "",
      enabled: policy?.enabled ?? true,
      priority: policy?.priority || 100,
      scope: policy?.scope || RateLimitScope.GLOBAL,
      routePattern: policy?.routePattern || "",
      strategy: policy?.strategy || RateLimitStrategy.FIXED_WINDOW,
      limit: policy?.limit || 100,
      windowSec: policy?.windowSec || 60,
      burst: policy?.burst || 20,
      refillPerSec: policy?.refillPerSec || 5,
      extra: policy?.extra || {},
      description: policy?.description || "",
    },
  });

  const strategy = useWatch({ control: form.control, name: "strategy" });
  const scope = useWatch({ control: form.control, name: "scope" });

  useEffect(() => {
    if (!isEditing) {
      form.reset({
        name: "",
        enabled: true,
        priority: 100,
        scope: RateLimitScope.GLOBAL,
        routePattern: "",
        strategy: RateLimitStrategy.FIXED_WINDOW,
        limit: 100,
        windowSec: 60,
        burst: 20,
        refillPerSec: 5,
        extra: {},
        description: "",
      });
    }
  }, [open, isEditing, form]);

  const handleSubmit = async (
    data: CreatePolicyFormData | UpdatePolicyFormData,
  ) => {
    await onSubmit(data);
    onOpenChange(false);
    form.reset();
  };

  // Determine button text based on loading and editing state
  const getButtonText = () => {
    if (isLoading) {
      return t("actions.saving", "common");
    }
    if (isEditing) {
      return t("actions.save", "common");
    }
    return t("actions.create", "common");
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {isEditing
              ? t("rateLimit.policies.edit.title", "admin")
              : t("rateLimit.policies.createDialog.title", "admin")}
          </DialogTitle>
          <DialogDescription>
            {isEditing
              ? t("rateLimit.policies.edit.description", "admin")
              : t("rateLimit.policies.createDialog.description", "admin")}
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
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      {t("rateLimit.policies.form.name", "admin")}
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder={t(
                          "rateLimit.policies.form.namePlaceholder",
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
              name="scope"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    {t("rateLimit.policies.form.scope", "admin")}
                  </FormLabel>
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
                      {Object.values(RateLimitScope).map((s) => (
                        <SelectItem key={s} value={s}>
                          {s}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            {scope === RateLimitScope.ROUTE && (
              <FormField
                control={form.control}
                name="routePattern"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      {t("rateLimit.policies.form.routePattern", "admin")}
                    </FormLabel>
                    <FormControl>
                      <Input placeholder="^POST:/api/v1/messages$" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}
            <FormField
              control={form.control}
              name="strategy"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    {t("rateLimit.policies.form.strategy", "admin")}
                  </FormLabel>
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
                      {Object.values(RateLimitStrategy).map((s) => (
                        <SelectItem key={s} value={s}>
                          {s}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            {(strategy === RateLimitStrategy.FIXED_WINDOW ||
              strategy === RateLimitStrategy.SLIDING_WINDOW) && (
              <>
                <FormField
                  control={form.control}
                  name="limit"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        {t("rateLimit.policies.form.limit", "admin")}
                      </FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          placeholder="100"
                          {...field}
                          onChange={(e) =>
                            field.onChange(parseInt(e.target.value, 10) || 0)
                          }
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="windowSec"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        {t("rateLimit.policies.form.windowSec", "admin")}
                      </FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          placeholder="60"
                          {...field}
                          onChange={(e) =>
                            field.onChange(parseInt(e.target.value, 10) || 0)
                          }
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </>
            )}
            {strategy === RateLimitStrategy.TOKEN_BUCKET && (
              <>
                <FormField
                  control={form.control}
                  name="burst"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        {t("rateLimit.policies.form.burst", "admin")}
                      </FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          placeholder="20"
                          {...field}
                          onChange={(e) =>
                            field.onChange(parseInt(e.target.value, 10) || 0)
                          }
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="refillPerSec"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        {t("rateLimit.policies.form.refillPerSec", "admin")}
                      </FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          step="0.1"
                          placeholder="5"
                          {...field}
                          onChange={(e) =>
                            field.onChange(parseFloat(e.target.value) || 0)
                          }
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </>
            )}
            <FormField
              control={form.control}
              name="priority"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    {t("rateLimit.policies.form.priority", "admin")}
                  </FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      placeholder="100"
                      {...field}
                      onChange={(e) =>
                        field.onChange(parseInt(e.target.value, 10) || 0)
                      }
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
                  <FormLabel>
                    {t("rateLimit.policies.form.description", "admin")}
                  </FormLabel>
                  <FormControl>
                    <Input
                      placeholder={t(
                        "rateLimit.policies.form.descriptionPlaceholder",
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
                name="enabled"
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
                      {t("rateLimit.policies.form.enabled", "admin")}
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
                {t("actions.cancel", "common")}
              </Button>
              <Button type="submit" disabled={isLoading}>
                {getButtonText()}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
