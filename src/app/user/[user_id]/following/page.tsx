"use client";

import { useParams } from "next/navigation";

import { UserFollowList } from "@/components/features/user";

/**
 * Following Page
 * Displays list of users this user is following
 */
export default function FollowingPage() {
  const params = useParams();
  const userId = params.user_id as string;

  return (
    <div className="container mx-auto px-4 py-8">
      <UserFollowList userId={userId} type="following" />
    </div>
  );
}
