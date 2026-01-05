"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

import { useI18n } from "@/components/providers/i18n-provider";
import { Button } from "@/components/ui/core/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/core/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/layout/form";
import type { CharacterStaff } from "@/lib/interface/staff.interface";
import {
  UpdateCharacterRoleSchema,
  type UpdateCharacterRoleFormData,
} from "@/lib/validators/staffs";

interface CharacterRoleFormProps {
  readonly characterRole: CharacterStaff;
  readonly onSubmit: (data: UpdateCharacterRoleFormData) => Promise<void>;
  readonly isLoading?: boolean;
}

/**
 * Character Role Form Component
 * Form for editing a character role (language, isPrimary, sortOrder, notes)
 */
export function CharacterRoleForm({
  characterRole,
  onSubmit,
  isLoading,
}: CharacterRoleFormProps) {
  const { t } = useI18n();

  const form = useForm<UpdateCharacterRoleFormData>({
    resolver: zodResolver(UpdateCharacterRoleSchema),
    defaultValues: {
      language: characterRole.language || "",
      isPrimary: characterRole.isPrimary || false,
      sortOrder: characterRole.sortOrder || 0,
      notes: characterRole.notes || "",
    },
  });

  const handleSubmit = async (data: UpdateCharacterRoleFormData) => {
    try {
      await onSubmit(data);
      form.reset();
    } catch (error) {
      // Error handled by parent
      console.error("Form submission error:", error);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
        {/* Language */}
        <FormField
          control={form.control}
          name="language"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t("characterRole.language", "staff")}</FormLabel>
              <FormControl>
                <Input
                  placeholder="Japanese, English, Korean, etc."
                  {...field}
                  value={field.value || ""}
                />
              </FormControl>
              <FormDescription>
                Language of the voice acting (e.g., Japanese, English)
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Is Primary */}
        <FormField
          control={form.control}
          name="isPrimary"
          render={({ field }) => (
            <FormItem className="flex flex-row items-start space-x-3 space-y-0">
              <FormControl>
                <Checkbox
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
              </FormControl>
              <div className="space-y-1 leading-none">
                <FormLabel>{t("characterRole.isPrimary", "staff")}</FormLabel>
                <FormDescription>
                  Mark this as the primary/main voice actor for this character
                </FormDescription>
              </div>
            </FormItem>
          )}
        />

        {/* Sort Order */}
        <FormField
          control={form.control}
          name="sortOrder"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t("characterRole.sortOrder", "staff")}</FormLabel>
              <FormControl>
                <Input
                  type="number"
                  min="0"
                  {...field}
                  value={field.value || 0}
                  onChange={(e) => field.onChange(parseInt(e.target.value, 10))}
                />
              </FormControl>
              <FormDescription>
                Lower values appear first in the list (0 = first)
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Notes */}
        <FormField
          control={form.control}
          name="notes"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t("characterRole.notes", "staff")}</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Additional notes about this role..."
                  className="resize-none"
                  rows={3}
                  {...field}
                  value={field.value || ""}
                />
              </FormControl>
              <FormDescription>
                Optional notes about the voice actor's role
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Submit Button */}
        <div className="flex justify-end gap-2">
          <Button type="submit" disabled={isLoading}>
            {isLoading ? t("saving", "common") : t("actions.save", "common")}
          </Button>
        </div>
      </form>
    </Form>
  );
}

