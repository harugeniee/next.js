"use client";

import { useAtom } from "jotai";
import {
  BookOpen,
  Calendar,
  MapPin,
  MessageSquare,
  PenTool,
  Rss,
  UserPlus,
} from "lucide-react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useState } from "react";

import {
  Tabs,
  TabsContent,
  TabsContents,
  TabsList,
  TabsTrigger,
} from "@/components/animate-ui/components/radix/tabs";
import { UserSegmentsLayout } from "@/components/features/series/user-segments-layout";
import { useI18n } from "@/components/providers/i18n-provider";
import { useIsMounted } from "@/components/providers/no-ssr";
import { AnimatedSection, Skeletonize } from "@/components/shared";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
  Button,
  GitHubIcon,
  XIcon,
} from "@/components/ui";
import {
  useFollow,
  useFollowCounters,
  useFollowStatus,
  useUnfollow,
} from "@/hooks/follow";
import { useUserProfile } from "@/hooks/users/useUserQuery";
import { currentUserAtom } from "@/lib/auth";

/**
 * Internationalized Profile Page Component
 * Displays user profile information with tabs for different content types
 * Uses custom i18n hook for multi-language support with simple URL structure
 */
export default function ProfilePage() {
  const { t } = useI18n();
  const params = useParams();
  const userId = params.user_id as string;

  const [currentUser] = useAtom(currentUserAtom);
  const [activeTab, setActiveTab] = useState<
    "segments" | "scraps" | "comments"
  >("segments");
  const isMounted = useIsMounted();

  // Fetch user profile data with React Query
  const { data: profileData, isLoading, error } = useUserProfile(userId);

  // Fetch follow status and counters
  const currentUserId = currentUser?.id || "";
  const { data: followStatus } = useFollowStatus(currentUserId, userId);
  const { data: followCounters } = useFollowCounters(userId);

  // Follow/Unfollow mutations
  const followMutation = useFollow();
  const unfollowMutation = useUnfollow();

  // Prevent hydration mismatch
  if (!isMounted) {
    return <div className="min-h-screen bg-background" />;
  }

  // Show error if API call failed
  if (error) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center px-4">
        <div className="text-center max-w-md">
          <h1 className="text-xl sm:text-2xl font-bold text-foreground mb-2 sm:mb-4">
            {t("userErrorTitle", "user")}
          </h1>
          <p className="text-sm sm:text-base text-muted-foreground">
            {error instanceof Error
              ? error.message
              : "Failed to fetch user profile"}
          </p>
        </div>
      </div>
    );
  }

  // If no profile data, show loading
  if (!profileData && !isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center px-4">
        <div className="text-center max-w-md">
          <h1 className="text-xl sm:text-2xl font-bold text-foreground mb-2 sm:mb-4">
            {t("userNotFoundTitle", "user")}
          </h1>
          <p className="text-sm sm:text-base text-muted-foreground">
            {t("userNotFoundDescription", "user")}
          </p>
        </div>
      </div>
    );
  }

  const displayName =
    profileData?.name ||
    profileData?.username ||
    profileData?.email?.split("@")[0] ||
    "User";
  const initials = displayName.slice(0, 2).toUpperCase();
  const hasAvatar = profileData?.avatar?.url;
  const isOwnProfile = currentUser && currentUser.id === userId;
  const isFollowing = followStatus?.data?.isFollowing || false;
  const isLoadingFollow =
    followMutation.isPending || unfollowMutation.isPending;

  // Format join date
  const formatJoinDate = (dateString?: string) => {
    if (!dateString) return null;
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      month: "long",
      year: "numeric",
    });
  };

  // Handle follow/unfollow
  const handleFollowToggle = () => {
    if (isFollowing) {
      unfollowMutation.mutate(userId);
    } else {
      followMutation.mutate(userId);
    }
  };

  return (
    <div className="bg-background min-h-screen">
      {/* Profile Header Section */}
      <AnimatedSection
        loading={isLoading}
        data={profileData}
        className="w-full"
      >
        <div className="border-b border-border bg-card">
          <div className="container mx-auto px-3 sm:px-4 md:px-6 lg:px-8 py-4 sm:py-6 lg:py-8">
            <Skeletonize loading={isLoading}>
              <div className="flex flex-col sm:flex-row items-start gap-4 sm:gap-6">
                {/* Avatar */}
                <div className="flex-shrink-0 mx-auto sm:mx-0">
                  <Avatar className="h-20 w-20 sm:h-24 sm:w-24 md:h-28 md:w-28 ring-2 ring-primary/20">
                    {hasAvatar && (
                      <AvatarImage
                        src={profileData?.avatar?.url}
                        alt={`${displayName}'s avatar`}
                        className="object-cover"
                      />
                    )}
                    <AvatarFallback className="text-xl sm:text-2xl md:text-3xl font-semibold bg-gradient-to-br from-primary to-primary/60 dark:from-primary/80 dark:to-primary/40 text-primary-foreground">
                      {initials}
                    </AvatarFallback>
                  </Avatar>
                </div>

                {/* User Info */}
                <div className="flex-1 min-w-0 w-full sm:w-auto">
                  <div className="flex flex-col sm:flex-row sm:items-start gap-2 sm:gap-3 mb-3 sm:mb-4">
                    <div className="flex-1 min-w-0">
                      <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-foreground mb-1 sm:mb-2 break-words">
                        {displayName}
                      </h1>
                      {profileData?.username && (
                        <p className="text-xs sm:text-sm text-muted-foreground mb-2">
                          @{profileData.username}
                        </p>
                      )}
                    </div>
                    {/* Temporarily hidden Edit button */}
                    {false && isOwnProfile ? (
                      <div className="flex items-center gap-2">
                        <Link href={`/user/${userId}/settings`}>
                          <Button
                            variant="outline"
                            size="sm"
                            className="text-xs sm:text-sm h-8 sm:h-9"
                          >
                            {t("buttonEdit", "common")}
                          </Button>
                        </Link>
                      </div>
                    ) : (
                      currentUser && (
                        <Button
                          variant={isFollowing ? "outline" : "default"}
                          size="sm"
                          onClick={handleFollowToggle}
                          disabled={isLoadingFollow}
                          className="text-xs sm:text-sm h-8 sm:h-9 min-w-[80px] sm:min-w-[100px]"
                        >
                          {isLoadingFollow ? (
                            "..."
                          ) : isFollowing ? (
                            <>
                              <UserPlus className="h-3 w-3 sm:h-4 sm:w-4 mr-1" />
                              {t("userActionsUnfollow", "user") || "Unfollow"}
                            </>
                          ) : (
                            <>
                              <UserPlus className="h-3 w-3 sm:h-4 sm:w-4 mr-1" />
                              {t("userActionsFollow", "user")}
                            </>
                          )}
                        </Button>
                      )
                    )}
                  </div>

                  {/* Bio */}
                  {profileData?.bio && (
                    <p className="text-sm sm:text-base text-muted-foreground mb-3 sm:mb-4 leading-relaxed break-words">
                      {profileData.bio}
                    </p>
                  )}

                  {/* Location and Join Date */}
                  <div className="flex flex-wrap items-center gap-3 sm:gap-4 mb-3 sm:mb-4 text-xs sm:text-sm text-muted-foreground">
                    {profileData?.location && (
                      <span className="flex items-center gap-1.5">
                        <MapPin className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                        {profileData.location}
                      </span>
                    )}
                    {profileData?.createdAt && (
                      <span className="flex items-center gap-1.5">
                        <Calendar className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                        {t("userJoined", "user")}{" "}
                        {formatJoinDate(profileData.createdAt)}
                      </span>
                    )}
                  </div>

                  {/* Stats */}
                  <div className="flex flex-wrap items-center gap-4 sm:gap-6 mb-3 sm:mb-4">
                    <Link
                      href={`/user/${userId}?tab=segments`}
                      className="flex items-center gap-1.5 sm:gap-2 hover:text-primary transition-colors"
                    >
                      <span className="text-base sm:text-lg font-semibold text-foreground">
                        {profileData?._count?.segments || 0}
                      </span>
                      <span className="text-xs sm:text-sm text-muted-foreground">
                        {t("userStatsSegments", "user")}
                      </span>
                    </Link>
                    <Link
                      href={`/user/${userId}?tab=followers`}
                      className="flex items-center gap-1.5 sm:gap-2 hover:text-primary transition-colors"
                    >
                      <span className="text-base sm:text-lg font-semibold text-foreground">
                        {followCounters?.data?.followers ||
                          profileData?._count?.followers ||
                          0}
                      </span>
                      <span className="text-xs sm:text-sm text-muted-foreground">
                        {t("userStatsFollowers", "user")}
                      </span>
                    </Link>
                    <Link
                      href={`/user/${userId}?tab=following`}
                      className="flex items-center gap-1.5 sm:gap-2 hover:text-primary transition-colors"
                    >
                      <span className="text-base sm:text-lg font-semibold text-foreground">
                        {followCounters?.data?.following ||
                          profileData?._count?.following ||
                          0}
                      </span>
                      <span className="text-xs sm:text-sm text-muted-foreground">
                        {t("userStatsFollowing", "user")}
                      </span>
                    </Link>
                  </div>

                  {/* Social Links */}
                  {profileData?.website && (
                    <div className="flex flex-wrap items-center gap-2 sm:gap-3">
                      {profileData.website && (
                        <a
                          href={profileData.website}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-xs sm:text-sm text-primary hover:underline"
                        >
                          {profileData.website.replace(/^https?:\/\//, "")}
                        </a>
                      )}
                      <div className="flex items-center gap-1 sm:gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-7 w-7 sm:h-8 sm:w-8 p-0 hover:bg-accent hover:text-accent-foreground transition-colors"
                          aria-label="GitHub"
                        >
                          <GitHubIcon className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-7 w-7 sm:h-8 sm:w-8 p-0 hover:bg-accent hover:text-accent-foreground transition-colors"
                          aria-label="X (Twitter)"
                        >
                          <XIcon className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-7 w-7 sm:h-8 sm:w-8 p-0 hover:bg-accent hover:text-accent-foreground transition-colors"
                          aria-label="RSS"
                        >
                          <Rss className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                        </Button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </Skeletonize>
          </div>
        </div>
      </AnimatedSection>

      {/* Tabs Component - Navigation and Content */}
      <Tabs
        value={activeTab}
        onValueChange={(value) =>
          setActiveTab(value as "segments" | "scraps" | "comments")
        }
        className="w-full"
      >
        {/* Content Navigation Tabs */}
        <div className="border-b border-border bg-background sticky top-0 z-10 backdrop-blur-sm bg-background/95">
          <div className="container mx-auto px-3 sm:px-4 md:px-6 lg:px-8">
            <TabsList className="w-full sm:w-auto justify-start bg-transparent p-0 h-auto gap-2 sm:gap-4 md:gap-8">
              <TabsTrigger
                value="segments"
                className="py-3 sm:py-4 px-2 sm:px-4 border-b-2 border-transparent data-[state=active]:border-primary rounded-none bg-transparent hover:bg-transparent"
              >
                <BookOpen className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                <span>{t("tabsSegments", "profile")}</span>
                {profileData?._count?.segments !== undefined && (
                  <span className="text-[10px] sm:text-xs bg-muted px-1.5 py-0.5 rounded-full">
                    {profileData._count.segments}
                  </span>
                )}
              </TabsTrigger>
              <TabsTrigger
                value="scraps"
                className="py-3 sm:py-4 px-2 sm:px-4 border-b-2 border-transparent data-[state=active]:border-primary rounded-none bg-transparent hover:bg-transparent"
              >
                <PenTool className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                <span>{t("tabsScraps", "profile")}</span>
                <span className="text-[10px] sm:text-xs bg-muted px-1.5 py-0.5 rounded-full">
                  0
                </span>
              </TabsTrigger>
              <TabsTrigger
                value="comments"
                className="py-3 sm:py-4 px-2 sm:px-4 border-b-2 border-transparent data-[state=active]:border-primary rounded-none bg-transparent hover:bg-transparent"
              >
                <MessageSquare className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                <span>{t("tabsComments", "profile")}</span>
              </TabsTrigger>
            </TabsList>
          </div>
        </div>

        {/* Content Area */}
        <div className="container mx-auto px-3 sm:px-4 md:px-6 lg:px-8 py-4 sm:py-6 lg:py-8">
          <TabsContents>
            <TabsContent value="segments">
              <AnimatedSection loading={isLoading} data={profileData}>
                <UserSegmentsLayout
                  userId={userId}
                  initialLayout="grid"
                  className="mt-4 sm:mt-6"
                />
              </AnimatedSection>
            </TabsContent>
            <TabsContent value="scraps">
              <AnimatedSection loading={isLoading} data={profileData}>
                <Skeletonize loading={isLoading}>
                  <div className="text-center py-8 sm:py-12">
                    <PenTool className="h-12 w-12 sm:h-16 sm:w-16 text-muted-foreground mx-auto mb-3 sm:mb-4" />
                    <h3 className="text-base sm:text-lg font-medium text-foreground mb-2">
                      {t("contentNoScraps", "profile")}
                    </h3>
                    <p className="text-sm sm:text-base text-muted-foreground max-w-md mx-auto">
                      {t("contentNoScrapsDescription", "profile")}
                    </p>
                  </div>
                </Skeletonize>
              </AnimatedSection>
            </TabsContent>
            <TabsContent value="comments">
              <AnimatedSection loading={isLoading} data={profileData}>
                <Skeletonize loading={isLoading}>
                  <div className="text-center py-8 sm:py-12">
                    <MessageSquare className="h-12 w-12 sm:h-16 sm:w-16 text-muted-foreground mx-auto mb-3 sm:mb-4" />
                    <h3 className="text-base sm:text-lg font-medium text-foreground mb-2">
                      {t("contentNoComments", "profile")}
                    </h3>
                    <p className="text-sm sm:text-base text-muted-foreground max-w-md mx-auto">
                      {t("contentNoCommentsDescription", "profile")}
                    </p>
                  </div>
                </Skeletonize>
              </AnimatedSection>
            </TabsContent>
          </TabsContents>
        </div>
      </Tabs>
    </div>
  );
}
