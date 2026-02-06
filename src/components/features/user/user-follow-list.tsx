"use client";

import { useAtom } from "jotai";
import { Search, UserCheck, UserPlus, Users } from "lucide-react";
import Link from "next/link";
import { useCallback, useState } from "react";

import { useI18n } from "@/components/providers/i18n-provider";
import { Skeletonize } from "@/components/shared";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
  Button,
  Card,
  CardContent,
  Input,
} from "@/components/ui";
import {
  useFollow,
  useFollowers,
  useFollowing,
  useUnfollow,
} from "@/hooks/follow";
import { currentUserAtom } from "@/lib/auth";
import type { FollowUser } from "@/lib/api/follow";
import { cn } from "@/lib/utils";

interface UserFollowListProps {
  readonly userId: string;
  readonly type: "followers" | "following";
}

/**
 * User Follow List Component
 * Displays followers or following list with search and follow/unfollow actions
 */
export function UserFollowList({ userId, type }: UserFollowListProps) {
  const { t } = useI18n();
  const [currentUser] = useAtom(currentUserAtom);
  const [searchQuery, setSearchQuery] = useState("");

  // Call both hooks unconditionally (React rules of hooks), then pick result by type
  const followersQuery = useFollowers(userId, { query: searchQuery });
  const followingQuery = useFollowing(userId, { query: searchQuery });
  const { data, isLoading, error } =
    type === "followers" ? followersQuery : followingQuery;

  // Follow/Unfollow mutations
  const followMutation = useFollow();
  const unfollowMutation = useUnfollow();

  // Extract users from API response (data is ApiResponse<FollowingListDto | FollowersListDto>)
  const users: FollowUser[] = data?.data?.users ?? [];

  // Handle search with debounce
  const handleSearchChange = useCallback(
    (value: string) => {
      setSearchQuery(value);
    },
    [setSearchQuery],
  );

  // Handle follow/unfollow
  const handleFollowToggle = (targetUserId: string, isFollowing: boolean) => {
    if (isFollowing) {
      unfollowMutation.mutate(targetUserId);
    } else {
      followMutation.mutate(targetUserId);
    }
  };

  const title =
    type === "followers"
      ? t("followersTitle", "user")
      : t("followingTitle", "user");
  const emptyMessage =
    type === "followers" ? t("noFollowers", "user") : t("noFollowing", "user");

  if (error) {
    return (
      <div className="text-center py-8">
        <p className="text-muted-foreground mb-4">
          {t("error.loadingUsers", "user") || "Failed to load users"}
        </p>
        <Button onClick={() => window.location.reload()} variant="outline">
          {t("actions.retry", "common") || "Retry"}
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="space-y-4">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-primary/10 rounded-lg">
            <Users className="h-5 w-5 text-primary" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-foreground">{title}</h1>
            <p className="text-sm text-muted-foreground">
              {users.length} {users.length === 1 ? "user" : "users"}
            </p>
          </div>
        </div>

        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder={t("searchUsers", "user") || "Search users..."}
            value={searchQuery}
            onChange={(e) => handleSearchChange(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      {/* User List */}
      <div className="space-y-4">
        <Skeletonize loading={isLoading}>
          {users.length === 0 ? (
            <Card className="border-dashed">
              <CardContent className="flex flex-col items-center justify-center py-12">
                <div className="p-4 bg-muted/50 rounded-full mb-4">
                  <Users className="h-8 w-8 text-muted-foreground" />
                </div>
                <h3 className="text-lg font-semibold text-foreground mb-2">
                  {emptyMessage}
                </h3>
                <p className="text-muted-foreground text-center max-w-sm">
                  {type === "followers"
                    ? "When people follow this user, they will appear here."
                    : "When this user follows people, they will appear here."}
                </p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
              {users.map((user: FollowUser) => {
                const displayName =
                  user.name ?? user.username ?? "Unknown User";
                const initials = displayName.slice(0, 2).toUpperCase();
                const isCurrentUser = currentUser?.id === user.userId;
                const isSelf = user.userId === userId;

                return (
                  <Card
                    key={user.userId}
                    className="group hover:shadow-md transition-all duration-200"
                  >
                    <CardContent className="p-4">
                      <div className="flex items-start gap-3">
                        {/* Avatar */}
                        <Link href={`/user/${user.userId}`}>
                          <Avatar className="h-12 w-12 ring-2 ring-primary/10 hover:ring-primary/30 transition-all cursor-pointer">
                            {user.avatarUrl && (
                              <AvatarImage
                                src={user.avatarUrl}
                                alt={`${displayName}'s avatar`}
                              />
                            )}
                            <AvatarFallback className="text-sm font-semibold bg-gradient-to-br from-primary/80 to-primary/40">
                              {initials}
                            </AvatarFallback>
                          </Avatar>
                        </Link>

                        {/* User Info */}
                        <div className="flex-1 min-w-0">
                          <Link href={`/user/${user.userId}`}>
                            <h3 className="font-semibold text-foreground hover:text-primary transition-colors cursor-pointer truncate">
                              {displayName}
                            </h3>
                          </Link>
                          {user.username && (
                            <p className="text-sm text-muted-foreground truncate">
                              @{user.username}
                            </p>
                          )}
                          {user.mutualCount && user.mutualCount > 0 && (
                            <p className="text-xs text-muted-foreground mt-1">
                              {user.mutualCount}{" "}
                              {t("mutualFriends", "user") || "mutual friends"}
                            </p>
                          )}
                        </div>

                        {/* Follow Button */}
                        {!isCurrentUser && !isSelf && currentUser && (
                          <Button
                            size="sm"
                            variant={user.isFollowing ? "outline" : "default"}
                            onClick={() =>
                              handleFollowToggle(
                                user.userId,
                                user.isFollowing || false,
                              )
                            }
                            disabled={
                              followMutation.isPending ||
                              unfollowMutation.isPending
                            }
                            className={cn(
                              "h-8 min-w-[80px] text-xs",
                              user.isFollowing && "hover:bg-destructive/10",
                            )}
                          >
                            {user.isFollowing ? (
                              <>
                                <UserCheck className="h-3 w-3 mr-1" />
                                {t("userActionsUnfollow", "user") ||
                                  "Following"}
                              </>
                            ) : (
                              <>
                                <UserPlus className="h-3 w-3 mr-1" />
                                {t("userActionsFollow", "user") || "Follow"}
                              </>
                            )}
                          </Button>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          )}
        </Skeletonize>
      </div>
    </div>
  );
}
