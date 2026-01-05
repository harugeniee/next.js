"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Plus, X } from "lucide-react";
import { useFieldArray, useForm } from "react-hook-form";
import { z } from "zod";

import { useI18n } from "@/components/providers/i18n-provider";
import { Button } from "@/components/ui/core/button";
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
import type { LinkCharactersDto } from "@/lib/types/staffs";
import { characterRoleSchema } from "@/lib/validators/staffs";

// Schema for the form (array of character roles)
const linkCharactersFormSchema = z.object({
  characters: z.array(characterRoleSchema).min(1, "At least one character is required"),
});

type LinkCharactersFormData = z.infer<typeof linkCharactersFormSchema>;

interface LinkCharactersFormProps {
  readonly onSubmit: (data: LinkCharactersDto) => Promise<void>;
  readonly isLoading?: boolean;
  readonly onCancel?: () => void;
}

/**
 * Link Characters Form Component
 * Form for linking multiple characters to a staff member
 */
export function LinkCharactersForm({
  onSubmit,
  isLoading,
  onCancel,
}: LinkCharactersFormProps) {
  const { t } = useI18n();

  const form = useForm<LinkCharactersFormData>({
    resolver: zodResolver(linkCharactersFormSchema),
    defaultValues: {
      characters: [{ characterId: "", notes: "", dubGroup: "" }],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "characters",
  });

  const handleSubmit = async (data: LinkCharactersFormData) => {
    try {
      await onSubmit(data);
      form.reset();
    } catch (error) {
      console.error("Form submission error:", error);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
        <div className="space-y-4">
          {fields.map((field, index) => (
            <div
              key={field.id}
              className="relative space-y-4 rounded-lg border p-4"
            >
              {/* Remove button */}
              {fields.length > 1 && (
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="absolute right-2 top-2"
                  onClick={() => remove(index)}
                >
                  <X className="h-4 w-4" />
                </Button>
              )}

              <h4 className="font-medium">
                {t("characterRole.character", "staff")} #{index + 1}
              </h4>

              {/* Character ID */}
              <FormField
                control={form.control}
                name={`characters.${index}.characterId`}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      {t("characterRole.character", "staff")} ID *
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Enter character ID"
                        {...field}
                      />
                    </FormControl>
                    <FormDescription>
                      The ID of the character to link
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Dub Group */}
              <FormField
                control={form.control}
                name={`characters.${index}.dubGroup`}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      {t("characterRole.dubGroup", "staff")}
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Japanese, English, Funimation, etc."
                        {...field}
                      />
                    </FormControl>
                    <FormDescription>
                      Language or dubbing company
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Notes */}
              <FormField
                control={form.control}
                name={`characters.${index}.notes`}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t("characterRole.notes", "staff")}</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Additional notes..."
                        className="resize-none"
                        rows={2}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          ))}
        </div>

        {/* Add Character Button */}
        <Button
          type="button"
          variant="outline"
          onClick={() =>
            append({ characterId: "", notes: "", dubGroup: "" })
          }
          className="w-full"
        >
          <Plus className="mr-2 h-4 w-4" />
          Add Another Character
        </Button>

        {/* Action Buttons */}
        <div className="flex justify-end gap-2">
          {onCancel && (
            <Button type="button" variant="outline" onClick={onCancel}>
              {t("common.cancel", "common")}
            </Button>
          )}
          <Button type="submit" disabled={isLoading}>
            {isLoading ? t("saving", "common") : t("actions.save", "common")}
          </Button>
        </div>
      </form>
    </Form>
  );
}

