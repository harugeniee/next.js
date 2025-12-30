"use client";

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
import type {
  BackendGenre,
  UpdateGenreDto,
} from "@/lib/interface/genres.interface";
import { createGenreSchema, updateGenreSchema } from "@/lib/validators/genres";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

interface GenreFormProps {
  genre?: BackendGenre;
  onSubmit: (data: UpdateGenreDto) => Promise<void>;
  isLoading: boolean;
  onCancel: () => void;
}

export function GenreForm({
  genre,
  onSubmit,
  isLoading,
  onCancel,
}: GenreFormProps) {
  const { t } = useI18n();
  const isEditing = !!genre;

  const formSchema = isEditing ? updateGenreSchema : createGenreSchema;

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: genre?.name || "",
      slug: genre?.slug || "",
      description: genre?.description || "",
      icon: genre?.icon || "",
      color: genre?.color || "",
      sortOrder: genre?.sortOrder || 0,
      isNsfw: genre?.isNsfw || false,
      metadata: genre?.metadata || {},
    },
  });

  async function handleSubmit(values: z.infer<typeof formSchema>) {
    await onSubmit(values);
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t("genres.form.name", "admin")}</FormLabel>
              <FormControl>
                <Input
                  placeholder={t("genres.form.namePlaceholder", "admin")}
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
              <FormLabel>{t("genres.form.slug", "admin")}</FormLabel>
              <FormControl>
                <Input
                  placeholder={t("genres.form.slugPlaceholder", "admin")}
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
              <FormLabel>{t("genres.form.description", "admin")}</FormLabel>
              <FormControl>
                <textarea
                  placeholder={t("genres.form.descriptionPlaceholder", "admin")}
                  className="flex min-h-[100px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 resize-none"
                  {...field}
                  value={field.value || ""}
                  rows={5}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="icon"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t("genres.form.icon", "admin")}</FormLabel>
                <FormControl>
                  <Input
                    placeholder={t("genres.form.iconPlaceholder", "admin")}
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="color"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t("genres.form.color", "admin")}</FormLabel>
                <FormControl>
                  <Input
                    placeholder={t("genres.form.colorPlaceholder", "admin")}
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="sortOrder"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t("genres.form.sortOrder", "admin")}</FormLabel>
              <FormControl>
                <Input
                  type="number"
                  placeholder={t("genres.form.sortOrderPlaceholder", "admin")}
                  {...field}
                  onChange={(e) =>
                    field.onChange(parseInt(e.target.value) || 0)
                  }
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="isNsfw"
          render={({ field }) => (
            <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
              <FormControl>
                <input
                  type="checkbox"
                  checked={field.value}
                  onChange={(e) => field.onChange(e.target.checked)}
                  className="h-4 w-4 rounded border-input text-primary focus:ring-ring disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer mt-1"
                />
              </FormControl>
              <div className="space-y-1 leading-none">
                <FormLabel>{t("genres.form.isNsfw", "admin")}</FormLabel>
                <FormDescription>
                  {t("genres.form.isNsfwDescription", "admin")}
                </FormDescription>
              </div>
            </FormItem>
          )}
        />

        <div className="flex justify-end gap-2 pt-4">
          <Button type="button" variant="outline" onClick={onCancel}>
            {t("genres.form.cancel", "admin")}
          </Button>
          <Button type="submit" disabled={isLoading}>
            {isLoading
              ? t("genres.form.saving", "admin")
              : t(
                  isEditing ? "genres.form.update" : "genres.form.create",
                  "admin",
                )}
          </Button>
        </div>
      </form>
    </Form>
  );
}
