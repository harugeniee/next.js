"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useMemo } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { useI18n } from "@/components/providers/i18n-provider";
import { Button } from "@/components/ui/core/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/core/card";
import { Input } from "@/components/ui/core/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/layout/form";
import { useProfileSettings } from "@/hooks/settings";

/**
 * Build profile form schema with i18n validation messages
 */
function buildProfileSchema(t: (key: string, namespace: string) => string) {
  const ns = "settings";
  return z.object({
    name: z
      .string()
      .min(2, t("profile.validation.nameMin", ns))
      .max(255, t("profile.validation.nameMax", ns)),
    username: z
      .string()
      .min(3, t("profile.validation.usernameMin", ns))
      .max(50, t("profile.validation.usernameMax", ns)),
    bio: z.string().max(500, t("profile.validation.bioMax", ns)).optional(),
    website: z
      .string()
      .url(t("profile.validation.urlInvalid", ns))
      .optional()
      .or(z.literal("")),
    location: z
      .string()
      .max(100, t("profile.validation.locationMax", ns))
      .optional(),
    github: z
      .string()
      .url(t("profile.validation.githubUrlInvalid", ns))
      .optional()
      .or(z.literal("")),
    twitter: z
      .string()
      .url(t("profile.validation.twitterUrlInvalid", ns))
      .optional()
      .or(z.literal("")),
    linkedin: z
      .string()
      .url(t("profile.validation.linkedinUrlInvalid", ns))
      .optional()
      .or(z.literal("")),
  });
}

type ProfileFormData = z.infer<ReturnType<typeof buildProfileSchema>>;

/**
 * Profile Settings Form Component
 * Handles user profile information editing with validation
 */
export function ProfileSettingsForm() {
  const { t } = useI18n();
  const { profile, updateProfile, isUpdating } = useProfileSettings();
  const profileSchema = useMemo(() => buildProfileSchema(t), [t]);

  const form = useForm<ProfileFormData>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      name: profile?.name || "",
      username: profile?.username || "",
      bio: profile?.bio || "",
      website: profile?.website || "",
      location: profile?.location || "",
      github: profile?.socialLinks?.github || "",
      twitter: profile?.socialLinks?.twitter || "",
      linkedin: profile?.socialLinks?.linkedin || "",
    },
  });

  const onSubmit = (data: ProfileFormData) => {
    const { github, twitter, linkedin, ...profileData } = data;

    updateProfile({
      ...profileData,
      socialLinks: {
        github: github || undefined,
        twitter: twitter || undefined,
        linkedin: linkedin || undefined,
      },
    });
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <div className="space-y-6">
          {/* Basic Information */}
          <Card>
            <CardHeader>
              <CardTitle>{t("profile.basicInfo", "settings")}</CardTitle>
              <CardDescription>
                {t("profile.basicInfoDescription", "settings")}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid gap-4 sm:grid-cols-2">
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>{t("profile.name", "settings")}</FormLabel>
                        <FormControl>
                          <Input
                            placeholder={t(
                              "profile.namePlaceholder",
                              "settings",
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
                    name="username"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>
                          {t("profile.username", "settings")}
                        </FormLabel>
                        <FormControl>
                          <Input
                            placeholder={t(
                              "profile.usernamePlaceholder",
                              "settings",
                            )}
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
                  name="bio"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t("profile.bio", "settings")}</FormLabel>
                      <FormControl>
                        <textarea
                          className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                          placeholder={t("profile.bioPlaceholder", "settings")}
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="grid gap-4 sm:grid-cols-2">
                  <FormField
                    control={form.control}
                    name="website"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>
                          {t("profile.website", "settings")}
                        </FormLabel>
                        <FormControl>
                          <Input
                            placeholder={t(
                              "profile.websitePlaceholder",
                              "settings",
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
                    name="location"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>
                          {t("profile.location", "settings")}
                        </FormLabel>
                        <FormControl>
                          <Input
                            placeholder={t(
                              "profile.locationPlaceholder",
                              "settings",
                            )}
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <Button type="submit" disabled={isUpdating}>
                  {isUpdating
                    ? t("profile.updating", "settings")
                    : t("profile.update", "settings")}
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Social Links */}
          <Card>
            <CardHeader>
              <CardTitle>{t("profile.socialLinks", "settings")}</CardTitle>
              <CardDescription>
                {t("profile.socialLinksDescription", "settings")}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <FormField
                  control={form.control}
                  name="github"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t("profile.github", "settings")}</FormLabel>
                      <FormControl>
                        <Input
                          placeholder={t(
                            "profile.githubPlaceholder",
                            "settings",
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
                  name="twitter"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t("profile.twitter", "settings")}</FormLabel>
                      <FormControl>
                        <Input
                          placeholder={t(
                            "profile.twitterPlaceholder",
                            "settings",
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
                  name="linkedin"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t("profile.linkedin", "settings")}</FormLabel>
                      <FormControl>
                        <Input
                          placeholder={t(
                            "profile.linkedinPlaceholder",
                            "settings",
                          )}
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </CardContent>
          </Card>
        </div>
      </form>
    </Form>
  );
}
