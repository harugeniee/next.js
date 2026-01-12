"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect } from "react";
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
import { CONTENT_TYPES } from "@/lib/constants/key-value.constants";
import type {
  ContentType,
  CreateKeyValueDto,
  KeyValue,
  UpdateKeyValueDto,
} from "@/lib/interface/key-value.interface";
import {
  createKeyValueSchema,
  updateKeyValueSchema,
  type CreateKeyValueFormData,
  type UpdateKeyValueFormData,
} from "@/lib/validators/key-value.validator";

interface KeyValueFormDialogProps {
  readonly open: boolean;
  readonly onOpenChange: (open: boolean) => void;
  readonly keyValue?: KeyValue;
  readonly onSubmit: (
    data: CreateKeyValueDto | UpdateKeyValueDto,
  ) => Promise<void>;
  readonly isLoading?: boolean;
}

export function KeyValueFormDialog({
  open,
  onOpenChange,
  keyValue,
  onSubmit,
  isLoading,
}: KeyValueFormDialogProps) {
  const { t } = useI18n();
  const isEditMode = !!keyValue;

  // Use appropriate schema based on mode
  const schema = isEditMode ? updateKeyValueSchema : createKeyValueSchema;

  const form = useForm<CreateKeyValueFormData | UpdateKeyValueFormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      ...(isEditMode ? {} : { key: "", namespace: "" }),
      value: "",
      expiresAt: "",
      metadata: "",
      contentType: undefined,
    },
  });

  // Update form when keyValue changes (edit mode)
  useEffect(() => {
    if (keyValue && open) {
      form.reset({
        key: keyValue.key,
        value: JSON.stringify(keyValue.value, null, 2),
        namespace: keyValue.namespace || "",
        expiresAt: keyValue.expiresAt
          ? new Date(keyValue.expiresAt).toISOString().slice(0, 16)
          : "",
        metadata: keyValue.metadata
          ? JSON.stringify(keyValue.metadata, null, 2)
          : "",
        contentType: keyValue.contentType,
      });
    } else if (!keyValue && open) {
      form.reset({
        key: "",
        value: "",
        namespace: "",
        expiresAt: "",
        metadata: "",
        contentType: undefined,
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [keyValue, open]);

  // Helper function to parse value field with fallback to primitives
  const parseValue = (value: string): unknown => {
    // Try to parse as JSON first
    try {
      return JSON.parse(value);
    } catch {
      // If JSON parsing fails, try to parse as primitive
      const trimmed = value.trim();

      if (trimmed === "true") return true;
      if (trimmed === "false") return false;
      if (trimmed === "null") return null;

      // Try to parse as number
      const numValue = Number(trimmed);
      if (!Number.isNaN(numValue) && trimmed !== "") {
        return numValue;
      }

      // Fallback to original value as string
      return value;
    }
  };

  // Helper function to parse metadata field (must be valid JSON)
  const parseMetadata = (
    metadata: string,
  ): Record<string, unknown> | undefined => {
    const metadataStr = metadata.trim();
    if (!metadataStr) return undefined;

    try {
      const parsed = JSON.parse(metadataStr);
      if (typeof parsed === "object" && parsed !== null) {
        return parsed as Record<string, unknown>;
      }
      throw new Error("Metadata must be a valid JSON object");
    } catch {
      throw new Error("Invalid JSON in metadata field");
    }
  };

  // Helper function to normalize expiresAt field
  const normalizeExpiresAt = (
    expiresAt: string | undefined,
  ): string | undefined => {
    if (!expiresAt) return undefined;
    const expiresAtStr = expiresAt.trim();
    return expiresAtStr || undefined;
  };

  // Helper function to normalize contentType field
  const normalizeContentType = (
    contentType: string | undefined,
  ): ContentType | undefined => {
    if (!contentType) return undefined;
    const contentTypeStr = contentType.trim();
    return contentTypeStr ? (contentTypeStr as ContentType) : undefined;
  };

  // Helper function to build submit data based on mode
  const buildSubmitData = (
    data: CreateKeyValueFormData | UpdateKeyValueFormData,
    parsedValue: unknown,
    parsedMetadata: Record<string, unknown> | undefined,
  ): CreateKeyValueDto | UpdateKeyValueDto => {
    const baseData = {
      value: parsedValue,
      expiresAt: normalizeExpiresAt(data.expiresAt),
      metadata: parsedMetadata,
      contentType: normalizeContentType(data.contentType),
    };

    if (isEditMode) {
      return baseData as UpdateKeyValueDto;
    }

    const createData = data as CreateKeyValueFormData;
    return {
      ...baseData,
      key: createData.key,
      namespace: createData.namespace?.trim() || undefined,
    } as CreateKeyValueDto;
  };

  const handleSubmit = async (
    data: CreateKeyValueFormData | UpdateKeyValueFormData,
  ) => {
    try {
      const parsedValue = parseValue(String(data.value));
      const parsedMetadata = data.metadata
        ? parseMetadata(String(data.metadata))
        : undefined;
      const submitData = buildSubmitData(data, parsedValue, parsedMetadata);

      await onSubmit(submitData);
      onOpenChange(false);

      if (!isEditMode) {
        form.reset();
      }
    } catch (error) {
      console.error("Error submitting form:", error);
      // Error will be shown via form validation
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {isEditMode
              ? t("keyValue.form.editTitle", "admin")
              : t("keyValue.form.createTitle", "admin")}
          </DialogTitle>
          <DialogDescription>
            {isEditMode
              ? t("keyValue.form.editDescription", "admin")
              : t("keyValue.form.createDescription", "admin")}
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(handleSubmit)}
            className="space-y-4"
          >
            {/* Key field (only in create mode) - Required */}
            {!isEditMode && (
              <FormField
                control={form.control}
                name="key"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      {t("keyValue.form.key", "admin")}
                      <span className="text-destructive ml-1">*</span>
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder={t("keyValue.form.keyPlaceholder", "admin")}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}

            {/* Value field - Required */}
            <FormField
              control={form.control}
              name="value"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    {t("keyValue.form.value", "admin")}
                    <span className="text-destructive ml-1">*</span>
                  </FormLabel>
                  <FormControl>
                    <textarea
                      placeholder={t("keyValue.form.valuePlaceholder", "admin")}
                      className="flex min-h-[120px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm font-mono ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 resize-none"
                      {...field}
                      value={field.value || ""}
                    />
                  </FormControl>
                  <FormMessage />
                  <p className="text-xs text-muted-foreground">
                    Enter JSON-serializable value (string, number, boolean,
                    object, or array)
                  </p>
                </FormItem>
              )}
            />

            {/* Namespace field (only in create mode) - Optional */}
            {!isEditMode && (
              <FormField
                control={form.control}
                name="namespace"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      {t("keyValue.form.namespace", "admin")}
                      <span className="text-muted-foreground ml-1 text-xs">
                        (optional)
                      </span>
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder={t(
                          "keyValue.form.namespacePlaceholder",
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

            {/* Expires At field - Optional */}
            <FormField
              control={form.control}
              name="expiresAt"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    {t("keyValue.form.expiresAt", "admin")}
                    <span className="text-muted-foreground ml-1 text-xs">
                      (optional)
                    </span>
                  </FormLabel>
                  <FormControl>
                    <Input
                      type="datetime-local"
                      placeholder={t(
                        "keyValue.form.expiresAtPlaceholder",
                        "admin",
                      )}
                      {...field}
                      value={field.value || ""}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Metadata field - Optional */}
            <FormField
              control={form.control}
              name="metadata"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    {t("keyValue.form.metadata", "admin")}
                    <span className="text-muted-foreground ml-1 text-xs">
                      (optional)
                    </span>
                  </FormLabel>
                  <FormControl>
                    <textarea
                      placeholder={t(
                        "keyValue.form.metadataPlaceholder",
                        "admin",
                      )}
                      className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm font-mono ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 resize-none"
                      {...field}
                      value={field.value || ""}
                    />
                  </FormControl>
                  <FormMessage />
                  <p className="text-xs text-muted-foreground">
                    Enter JSON object (optional)
                  </p>
                </FormItem>
              )}
            />

            {/* Content Type field - Optional */}
            <FormField
              control={form.control}
              name="contentType"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    {t("keyValue.form.contentType", "admin")}
                    <span className="text-muted-foreground ml-1 text-xs">
                      (optional)
                    </span>
                  </FormLabel>
                  <Select
                    onValueChange={(value) => {
                      // Convert empty string to undefined
                      field.onChange(value === "none" ? undefined : value);
                    }}
                    value={field.value || "none"}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue
                          placeholder={t(
                            "keyValue.form.selectContentType",
                            "admin",
                          )}
                        />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="none">
                        {t("keyValue.form.selectContentType", "admin")}
                      </SelectItem>
                      {CONTENT_TYPES.map((type) => (
                        <SelectItem key={type} value={type}>
                          {t(`keyValue.contentType.${type}`, "admin")}
                        </SelectItem>
                      ))}
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
                {t("keyValue.form.cancel", "admin")}
              </Button>
              <Button type="submit" disabled={isLoading}>
                {isLoading
                  ? t("actions.saving", "common")
                  : t("keyValue.form.save", "admin")}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
