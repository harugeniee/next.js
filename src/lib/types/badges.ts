/**
 * Badge System TypeScript Types
 * Matches backend DTOs and entities from backend/src/badges
 */

// Enums matching backend constants
export enum BadgeType {
  // Common badges
  NITRO_SUBSCRIBER = "nitro_subscriber",
  SERVER_BOOSTING = "server_boosting",
  QUEST_BADGE = "quest_badge",
  ACTIVE_DEVELOPER = "active_developer",

  // Paid badges
  ORBS_APPRENTICE = "orbs_apprentice",

  // Rare badges
  BUG_HUNTER = "bug_hunter",
  GOLD_BUG_HUNTER = "gold_bug_hunter",
  DISCORD_STAFF = "discord_staff",

  // Unobtainable badges
  EARLY_SUPPORTER = "early_supporter",
  EARLY_VERIFIED_BOT_DEVELOPER = "early_verified_bot_developer",
  PARTNERED_SERVER_OWNER = "partnered_server_owner",
  HYPESQUAD_BALANCE = "hypesquad_balance",
  HYPESQUAD_BRAVERY = "hypesquad_bravery",
  HYPESQUAD_BRILLIANCE = "hypesquad_brilliance",
  HYPESQUAD_EVENTS = "hypesquad_events",
  MODERATOR_PROGRAMS_ALUMNI = "moderator_programs_alumni",
  LEGACY_USERNAME = "legacy_username",
  CLOWN_BADGE = "clown_badge",

  // App badges
  SUPPORTS_COMMANDS = "supports_commands",
  PREMIUM_APP = "premium_app",
  USES_AUTOMOD = "uses_automod",

  // Custom badges
  CONTENT_CREATOR = "content_creator",
  COMMUNITY_MODERATOR = "community_moderator",
  EARLY_ADOPTER = "early_adopter",
  BETA_TESTER = "beta_tester",
  CONTRIBUTOR = "contributor",
  VERIFIED_USER = "verified_user",
  PREMIUM_USER = "premium_user",
  ORGANIZATION_MEMBER = "organization_member",
  ORGANIZATION_ADMIN = "organization_admin",
  ORGANIZATION_OWNER = "organization_owner",
  ARTICLE_AUTHOR = "article_author",
  COMMENT_MODERATOR = "comment_moderator",
  REACTION_LEADER = "reaction_leader",
  SHARE_CHAMPION = "share_champion",
  BOOKMARK_COLLECTOR = "bookmark_collector",
  FOLLOW_INFLUENCER = "follow_influencer",
  NOTIFICATION_MASTER = "notification_master",
  QR_CODE_EXPERT = "qr_code_expert",
  STICKER_CREATOR = "sticker_creator",
  TAG_MASTER = "tag_master",
  REPORT_RESPONDER = "report_responder",
  ANALYTICS_EXPERT = "analytics_expert",
  WORKER_CONTRIBUTOR = "worker_contributor",
}

export enum BadgeCategory {
  COMMON = "common",
  PAID = "paid",
  RARE = "rare",
  UNOBTAINABLE = "unobtainable",
  APP = "app",
  CUSTOM = "custom",
  ACHIEVEMENT = "achievement",
  STATUS = "status",
  ROLE = "role",
}

export enum BadgeRarity {
  COMMON = "common",
  UNCOMMON = "uncommon",
  RARE = "rare",
  EPIC = "epic",
  LEGENDARY = "legendary",
  MYTHIC = "mythic",
}

export enum BadgeStatus {
  ACTIVE = "active",
  INACTIVE = "inactive",
  HIDDEN = "hidden",
  DISCONTINUED = "discontinued",
}

export enum BadgeEntityType {
  USER = "user",
  ARTICLE = "article",
  COMMENT = "comment",
  ORGANIZATION = "organization",
  MEDIA = "media",
  NOTIFICATION = "notification",
  QR_TICKET = "qr_ticket",
  STICKER = "sticker",
  TAG = "tag",
  REPORT = "report",
  SHARE = "share",
  BOOKMARK = "bookmark",
  REACTION = "reaction",
  FOLLOW = "follow",
  PERMISSION = "permission",
  RATE_LIMIT = "rate_limit",
  ANALYTICS = "analytics",
  WORKER = "worker",
}

export enum BadgeAssignmentStatus {
  ACTIVE = "active",
  REVOKED = "revoked",
  EXPIRED = "expired",
  SUSPENDED = "suspended",
}

/**
 * Badge Entity
 * Matches backend/src/badges/entities/badge.entity.ts
 */
export interface Badge {
  id: string;
  uuid: string;
  type: BadgeType;
  name: string;
  description?: string;
  category: BadgeCategory;
  rarity: BadgeRarity;
  status: BadgeStatus;
  isVisible: boolean;
  isObtainable: boolean;
  displayOrder: number;
  iconUrl?: string;
  color?: string;
  requirements?: string;
  metadata?: Record<string, unknown>;
  isAutoAssigned: boolean;
  isManuallyAssignable: boolean;
  isRevokable: boolean;
  expiresAt?: Date | string;
  assignmentCount: number;
  createdAt: Date | string;
  updatedAt: Date | string;
  deletedAt?: Date | string;
  version: number;
}

/**
 * Badge Assignment Entity
 * Matches backend/src/badges/entities/badge-assignment.entity.ts
 */
export interface BadgeAssignment {
  id: string;
  uuid: string;
  badgeId: string;
  entityType: BadgeEntityType;
  entityId: string;
  status: BadgeAssignmentStatus;
  assignedAt: Date | string;
  expiresAt?: Date | string;
  revokedAt?: Date | string;
  assignedBy?: string;
  revokedBy?: string;
  assignmentReason?: string;
  revocationReason?: string;
  metadata?: Record<string, unknown>;
  isVisible: boolean;
  isManuallyRevokable: boolean;
  createdAt: Date | string;
  updatedAt: Date | string;
  deletedAt?: Date | string;
  version: number;
  badge?: Badge;
}

/**
 * Create Badge DTO
 * Matches backend/src/badges/dto/create-badge.dto.ts
 */
export interface CreateBadgeDto {
  type: BadgeType;
  name: string;
  description?: string;
  category: BadgeCategory;
  rarity: BadgeRarity;
  status?: BadgeStatus;
  isVisible?: boolean;
  isObtainable?: boolean;
  displayOrder?: number;
  iconUrl?: string;
  color?: string;
  requirements?: string;
  metadata?: Record<string, unknown>;
  isAutoAssigned?: boolean;
  isManuallyAssignable?: boolean;
  isRevokable?: boolean;
  expiresAt?: string;
}

/**
 * Update Badge DTO
 * Matches backend/src/badges/dto/update-badge.dto.ts
 */
export type UpdateBadgeDto = Partial<CreateBadgeDto>;

/**
 * Get Badge DTO (Query Parameters)
 * Matches backend/src/badges/dto/get-badge.dto.ts
 */
export interface GetBadgeDto {
  page?: number;
  limit?: number;
  sortBy?: string;
  order?: "ASC" | "DESC";
  query?: string;
  fields?: string[];
  types?: BadgeType[];
  categories?: BadgeCategory[];
  rarities?: BadgeRarity[];
  statuses?: BadgeStatus[];
  isVisible?: boolean;
  isObtainable?: boolean;
  isAutoAssigned?: boolean;
  isManuallyAssignable?: boolean;
}

/**
 * Assign Badge DTO
 * Matches backend/src/badges/dto/assign-badge.dto.ts
 */
export interface AssignBadgeDto {
  badgeId: string;
  entityType: BadgeEntityType;
  entityId: string;
  expiresAt?: string;
  assignmentReason?: string;
  isVisible?: boolean;
  metadata?: Record<string, unknown>;
}

/**
 * Revoke Badge DTO
 * Matches backend/src/badges/dto/revoke-badge.dto.ts
 */
export interface RevokeBadgeDto {
  revocationReason?: string;
  metadata?: Record<string, unknown>;
}

/**
 * Get Badge Assignment DTO (Query Parameters)
 * Matches backend/src/badges/dto/get-badge-assignment.dto.ts
 */
export interface GetBadgeAssignmentDto {
  page?: number;
  limit?: number;
  sortBy?: string;
  order?: "ASC" | "DESC";
  query?: string;
  fields?: string[];
  badgeId?: string;
  entityType?: BadgeEntityType;
  entityId?: string;
  statuses?: BadgeAssignmentStatus[];
  isVisible?: boolean;
  isManuallyRevokable?: boolean;
  assignedBy?: string;
  revokedBy?: string;
  assignedFrom?: string;
  assignedTo?: string;
  expiresFrom?: string;
  expiresTo?: string;
  revokedFrom?: string;
  revokedTo?: string;
}

/**
 * Badge Statistics Response
 * Matches backend badges.controller.ts getBadgeStatistics response
 */
export interface BadgeStatistics {
  totalBadges: number;
  activeBadges: number;
  totalAssignments: number;
  badgesByCategory: Record<string, number>;
  badgesByRarity: Record<string, number>;
}

/**
 * Badge List Response with Pagination
 */
export interface BadgeListResponse {
  result: Badge[];
  metaData: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

/**
 * Badge Assignment List Response with Pagination
 */
export interface BadgeAssignmentListResponse {
  result: BadgeAssignment[];
  metaData: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}
