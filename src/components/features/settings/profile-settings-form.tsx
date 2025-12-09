"use client";

import { zodResolver } from "@hookform/resolvers/zod";
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
 * Profile Settings Form Schema
 * Validates profile information input
 */
const profileSchema = z.object({
  name: z
    .string()
    .min(2, "Name must be at least 2 characters")
    .max(255, "Name is too long"),
  username: z
    .string()
    .min(3, "Username must be at least 3 characters")
    .max(50, "Username is too long"),
  bio: z.string().max(500, "Bio is too long").optional(),
  website: z
    .string()
    .url("Please enter a valid URL")
    .optional()
    .or(z.literal("")),
  location: z.string().max(100, "Location is too long").optional(),
  github: z
    .string()
    .url("Please enter a valid GitHub URL")
    .optional()
    .or(z.literal("")),
  twitter: z
    .string()
    .url("Please enter a valid Twitter URL")
    .optional()
    .or(z.literal("")),
  linkedin: z
    .string()
    .url("Please enter a valid LinkedIn URL")
    .optional()
    .or(z.literal("")),
});

type ProfileFormData = z.infer<typeof profileSchema>;

/**
 * Profile Settings Form Component
 * Handles user profile information editing with validation
 */
export function ProfileSettingsForm() {
  const { t } = useI18n();
  const { profile, updateProfile, isUpdating } = useProfileSettings();

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
              <CardTitle>{t("profileBasicInfo", "settings")}</CardTitle>
              <CardDescription>
                {t("profileBasicInfoDescription", "settings")}
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
                        <FormLabel>{t("profileName", "settings")}</FormLabel>
                        <FormControl>
                          <Input
                            placeholder={t(
                              "profileNamePlaceholder",
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
                          {t("profileUsername", "settings")}
                        </FormLabel>
                        <FormControl>
                          <Input
                            placeholder={t(
                              "profileUsernamePlaceholder",
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
                      <FormLabel>{t("profileBio", "settings")}</FormLabel>
                      <FormControl>
                        <textarea
                          className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                          placeholder={t("profileBioPlaceholder", "settings")}
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
                        <FormLabel>{t("profileWebsite", "settings")}</FormLabel>
                        <FormControl>
                          <Input
                            placeholder={t(
                              "profileWebsitePlaceholder",
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
                          {t("profileLocation", "settings")}
                        </FormLabel>
                        <FormControl>
                          <Input
                            placeholder={t(
                              "profileLocationPlaceholder",
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
                    ? t("profileUpdating", "settings")
                    : t("profileUpdate", "settings")}
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Social Links */}
          <Card>
            <CardHeader>
              <CardTitle>{t("profileSocialLinks", "settings")}</CardTitle>
              <CardDescription>
                {t("profileSocialLinksDescription", "settings")}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <FormField
                  control={form.control}
                  name="github"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t("profileGithub", "settings")}</FormLabel>
                      <FormControl>
                        <Input
                          placeholder={t(
                            "profileGithubPlaceholder",
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
                      <FormLabel>{t("profileTwitter", "settings")}</FormLabel>
                      <FormControl>
                        <Input
                          placeholder={t(
                            "profileTwitterPlaceholder",
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
                      <FormLabel>{t("profileLinkedin", "settings")}</FormLabel>
                      <FormControl>
                        <Input
                          placeholder={t(
                            "profileLinkedinPlaceholder",
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
