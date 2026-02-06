"use client";

import { useParams } from "next/navigation";

import { UserFollowList } from "@/components/features/user";

/**
 * Followers Page
 * Displays list of users following this user
 */
export default function FollowersPage() {
  const params = useParams();
  const userId = params.user_id as string;

  return (
    <div className="container mx-auto px-4 py-8">
      <UserFollowList userId={userId} type="followers" />
    </div>
  );
}
