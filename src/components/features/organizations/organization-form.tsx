"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState } from "react";
import { useForm, useWatch } from "react-hook-form";
import { toast } from "sonner";

import { useI18n } from "@/components/providers/i18n-provider";
import { Button } from "@/components/ui/core/button";
import { Input } from "@/components/ui/core/input";
import {
  Form,
  FormControl,
  FormDescription,
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
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/animate-ui/components/radix/tabs";
import { MediaAPI } from "@/lib/api/media";
import { ORGANIZATION_CONSTANTS } from "@/lib/constants/organization.constants";
import {
  createOrganizationSchema,
  type CreateOrganizationFormData,
} from "@/lib/validators/organizations";
import { ImageIcon, Link as LinkIcon, Loader2, Upload, X } from "lucide-react";
import Image from "next/image";
import { OrganizationDescriptionEditor } from "./organization-description-editor";

interface OrganizationFormProps {
  mode: "create" | "edit";
  defaultValues?: Partial<CreateOrganizationFormData>;
  onSubmit: (data: CreateOrganizationFormData) => Promise<void>;
  isLoading?: boolean;
}

export function OrganizationForm({
  mode,
  defaultValues,
  onSubmit,
  isLoading = false,
}: OrganizationFormProps) {
  const { t } = useI18n();
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [logoPreview, setLogoPreview] = useState<string>(
    defaultValues?.logoUrl || "",
  );
  const [isUploadingLogo, setIsUploadingLogo] = useState(false);

  const form = useForm<CreateOrganizationFormData>({
    resolver: zodResolver(createOrganizationSchema),
    defaultValues: {
      name: defaultValues?.name || "",
      slug: defaultValues?.slug || "",
      description: defaultValues?.description || "",
      websiteUrl: defaultValues?.websiteUrl || "",
      logoUrl: defaultValues?.logoUrl || "",
      logoId: defaultValues?.logoId || "",
      visibility:
        defaultValues?.visibility || ORGANIZATION_CONSTANTS.VISIBILITY.PUBLIC,
    },
  });

  // Auto-slug generation from name (create mode only). useWatch avoids React Compiler warning from form.watch().
  const name = useWatch({
    control: form.control,
    name: "name",
    defaultValue: defaultValues?.name ?? "",
  });
  useEffect(() => {
    if (mode === "create" && name) {
      const currentSlug = form.getValues("slug");
      // Only auto-generate if slug is empty
      if (!currentSlug) {
        const autoSlug = name
          .toLowerCase()
          .replace(/[^a-z0-9]+/g, "-")
          .replace(/^-+|-+$/g, "");
        form.setValue("slug", autoSlug);
      }
    }
  }, [name, mode, form]);

  // Handle logo file selection
  const handleLogoFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith("image/")) {
      toast.error(t("create.form.toastSelectImage", "organizations"));
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast.error(t("create.form.toastImageMaxSize", "organizations"));
      return;
    }

    setLogoFile(file);
    setLogoPreview(URL.createObjectURL(file));
  };

  // Remove logo
  const handleRemoveLogo = () => {
    setLogoFile(null);
    setLogoPreview("");
    form.setValue("logoUrl", "");
    form.setValue("logoId", "");
  };

  // Handle form submission
  const handleSubmit = async (data: CreateOrganizationFormData) => {
    try {
      // Upload logo if a file was selected
      if (logoFile) {
        setIsUploadingLogo(true);
        const uploadResult = await MediaAPI.upload([logoFile], {
          folder: "organizations",
        });

        if (uploadResult.success && uploadResult.data?.[0]) {
          data.logoId = uploadResult.data[0].id;
          data.logoUrl = uploadResult.data[0].url;
        } else {
          toast.error(t("create.form.toastLogoUploadError", "organizations"));
          setIsUploadingLogo(false);
          return;
        }
        setIsUploadingLogo(false);
      }

      // Submit the form
      await onSubmit(data);
    } catch (error) {
      setIsUploadingLogo(false);
      console.error("Form submission error:", error);
    }
  };

  const isSubmitting = isLoading || isUploadingLogo;

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
        {/* Organization Name */}
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t("create.form.name", "organizations")} *</FormLabel>
              <FormControl>
                <Input
                  placeholder={t(
                    "create.form.namePlaceholder",
                    "organizations",
                  )}
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Slug */}
        <FormField
          control={form.control}
          name="slug"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t("create.form.slug", "organizations")}</FormLabel>
              <FormControl>
                <Input
                  placeholder={t(
                    "create.form.slugPlaceholder",
                    "organizations",
                  )}
                  {...field}
                />
              </FormControl>
              <FormDescription>
                {t("create.form.slugHelper", "organizations")}
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Description with TipTap */}
        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>
                {t("create.form.description", "organizations")}
              </FormLabel>
              <FormControl>
                <OrganizationDescriptionEditor
                  value={field.value}
                  onChange={field.onChange}
                  placeholder={t(
                    "create.form.descriptionPlaceholder",
                    "organizations",
                  )}
                />
              </FormControl>
              <FormDescription>
                {t("create.form.descriptionHelper", "organizations")}
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Website URL */}
        <FormField
          control={form.control}
          name="websiteUrl"
          render={({ field }) => (
            <FormItem>
              <FormLabel>
                {t("create.form.websiteUrl", "organizations")}
              </FormLabel>
              <FormControl>
                <Input
                  type="url"
                  placeholder={t(
                    "create.form.websiteUrlPlaceholder",
                    "organizations",
                  )}
                  {...field}
                />
              </FormControl>
              <FormDescription>
                {t("create.form.websiteUrlHelper", "organizations")}
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Logo Upload/URL */}
        <FormItem>
          <FormLabel>{t("create.form.logo", "organizations")}</FormLabel>
          <Tabs defaultValue="upload" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="upload">
                <Upload className="h-4 w-4 mr-2" />
                {t("create.form.logoUpload", "organizations")}
              </TabsTrigger>
              <TabsTrigger value="url">
                <LinkIcon className="h-4 w-4 mr-2" />
                {t("create.form.logoUrl", "organizations")}
              </TabsTrigger>
            </TabsList>

            {/* Upload Tab */}
            <TabsContent value="upload" className="space-y-4">
              <div className="flex items-center gap-4">
                <div className="flex-1">
                  <Input
                    type="file"
                    accept="image/*"
                    onChange={handleLogoFileChange}
                    className="cursor-pointer"
                  />
                </div>
              </div>

              {logoPreview && (
                <div className="relative w-32 h-32 border border-border rounded-lg overflow-hidden">
                  <Image
                    src={logoPreview}
                    alt={t("create.form.logoPreviewAlt", "organizations")}
                    fill
                    className="object-contain"
                  />
                  <Button
                    type="button"
                    variant="destructive"
                    size="icon"
                    className="absolute top-1 right-1 h-6 w-6"
                    onClick={handleRemoveLogo}
                  >
                    <X className="h-3 w-3" />
                  </Button>
                </div>
              )}
            </TabsContent>

            {/* URL Tab */}
            <TabsContent value="url">
              <FormField
                control={form.control}
                name="logoUrl"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Input
                        type="url"
                        placeholder={t(
                          "create.form.logoUrlPlaceholder",
                          "organizations",
                        )}
                        {...field}
                        onChange={(e) => {
                          field.onChange(e);
                          setLogoPreview(e.target.value);
                        }}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {logoPreview && (
                <div className="relative w-32 h-32 border border-border rounded-lg overflow-hidden mt-4">
                  <Image
                    src={logoPreview}
                    alt={t("create.form.logoPreviewAlt", "organizations")}
                    fill
                    className="object-contain"
                  />
                </div>
              )}
            </TabsContent>
          </Tabs>
          <FormDescription>
            {t("create.form.logoHelper", "organizations")}
          </FormDescription>
        </FormItem>

        {/* Visibility */}
        <FormField
          control={form.control}
          name="visibility"
          render={({ field }) => (
            <FormItem>
              <FormLabel>
                {t("create.form.visibility", "organizations")}
              </FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value={ORGANIZATION_CONSTANTS.VISIBILITY.PUBLIC}>
                    <div className="flex items-start gap-3">
                      <ImageIcon className="h-4 w-4 mt-0.5 flex-shrink-0" />
                      <div>
                        <div className="font-medium">
                          {t("create.form.visibilityPublic", "organizations")}
                        </div>
                        <div className="text-xs text-muted-foreground">
                          {t(
                            "create.form.visibilityPublicDescription",
                            "organizations",
                          )}
                        </div>
                      </div>
                    </div>
                  </SelectItem>
                  <SelectItem value={ORGANIZATION_CONSTANTS.VISIBILITY.PRIVATE}>
                    <div className="flex items-start gap-3">
                      <ImageIcon className="h-4 w-4 mt-0.5 flex-shrink-0" />
                      <div>
                        <div className="font-medium">
                          {t("create.form.visibilityPrivate", "organizations")}
                        </div>
                        <div className="text-xs text-muted-foreground">
                          {t(
                            "create.form.visibilityPrivateDescription",
                            "organizations",
                          )}
                        </div>
                      </div>
                    </div>
                  </SelectItem>
                </SelectContent>
              </Select>
              <FormDescription>
                {t("create.form.visibilityHelper", "organizations")}
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Submit Button */}
        <div className="flex items-center gap-4 pt-4">
          <Button type="submit" disabled={isSubmitting} className="min-w-32">
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                {mode === "create"
                  ? t("create.form.submitting", "organizations")
                  : t("settings.form.submitting", "organizations")}
              </>
            ) : mode === "create" ? (
              t("create.form.submit", "organizations")
            ) : (
              t("settings.form.submit", "organizations")
            )}
          </Button>
        </div>
      </form>
    </Form>
  );
}
