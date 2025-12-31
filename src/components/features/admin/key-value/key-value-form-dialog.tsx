"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
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
  createKeyValueSchema,
  updateKeyValueSchema,
  type CreateKeyValueFormData,
  type UpdateKeyValueFormData,
} from "@/lib/validators/key-value.validator";
import type {
  CreateKeyValueDto,
  UpdateKeyValueDto,
  KeyValue,
  ContentType,
} from "@/lib/interface/key-value.interface";

const CONTENT_TYPES = [
  "string",
  "number",
  "boolean",
  "object",
  "array",
] as const;

interface KeyValueFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  keyValue?: KeyValue;
  onSubmit: (data: CreateKeyValueDto | UpdateKeyValueDto) => Promise<void>;
  isLoading?: boolean;
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

  const handleSubmit = async (
    data: CreateKeyValueFormData | UpdateKeyValueFormData,
  ) => {
    try {
      // Parse JSON values
      let parsedValue: unknown;
      try {
        parsedValue = JSON.parse(data.value as string);
      } catch {
        // If parsing fails, try to parse as a primitive
        const trimmed = (data.value as string).trim();
        if (trimmed === "true") parsedValue = true;
        else if (trimmed === "false") parsedValue = false;
        else if (trimmed === "null") parsedValue = null;
        else if (!isNaN(Number(trimmed)) && trimmed !== "") {
          parsedValue = Number(trimmed);
        } else {
          parsedValue = data.value; // Use as string
        }
      }

      let parsedMetadata: Record<string, unknown> | undefined;
      if (data.metadata && (data.metadata as string).trim()) {
        try {
          parsedMetadata = JSON.parse(data.metadata as string);
        } catch {
          throw new Error("Invalid JSON in metadata field");
        }
      }

      const submitData: CreateKeyValueDto | UpdateKeyValueDto = isEditMode
        ? {
            value: parsedValue,
            expiresAt:
              data.expiresAt && (data.expiresAt as string).trim()
                ? (data.expiresAt as string)
                : undefined,
            metadata: parsedMetadata,
            contentType:
              data.contentType && (data.contentType as string).trim()
                ? (data.contentType as string as ContentType)
                : undefined,
          }
        : {
            key: (data as CreateKeyValueFormData).key,
            value: parsedValue,
            namespace:
              (data as CreateKeyValueFormData).namespace?.trim() || undefined,
            expiresAt:
              data.expiresAt && (data.expiresAt as string).trim()
                ? (data.expiresAt as string)
                : undefined,
            metadata: parsedMetadata,
            contentType:
              data.contentType && (data.contentType as string).trim()
                ? (data.contentType as string as ContentType)
                : undefined,
          };

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
