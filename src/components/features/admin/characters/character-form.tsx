"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect } from "react";
import { useForm } from "react-hook-form";

import { useI18n } from "@/components/providers/i18n-provider";
import { Button } from "@/components/ui/core/button";
import { Input } from "@/components/ui/core/input";
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
import type { Character } from "@/lib/interface/character.interface";
import {
  createCharacterSchema,
  updateCharacterSchema,
  type CreateCharacterFormData,
  type UpdateCharacterFormData,
} from "@/lib/validators/characters";

interface CharacterFormProps {
  readonly character?: Character;
  readonly onSubmit: (
    data: CreateCharacterFormData | UpdateCharacterFormData,
  ) => Promise<void>;
  readonly onCancel: () => void;
  readonly isLoading?: boolean;
}

/**
 * Character Form Component
 * Handles creating and editing characters with comprehensive validation
 */
export function CharacterForm({
  character,
  onSubmit,
  onCancel,
  isLoading = false,
}: CharacterFormProps) {
  const { t } = useI18n();
  const isEditMode = !!character;

  type FormData = CreateCharacterFormData | UpdateCharacterFormData;
  const form = useForm<FormData>({
    resolver: zodResolver(
      isEditMode ? updateCharacterSchema : createCharacterSchema,
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    ) as any,
    defaultValues: {
      myAnimeListId: character?.myAnimeListId ?? "",
      aniListId: character?.aniListId ?? "",
      name: character?.name
        ? {
            first: character.name.first ?? "",
            middle: character.name.middle ?? "",
            last: character.name.last ?? "",
            full: character.name.full ?? "",
            native: character.name.native ?? "",
            alternative: character.name.alternative ?? [],
            alternativeSpoiler: character.name.alternativeSpoiler ?? [],
            userPreferred: character.name.userPreferred ?? "",
          }
        : {
            first: "",
            middle: "",
            last: "",
            full: "",
            native: "",
            alternative: [],
            alternativeSpoiler: [],
            userPreferred: "",
          },
      imageId: character?.imageId ?? "",
      description: character?.description ?? "",
      gender: character?.gender ? character.gender.toLowerCase() : "",
      dateOfBirth: (() => {
        if (!character?.dateOfBirth) return undefined;
        if (typeof character.dateOfBirth === "string") {
          return character.dateOfBirth;
        }
        return new Date(character.dateOfBirth).toISOString();
      })(),
      age: character?.age ?? "",
      bloodType: character?.bloodType ?? "",
      siteUrl: character?.siteUrl ?? "",
      notes: character?.notes ?? "",
      metadata: character?.metadata ?? null,
      seriesId: character?.seriesId ?? "",
    },
  });

  // Update form when character changes
  useEffect(() => {
    if (character) {
      form.reset({
        myAnimeListId: character.myAnimeListId ?? "",
        aniListId: character.aniListId ?? "",
        name: character.name
          ? {
              first: character.name.first ?? "",
              middle: character.name.middle ?? "",
              last: character.name.last ?? "",
              full: character.name.full ?? "",
              native: character.name.native ?? "",
              alternative: character.name.alternative ?? [],
              alternativeSpoiler: character.name.alternativeSpoiler ?? [],
              userPreferred: character.name.userPreferred ?? "",
            }
          : {
              first: "",
              middle: "",
              last: "",
              full: "",
              native: "",
              alternative: [],
              alternativeSpoiler: [],
              userPreferred: "",
            },
        imageId: character.imageId ?? "",
        description: character.description ?? "",
        gender: character.gender ? character.gender.toLowerCase() : "",
        dateOfBirth: (() => {
          if (!character.dateOfBirth) return undefined;
          if (typeof character.dateOfBirth === "string") {
            return character.dateOfBirth;
          }
          return new Date(character.dateOfBirth).toISOString();
        })(),
        age: character.age ?? "",
        bloodType: character.bloodType ?? "",
        siteUrl: character.siteUrl ?? "",
        notes: character.notes ?? "",
        metadata: character.metadata ?? null,
        seriesId: character.seriesId ?? "",
      });
    }
  }, [character, form]);

  const handleSubmit = async (data: UpdateCharacterFormData) => {
    // Clean up empty strings to undefined
    // Also clean up name object fields (convert empty strings to undefined)
    let cleanedName: UpdateCharacterFormData["name"] = undefined;
    if (data.name) {
      cleanedName = {
        first:
          data.name.first === "" || data.name.first === null
            ? undefined
            : data.name.first,
        middle:
          data.name.middle === "" || data.name.middle === null
            ? undefined
            : data.name.middle,
        last:
          data.name.last === "" || data.name.last === null
            ? undefined
            : data.name.last,
        full:
          data.name.full === "" || data.name.full === null
            ? undefined
            : data.name.full,
        native:
          data.name.native === "" || data.name.native === null
            ? undefined
            : data.name.native,
        userPreferred:
          data.name.userPreferred === "" || data.name.userPreferred === null
            ? undefined
            : data.name.userPreferred,
        alternative: data.name.alternative,
        alternativeSpoiler: data.name.alternativeSpoiler,
      };
    }

    // Remove name object if all fields are undefined
    const hasNameFields =
      cleanedName &&
      Object.values(cleanedName).some(
        (v) => v !== undefined && v !== null && v !== "",
      );

    const cleanedData: UpdateCharacterFormData = {
      ...data,
      myAnimeListId: data.myAnimeListId || undefined,
      aniListId: data.aniListId || undefined,
      name: hasNameFields ? cleanedName : undefined,
      imageId: data.imageId || undefined,
      description: data.description || undefined,
      gender: data.gender || undefined,
      dateOfBirth: data.dateOfBirth || undefined,
      age: data.age || undefined,
      bloodType: data.bloodType || undefined,
      siteUrl: data.siteUrl || undefined,
      notes: data.notes || undefined,
      metadata: data.metadata || undefined,
      seriesId: data.seriesId || undefined,
    };
    await onSubmit(cleanedData);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
        {/* Basic Information */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">
            {t("form.basicInfo", "characters")}
          </h3>

          <div className="grid gap-4 sm:grid-cols-2">
            <FormField
              control={form.control}
              name="name.first"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t("fields.nameFirst", "characters")}</FormLabel>
                  <FormControl>
                    <Input
                      placeholder={t("form.nameFirstPlaceholder", "characters")}
                      {...field}
                      value={field.value || ""}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="name.middle"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t("fields.nameMiddle", "characters")}</FormLabel>
                  <FormControl>
                    <Input
                      placeholder={t(
                        "form.nameMiddlePlaceholder",
                        "characters",
                      )}
                      {...field}
                      value={field.value || ""}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="name.last"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t("fields.nameLast", "characters")}</FormLabel>
                  <FormControl>
                    <Input
                      placeholder={t("form.nameLastPlaceholder", "characters")}
                      {...field}
                      value={field.value || ""}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="name.full"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t("fields.nameFull", "characters")}</FormLabel>
                  <FormControl>
                    <Input
                      placeholder={t("form.nameFullPlaceholder", "characters")}
                      {...field}
                      value={field.value || ""}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="name.native"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t("fields.nameNative", "characters")}</FormLabel>
                  <FormControl>
                    <Input
                      placeholder={t(
                        "form.nameNativePlaceholder",
                        "characters",
                      )}
                      {...field}
                      value={field.value || ""}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="name.userPreferred"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    {t("fields.nameUserPreferred", "characters")}
                  </FormLabel>
                  <FormControl>
                    <Input
                      placeholder={t(
                        "form.nameUserPreferredPlaceholder",
                        "characters",
                      )}
                      {...field}
                      value={field.value || ""}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>

        {/* Character Details */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">
            {t("form.characterDetails", "characters")}
          </h3>

          <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t("fields.description", "characters")}</FormLabel>
                <FormControl>
                  <textarea
                    placeholder={t("form.descriptionPlaceholder", "characters")}
                    className="flex min-h-[100px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 resize-none"
                    {...field}
                    value={field.value || ""}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="grid gap-4 sm:grid-cols-2">
            <FormField
              control={form.control}
              name="gender"
              render={({ field }) => {
                // Normalize gender value to lowercase to match Select options
                const normalizedValue = field.value
                  ? field.value.toLowerCase()
                  : "";
                return (
                  <FormItem>
                    <FormLabel>{t("fields.gender", "characters")}</FormLabel>
                    <Select
                      onValueChange={(value) => {
                        // Convert "none" back to empty string for form state
                        field.onChange(value === "none" ? "" : value);
                      }}
                      value={normalizedValue || "none"}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue
                            placeholder={t("form.selectGender", "characters")}
                          />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="none">
                          {t("form.none", "characters")}
                        </SelectItem>
                        <SelectItem value="male">
                          {t("genders.male", "characters")}
                        </SelectItem>
                        <SelectItem value="female">
                          {t("genders.female", "characters")}
                        </SelectItem>
                        <SelectItem value="other">
                          {t("genders.other", "characters")}
                        </SelectItem>
                        <SelectItem value="unknown">
                          {t("genders.unknown", "characters")}
                        </SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                );
              }}
            />

            <FormField
              control={form.control}
              name="dateOfBirth"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t("fields.dateOfBirth", "characters")}</FormLabel>
                  <FormControl>
                    <Input
                      type="date"
                      value={
                        field.value
                          ? new Date(field.value).toISOString().split("T")[0]
                          : ""
                      }
                      onChange={(e) => {
                        const value = e.target.value;
                        field.onChange(
                          value ? new Date(value).toISOString() : "",
                        );
                      }}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="age"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t("fields.age", "characters")}</FormLabel>
                  <FormControl>
                    <Input
                      placeholder={t("form.agePlaceholder", "characters")}
                      {...field}
                      value={field.value || ""}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="bloodType"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t("fields.bloodType", "characters")}</FormLabel>
                  <FormControl>
                    <Input
                      placeholder={t("form.bloodTypePlaceholder", "characters")}
                      {...field}
                      value={field.value || ""}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>

        {/* External IDs and Links */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">
            {t("form.externalInfo", "characters")}
          </h3>

          <div className="grid gap-4 sm:grid-cols-2">
            <FormField
              control={form.control}
              name="myAnimeListId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    {t("fields.myAnimeListId", "characters")}
                  </FormLabel>
                  <FormControl>
                    <Input
                      placeholder={t(
                        "form.myAnimeListIdPlaceholder",
                        "characters",
                      )}
                      {...field}
                      value={field.value || ""}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="aniListId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t("fields.aniListId", "characters")}</FormLabel>
                  <FormControl>
                    <Input
                      placeholder={t("form.aniListIdPlaceholder", "characters")}
                      {...field}
                      value={field.value || ""}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="imageId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t("fields.imageId", "characters")}</FormLabel>
                  <FormControl>
                    <Input
                      placeholder={t("form.imageIdPlaceholder", "characters")}
                      {...field}
                      value={field.value || ""}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="seriesId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t("fields.seriesId", "characters")}</FormLabel>
                  <FormControl>
                    <Input
                      placeholder={t("form.seriesIdPlaceholder", "characters")}
                      {...field}
                      value={field.value || ""}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="siteUrl"
              render={({ field }) => (
                <FormItem className="sm:col-span-2">
                  <FormLabel>{t("fields.siteUrl", "characters")}</FormLabel>
                  <FormControl>
                    <Input
                      type="url"
                      placeholder={t("form.siteUrlPlaceholder", "characters")}
                      {...field}
                      value={field.value || ""}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>

        {/* Additional Information */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">
            {t("form.additionalInfo", "characters")}
          </h3>

          <FormField
            control={form.control}
            name="notes"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t("fields.notes", "characters")}</FormLabel>
                <FormControl>
                  <textarea
                    placeholder={t("form.notesPlaceholder", "characters")}
                    className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 resize-none"
                    {...field}
                    value={field.value || ""}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        {/* Form Actions */}
        <div className="flex justify-end gap-2">
          <Button
            type="button"
            variant="outline"
            onClick={onCancel}
            disabled={isLoading}
          >
            {t("form.cancel", "characters")}
          </Button>
          <Button type="submit" disabled={isLoading}>
            {(() => {
              if (isLoading) return t("form.saving", "characters");
              if (isEditMode) return t("form.update", "characters");
              return t("form.create", "characters");
            })()}
          </Button>
        </div>
      </form>
    </Form>
  );
}
