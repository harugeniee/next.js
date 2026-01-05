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
import { Textarea } from "@/components/ui/textarea";
import type { Staff } from "@/lib/interface/staff.interface";
import {
  createStaffSchema,
  STAFF_CONSTANTS,
  updateStaffSchema,
  type CreateStaffFormData,
  type UpdateStaffFormData,
} from "@/lib/validators/staffs";

interface StaffFormProps {
  readonly staff?: Staff;
  readonly onSubmit: (
    data: CreateStaffFormData | UpdateStaffFormData,
  ) => Promise<void>;
  readonly onCancel: () => void;
  readonly isLoading?: boolean;
}

/**
 * Staff Form Component
 * Handles creating and editing staff members with comprehensive validation
 */
export function StaffForm({
  staff,
  onSubmit,
  onCancel,
  isLoading = false,
}: StaffFormProps) {
  const { t } = useI18n();
  const isEditMode = !!staff;

  type FormData = CreateStaffFormData | UpdateStaffFormData;
  const form = useForm<FormData>({
    resolver: zodResolver(
      isEditMode ? updateStaffSchema : createStaffSchema,
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    ) as any,
    defaultValues: {
      myAnimeListId: staff?.myAnimeListId ?? "",
      aniListId: staff?.aniListId ?? "",
      name: staff?.name
        ? {
            first: staff.name.first ?? "",
            middle: staff.name.middle ?? "",
            last: staff.name.last ?? "",
            full: staff.name.full ?? "",
            native: staff.name.native ?? "",
            alternative: staff.name.alternative ?? [],
            userPreferred: staff.name.userPreferred ?? "",
          }
        : {
            first: "",
            middle: "",
            last: "",
            full: "",
            native: "",
            alternative: [],
            userPreferred: "",
          },
      language: staff?.language ?? "",
      imageId: staff?.imageId ?? "",
      description: staff?.description ?? "",
      primaryOccupations: staff?.primaryOccupations ?? [],
      gender:
        (staff?.gender as
          | ""
          | "male"
          | "female"
          | "non_binary"
          | "other"
          | undefined) ?? "",
      dateOfBirth: (() => {
        if (!staff?.dateOfBirth) return undefined;
        if (typeof staff.dateOfBirth === "string") {
          // Extract just the date part (YYYY-MM-DD)
          return staff.dateOfBirth.split("T")[0];
        }
        return new Date(staff.dateOfBirth).toISOString().split("T")[0];
      })(),
      dateOfDeath: (() => {
        if (!staff?.dateOfDeath) return undefined;
        if (typeof staff.dateOfDeath === "string") {
          return staff.dateOfDeath.split("T")[0];
        }
        return new Date(staff.dateOfDeath).toISOString().split("T")[0];
      })(),
      age: staff?.age ?? undefined,
      debutDate: (() => {
        if (!staff?.debutDate) return undefined;
        if (typeof staff.debutDate === "string") {
          return staff.debutDate.split("T")[0];
        }
        return new Date(staff.debutDate).toISOString().split("T")[0];
      })(),
      homeTown: staff?.homeTown ?? "",
      bloodType:
        (staff?.bloodType as "A" | "B" | "AB" | "O" | undefined) ?? undefined,
      siteUrl: staff?.siteUrl ?? "",
      notes: staff?.notes ?? "",
      status:
        (staff?.status as
          | ""
          | "active"
          | "inactive"
          | "pending"
          | "archived"
          | undefined) ?? STAFF_CONSTANTS.STATUS.ACTIVE,
      metadata: staff?.metadata ?? undefined,
    },
  });

  // Update form when staff changes
  useEffect(() => {
    if (staff) {
      form.reset({
        myAnimeListId: staff.myAnimeListId ?? "",
        aniListId: staff.aniListId ?? "",
        name: staff.name
          ? {
              first: staff.name.first ?? "",
              middle: staff.name.middle ?? "",
              last: staff.name.last ?? "",
              full: staff.name.full ?? "",
              native: staff.name.native ?? "",
              alternative: staff.name.alternative ?? [],
              userPreferred: staff.name.userPreferred ?? "",
            }
          : {
              first: "",
              middle: "",
              last: "",
              full: "",
              native: "",
              alternative: [],
              userPreferred: "",
            },
        language: staff.language ?? "",
        imageId: staff.imageId ?? "",
        description: staff.description ?? "",
        primaryOccupations: staff.primaryOccupations ?? [],
        gender:
          (staff.gender as
            | ""
            | "male"
            | "female"
            | "non_binary"
            | "other"
            | undefined) ?? "",
        dateOfBirth: (() => {
          if (!staff.dateOfBirth) return undefined;
          if (typeof staff.dateOfBirth === "string") {
            return staff.dateOfBirth.split("T")[0];
          }
          return new Date(staff.dateOfBirth).toISOString().split("T")[0];
        })(),
        dateOfDeath: (() => {
          if (!staff.dateOfDeath) return undefined;
          if (typeof staff.dateOfDeath === "string") {
            return staff.dateOfDeath.split("T")[0];
          }
          return new Date(staff.dateOfDeath).toISOString().split("T")[0];
        })(),
        age: staff.age ?? undefined,
        debutDate: (() => {
          if (!staff.debutDate) return undefined;
          if (typeof staff.debutDate === "string") {
            return staff.debutDate.split("T")[0];
          }
          return new Date(staff.debutDate).toISOString().split("T")[0];
        })(),
        homeTown: staff.homeTown ?? "",
        bloodType:
          (staff.bloodType as "A" | "B" | "AB" | "O" | undefined) ?? undefined,
        siteUrl: staff.siteUrl ?? "",
        notes: staff.notes ?? "",
        status:
          (staff.status as
            | ""
            | "active"
            | "inactive"
            | "pending"
            | "archived"
            | undefined) ?? STAFF_CONSTANTS.STATUS.ACTIVE,
        metadata: staff.metadata ?? undefined,
      });
    }
  }, [staff, form]);

  const handleSubmit = async (data: FormData) => {
    try {
      await onSubmit(data);
    } catch (error) {
      // Error handled by mutation
      console.error("Form submission error:", error);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
        {/* External IDs */}
        <div className="grid gap-4 sm:grid-cols-2">
          <FormField
            control={form.control}
            name="myAnimeListId"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t("form.myAnimeListId", "staff")}</FormLabel>
                <FormControl>
                  <Input {...field} placeholder="12345" />
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
                <FormLabel>{t("form.aniListId", "staff")}</FormLabel>
                <FormControl>
                  <Input {...field} placeholder="67890" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        {/* Name Section */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">
            {t("form.nameSection", "staff")}
          </h3>

          <div className="grid gap-4 sm:grid-cols-2">
            <FormField
              control={form.control}
              name="name.first"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t("form.nameFirst", "staff")}</FormLabel>
                  <FormControl>
                    <Input {...field} />
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
                  <FormLabel>{t("form.nameLast", "staff")}</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <FormField
            control={form.control}
            name="name.full"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t("form.nameFull", "staff")}</FormLabel>
                <FormControl>
                  <Input {...field} />
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
                <FormLabel>{t("form.nameNative", "staff")}</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        {/* Basic Info */}
        <div className="grid gap-4 sm:grid-cols-2">
          <FormField
            control={form.control}
            name="language"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t("form.language", "staff")}</FormLabel>
                <Select value={field.value} onValueChange={field.onChange}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="Japanese">Japanese</SelectItem>
                    <SelectItem value="English">English</SelectItem>
                    <SelectItem value="Korean">Korean</SelectItem>
                    <SelectItem value="Chinese">Chinese</SelectItem>
                    <SelectItem value="French">French</SelectItem>
                    <SelectItem value="German">German</SelectItem>
                    <SelectItem value="Spanish">Spanish</SelectItem>
                    <SelectItem value="Italian">Italian</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="gender"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t("form.gender", "staff")}</FormLabel>
                <Select value={field.value} onValueChange={field.onChange}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {Object.entries(STAFF_CONSTANTS.GENDER).map(
                      ([key, value]) => (
                        <SelectItem key={value} value={value}>
                          {t(
                            `form.genderOptions.${key.toLowerCase()}`,
                            "staff",
                            {},
                            key,
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
        </div>

        {/* Description */}
        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t("form.description", "staff")}</FormLabel>
              <FormControl>
                <Textarea {...field} rows={4} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Dates */}
        <div className="grid gap-4 sm:grid-cols-3">
          <FormField
            control={form.control}
            name="dateOfBirth"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t("form.dateOfBirth", "staff")}</FormLabel>
                <FormControl>
                  <Input type="date" {...field} value={field.value ?? ""} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="dateOfDeath"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t("form.dateOfDeath", "staff")}</FormLabel>
                <FormControl>
                  <Input type="date" {...field} value={field.value ?? ""} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="debutDate"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t("form.debutDate", "staff")}</FormLabel>
                <FormControl>
                  <Input type="date" {...field} value={field.value ?? ""} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        {/* Additional Info */}
        <div className="grid gap-4 sm:grid-cols-2">
          <FormField
            control={form.control}
            name="homeTown"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t("form.homeTown", "staff")}</FormLabel>
                <FormControl>
                  <Input {...field} />
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
                <FormLabel>{t("form.bloodType", "staff")}</FormLabel>
                <Select
                  value={field.value ?? undefined}
                  onValueChange={field.onChange}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder={t("none", "common")} />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {Object.values(STAFF_CONSTANTS.BLOOD_TYPES).map((type) => (
                      <SelectItem key={type} value={type}>
                        {type}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        {/* URLs and Status */}
        <div className="grid gap-4 sm:grid-cols-2">
          <FormField
            control={form.control}
            name="siteUrl"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t("form.siteUrl", "staff")}</FormLabel>
                <FormControl>
                  <Input {...field} type="url" placeholder="https://..." />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="status"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t("form.status", "staff")}</FormLabel>
                <Select value={field.value} onValueChange={field.onChange}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {Object.entries(STAFF_CONSTANTS.STATUS).map(
                      ([key, value]) => (
                        <SelectItem key={value} value={value}>
                          {t(
                            `form.statusOptions.${key.toLowerCase()}`,
                            "staff",
                            {},
                            key,
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
        </div>

        {/* Notes */}
        <FormField
          control={form.control}
          name="notes"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t("form.notes", "staff")}</FormLabel>
              <FormControl>
                <Textarea {...field} rows={3} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Form Actions */}
        <div className="flex justify-end gap-2">
          <Button type="button" variant="outline" onClick={onCancel}>
            {t("actions.cancel", "common")}
          </Button>
          <Button type="submit" disabled={isLoading}>
            {isLoading
              ? t("actions.saving", "common")
              : isEditMode
                ? t("actions.save", "common")
                : t("actions.create", "common")}
          </Button>
        </div>
      </form>
    </Form>
  );
}
