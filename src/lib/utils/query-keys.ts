/**
 * Query Key Factory for TanStack Query
 * Centralizes all query keys to prevent typos and ensure consistency
 *
 * @see https://tkdodo.eu/blog/effective-react-query-keys
 */

import type { GetBadgeAssignmentDto, GetBadgeDto } from "../types/badges";
import { AdvancedQueryParams } from "../types";

export const queryKeys = {
  // Auth related queries
  auth: {
    currentUser: () => ["currentUser"] as const,
    userProfile: (userId: string) => ["user", userId] as const,
  },

  // Article related queries
  articles: {
    all: () => ["articles"] as const,
    lists: () => ["articles", "list"] as const,
    list: (params?: AdvancedQueryParams) =>
      ["articles", "list", params] as const,
    details: () => ["articles", "detail"] as const,
    detail: (id: string) => ["articles", "detail", id] as const,
    byUser: (userId: string) => ["articles", "user", userId] as const,
    byTag: (tag: string) => ["articles", "tag", tag] as const,
    byCategory: (category: string) =>
      ["articles", "category", category] as const,
    myList: (userId: string, params?: AdvancedQueryParams) =>
      ["articles", "my", "list", userId, params] as const,
  },

  // Settings related queries
  settings: {
    all: () => ["settings"] as const,
    byUser: (userId: string) => ["settings", userId] as const,
  },

  // Reactions related queries
  reactions: {
    all: () => ["reactions"] as const,
    byArticle: (articleId: string) =>
      ["reactions", "article", articleId] as const,
    byUser: (userId: string) => ["reactions", "user", userId] as const,
  },

  // Media related queries
  media: {
    all: () => ["media"] as const,
    byUser: (userId: string) => ["media", "user", userId] as const,
    uploads: () => ["media", "uploads"] as const,
    admin: {
      all: () => ["media", "admin"] as const,
      lists: (params?: unknown) => ["media", "admin", "lists", params] as const,
      detail: (id: string) => ["media", "admin", "detail", id] as const,
      statistics: () => ["media", "admin", "statistics"] as const,
    },
  },

  // Users related queries
  users: {
    all: () => ["users"] as const,
    list: (params?: AdvancedQueryParams) => ["users", "list", params] as const,
    profile: (userId: string) => ["users", "profile", userId] as const,
    search: (query: string) => ["users", "search", query] as const,
  },

  // Series related queries
  series: {
    all: () => ["series"] as const,
    lists: () => ["series", "list"] as const,
    list: (params?: AdvancedQueryParams) => ["series", "list", params] as const,
    details: () => ["series", "detail"] as const,
    detail: (id: string) => ["series", "detail", id] as const,
    popular: () => ["series", "popular"] as const,
    latestUpdates: () => ["series", "latest-updates"] as const,
    recommended: () => ["series", "recommended"] as const,
    selfPublished: () => ["series", "self-published"] as const,
    featured: () => ["series", "featured"] as const,
    seasonal: (season?: string, year?: number) =>
      ["series", "seasonal", season, year] as const,
    recentlyAdded: () => ["series", "recently-added"] as const,
    byType: (type: string) => ["series", "type", type] as const,
    byGenre: (genre: string) => ["series", "genre", genre] as const,
    search: (query: string) => ["series", "search", query] as const,
    segments: {
      all: (seriesId: string) => ["series", seriesId, "segments"] as const,
      list: (seriesId: string, params?: AdvancedQueryParams) =>
        ["series", seriesId, "segments", "list", params] as const,
      cursor: (seriesId: string, cursor?: string, languageCode?: string) =>
        [
          "series",
          seriesId,
          "segments",
          "cursor",
          cursor,
          languageCode,
        ] as const,
      detail: (seriesId: string, segmentId: string) =>
        ["series", seriesId, "segments", segmentId] as const,
    },
  },

  // Segments related queries (standalone, not tied to series)
  segments: {
    all: () => ["segments"] as const,
    byUser: (userId: string) => ["segments", "user", userId] as const,
    byUserCursor: (
      userId: string,
      cursor?: string,
      type?: string,
      status?: string,
    ) => ["segments", "user", userId, "cursor", cursor, type, status] as const,
    next: (segmentId: string) => ["segments", "next", segmentId] as const,
    previous: (segmentId: string) =>
      ["segments", "previous", segmentId] as const,
  },

  // Characters related queries
  characters: {
    all: () => ["characters"] as const,
    cursor: (seriesId: string, cursor?: string) =>
      ["characters", "cursor", seriesId, cursor] as const,
    bySeries: (seriesId: string) => ["characters", "series", seriesId] as const,
    admin: {
      all: () => ["characters", "admin"] as const,
      lists: (params?: unknown) =>
        ["characters", "admin", "lists", params] as const,
      detail: (id: string) => ["characters", "admin", "detail", id] as const,
      statistics: () => ["characters", "admin", "statistics"] as const,
    },
  },

  // Comments related queries
  comments: {
    all: () => ["comments"] as const,
    list: (params?: unknown) => ["comments", "list", params] as const,
    cursor: (subjectType?: string, subjectId?: string, cursor?: string) =>
      ["comments", "cursor", subjectType, subjectId, cursor] as const,
    detail: (id: string, options?: unknown) =>
      ["comments", "detail", id, options] as const,
    replies: (id: string, params?: unknown) =>
      ["comments", "replies", id, params] as const,
    stats: (subjectType: string, subjectId: string) =>
      ["comments", "stats", subjectType, subjectId] as const,
    batch: (data: unknown) => ["comments", "batch", data] as const,
    // Admin-specific query keys
    admin: {
      all: () => ["comments", "admin"] as const,
      lists: () => ["comments", "admin", "list"] as const,
      list: (params?: unknown) =>
        ["comments", "admin", "list", params] as const,
      detail: (id: string) => ["comments", "admin", "detail", id] as const,
      statistics: () => ["comments", "admin", "statistics"] as const,
    },
  },

  // Bookmarks related queries
  bookmarks: {
    all: () => ["bookmarks"] as const,
    list: (params?: AdvancedQueryParams) =>
      ["bookmarks", "list", params] as const,
    detail: (id: string) => ["bookmarks", "detail", id] as const,
    stats: () => ["bookmarks", "stats"] as const,
    folders: {
      all: () => ["bookmarks", "folders"] as const,
      list: (params?: AdvancedQueryParams) =>
        ["bookmarks", "folders", "list", params] as const,
      detail: (id: string) => ["bookmarks", "folders", "detail", id] as const,
    },
  },

  // Follow related queries
  follow: {
    status: (followerId: string, followeeId: string) =>
      ["follow", "status", followerId, followeeId] as const,
    following: (userId: string, params?: unknown) =>
      ["follow", "following", userId, params] as const,
    followers: (userId: string, params?: unknown) =>
      ["follow", "followers", userId, params] as const,
    mutuals: (userA: string, userB: string) =>
      ["follow", "mutuals", userA, userB] as const,
    suggestions: (userId: string, params?: unknown) =>
      ["follow", "suggestions", userId, params] as const,
    counters: (userId: string) => ["follow", "counters", userId] as const,
    feed: (userId: string, params?: unknown) =>
      ["follow", "feed", userId, params] as const,
    trending: () => ["follow", "trending"] as const,
    recommendations: (userId: string) =>
      ["follow", "recommendations", userId] as const,
    feedStats: (userId: string) => ["follow", "feedStats", userId] as const,
  },

  // Notifications related queries
  notifications: {
    all: () => ["notifications"] as const,
    list: (params?: AdvancedQueryParams) =>
      ["notifications", "list", params] as const,
    detail: (id: string) => ["notifications", "detail", id] as const,
    stats: () => ["notifications", "stats"] as const,
    preferences: {
      all: () => ["notifications", "preferences"] as const,
      detail: (id: string) =>
        ["notifications", "preferences", "detail", id] as const,
    },
  },

  // Tags related queries
  tags: {
    all: () => ["tags"] as const,
    list: (params?: AdvancedQueryParams) => ["tags", "list", params] as const,
    detail: (id: string) => ["tags", "detail", id] as const,
    bySlug: (slug: string) => ["tags", "slug", slug] as const,
    popular: () => ["tags", "popular"] as const,
    trending: () => ["tags", "trending"] as const,
    featured: () => ["tags", "featured"] as const,
    suggestions: (content: string) => ["tags", "suggestions", content] as const,
    stats: () => ["tags", "stats"] as const,
  },

  // Share related queries
  share: {
    links: (contentType: string, contentId: string) =>
      ["share", "links", contentType, contentId] as const,
    metrics: (code: string, params?: unknown) =>
      ["share", "metrics", code, params] as const,
    count: (contentType: string, contentId: string) =>
      ["share", "count", contentType, contentId] as const,
  },

  // Reports related queries
  reports: {
    all: () => ["reports"] as const,
    list: (params?: AdvancedQueryParams) =>
      ["reports", "list", params] as const,
    detail: (id: string) => ["reports", "detail", id] as const,
    stats: (params?: AdvancedQueryParams) =>
      ["reports", "stats", params] as const,
    my: (params?: AdvancedQueryParams) => ["reports", "my", params] as const,
    assigned: (params?: AdvancedQueryParams) =>
      ["reports", "assigned", params] as const,
    pending: (params?: AdvancedQueryParams) =>
      ["reports", "pending", params] as const,
    urgent: (params?: AdvancedQueryParams) =>
      ["reports", "urgent", params] as const,
    forContent: (type: string, id: string) =>
      ["reports", "content", type, id] as const,
    duplicates: (type: string, id: string) =>
      ["reports", "duplicates", type, id] as const,
  },

  // Permissions related queries
  permissions: {
    all: () => ["permissions"] as const,
    checkRole: (roleName: string) =>
      ["permissions", "checkRole", roleName] as const,
    roles: {
      all: () => ["permissions", "roles"] as const,
      detail: (id: string) => ["permissions", "roles", id] as const,
    },
    userRoles: {
      byUser: (userId: string) =>
        ["permissions", "userRoles", "user", userId] as const,
      byRole: (roleId: string) =>
        ["permissions", "userRoles", "role", roleId] as const,
    },
  },

  // Analytics related queries
  analytics: {
    all: () => ["analytics"] as const,
    dashboard: {
      overview: (params?: unknown) =>
        ["analytics", "dashboard", "overview", params] as const,
      trends: (params?: unknown) =>
        ["analytics", "dashboard", "trends", params] as const,
      topContent: (params?: unknown) =>
        ["analytics", "dashboard", "top-content", params] as const,
      userEngagement: (params?: unknown) =>
        ["analytics", "dashboard", "user-engagement", params] as const,
    },
    platform: {
      overview: () => ["analytics", "platform", "overview"] as const,
    },
    events: (params?: unknown) => ["analytics", "events", params] as const,
  },

  // Badges related queries
  badges: {
    all: () => ["badges"] as const,
    lists: (filters?: GetBadgeDto) => ["badges", "list", filters] as const,
    detail: (id: string) => ["badges", "detail", id] as const,
    statistics: () => ["badges", "statistics"] as const,
    assignments: (filters?: GetBadgeAssignmentDto) =>
      ["badges", "assignments", filters] as const,
  },

  // Organizations related queries
  organizations: {
    all: () => ["organizations"] as const,
    lists: () => ["organizations", "list"] as const,
    list: (params?: AdvancedQueryParams) =>
      ["organizations", "list", params] as const,
    details: () => ["organizations", "detail"] as const,
    detail: (id: string) => ["organizations", "detail", id] as const,
    bySlug: (slug: string) => ["organizations", "slug", slug] as const,
    myOwned: () => ["organizations", "my", "owned"] as const,
    myMemberships: () => ["organizations", "my", "memberships"] as const,
  },

  // Rate limit related queries
  rateLimit: {
    plans: () => ["rateLimit", "plans"] as const,
    apiKeys: () => ["rateLimit", "apiKeys"] as const,
    ipWhitelist: () => ["rateLimit", "ipWhitelist"] as const,
    policies: () => ["rateLimit", "policies"] as const,
    cacheStats: () => ["rateLimit", "cacheStats"] as const,
  },
} as const;

/**
 * Type-safe query key extractor
 * Helps with TypeScript inference for query keys
 */
export type QueryKeys = typeof queryKeys;
