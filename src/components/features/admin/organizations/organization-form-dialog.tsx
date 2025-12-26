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
import type { Organization } from "@/lib/interface/organization.interface";
import { ORGANIZATION_CONSTANTS } from "@/lib/constants/organization.constants";
import {
  createOrganizationSchema,
  type CreateOrganizationFormData,
} from "@/lib/validators/organizations";

type OrganizationFormValues = CreateOrganizationFormData;

interface OrganizationFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  organization?: Organization;
  onSubmit: (data: OrganizationFormValues) => Promise<void>;
  isLoading?: boolean;
}

export function OrganizationFormDialog({
  open,
  onOpenChange,
  organization,
  onSubmit,
  isLoading,
}: OrganizationFormDialogProps) {
  const { t } = useI18n();
  const isEditing = !!organization;

  const form = useForm<OrganizationFormValues>({
    resolver: zodResolver(createOrganizationSchema),
    defaultValues: {
      name: organization?.name || "",
      slug: organization?.slug || "",
      description: organization?.description || "",
      websiteUrl: organization?.websiteUrl || "",
      logoUrl: organization?.logoUrl || "",
      logoId: organization?.logoId || "",
      visibility:
        organization?.visibility || ORGANIZATION_CONSTANTS.VISIBILITY.PUBLIC,
    },
  });

  const handleSubmit = async (data: OrganizationFormValues) => {
    await onSubmit(data);
    onOpenChange(false);
    form.reset();
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[525px]">
        <DialogHeader>
          <DialogTitle>
            {isEditing
              ? t("organizations.edit.title", "admin")
              : t("organizations.create.title", "admin")}
          </DialogTitle>
          <DialogDescription>
            {isEditing
              ? t("organizations.edit.description", "admin")
              : t("organizations.create.description", "admin")}
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
                  <FormLabel>
                    {t("organizations.fields.name", "admin")}
                  </FormLabel>
                  <FormControl>
                    <Input
                      placeholder={t(
                        "organizations.fields.namePlaceholder",
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
              name="slug"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    {t("organizations.fields.slug", "admin")}
                  </FormLabel>
                  <FormControl>
                    <Input
                      placeholder={t(
                        "organizations.fields.slugPlaceholder",
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
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    {t("organizations.fields.description", "admin")}
                  </FormLabel>
                  <FormControl>
                    <Input
                      placeholder={t(
                        "organizations.fields.descriptionPlaceholder",
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
              name="websiteUrl"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    {t("organizations.fields.websiteUrl", "admin")}
                  </FormLabel>
                  <FormControl>
                    <Input
                      type="url"
                      placeholder="https://example.com"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="logoUrl"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    {t("organizations.fields.logoUrl", "admin")}
                  </FormLabel>
                  <FormControl>
                    <Input
                      type="url"
                      placeholder="https://example.com/logo.png"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="visibility"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    {t("organizations.fields.visibility", "admin")}
                  </FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue
                          placeholder={t(
                            "organizations.fields.visibility",
                            "admin",
                          )}
                        />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {Object.values(ORGANIZATION_CONSTANTS.VISIBILITY).map(
                        (visibility) => (
                          <SelectItem key={visibility} value={visibility}>
                            {t(
                              `organizations.visibility.${visibility}`,
                              "admin",
                            )}
                          </SelectItem>
                        ),
                      )}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <DialogFooter>
              <Button type="submit" disabled={isLoading}>
                {isLoading
                  ? t("actions.saving", "common")
                  : isEditing
                    ? t("actions.save", "common")
                    : t("create", "common")}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
