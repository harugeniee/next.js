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
  createPlanSchema,
  updatePlanSchema,
  type CreatePlanFormData,
  type UpdatePlanFormData,
} from "@/lib/validators/rate-limit.validator";
import type { Plan } from "@/lib/interface/rate-limit.interface";

interface PlanFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  plan?: Plan;
  onSubmit: (
    data: CreatePlanFormData | UpdatePlanFormData,
  ) => Promise<void>;
  isLoading?: boolean;
}

export function PlanFormDialog({
  open,
  onOpenChange,
  plan,
  onSubmit,
  isLoading,
}: PlanFormDialogProps) {
  const { t } = useI18n();
  const isEditing = !!plan;

  const form = useForm<CreatePlanFormData | UpdatePlanFormData>({
    resolver: zodResolver(isEditing ? updatePlanSchema : createPlanSchema),
    defaultValues: {
      name: plan?.name || "",
      limitPerMin: plan?.limitPerMin || 100,
      ttlSec: plan?.ttlSec || 60,
      description: plan?.description || "",
      displayOrder: plan?.displayOrder || 0,
    },
  });

  const handleSubmit = async (
    data: CreatePlanFormData | UpdatePlanFormData,
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
              ? t("rateLimit.plans.edit.title", "admin")
              : t("rateLimit.plans.createDialog.title", "admin")}
          </DialogTitle>
          <DialogDescription>
            {isEditing
              ? t("rateLimit.plans.edit.description", "admin")
              : t("rateLimit.plans.createDialog.description", "admin")}
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
            {!isEditing && (
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      {t("rateLimit.plans.form.name", "admin")}
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder={t(
                          "rateLimit.plans.form.namePlaceholder",
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
              name="limitPerMin"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    {t("rateLimit.plans.form.limitPerMin", "admin")}
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
              name="ttlSec"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    {t("rateLimit.plans.form.ttlSec", "admin")}
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
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    {t("rateLimit.plans.form.description", "admin")}
                  </FormLabel>
                  <FormControl>
                    <Input
                      placeholder={t(
                        "rateLimit.plans.form.descriptionPlaceholder",
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
              name="displayOrder"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    {t("rateLimit.plans.form.displayOrder", "admin")}
                  </FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      placeholder="0"
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
                      {t("rateLimit.plans.form.active", "admin")}
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

