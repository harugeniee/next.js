import { BaseEntityCustom } from "./base.interface";

/**
 * Rate limit plan entity
 * Defines different rate limiting tiers (anonymous, free, pro, enterprise)
 */
export interface Plan extends BaseEntityCustom {
  /**
   * Plan name - serves as primary key
   * Examples: 'anonymous', 'free', 'pro', 'enterprise'
   */
  name: string;

  /**
   * Rate limit per minute for this plan
   */
  limitPerMin: number;

  /**
   * Time-to-live in seconds for rate limit counters
   * Default: 60 seconds (1 minute)
   */
  ttlSec: number;

  /**
   * Additional configuration as JSON
   */
  extra?: Record<string, unknown>;

  /**
   * Plan description for admin interface
   */
  description?: string;

  /**
   * Whether this plan is active and available for assignment
   */
  active: boolean;

  /**
   * Display order for admin interface
   */
  displayOrder: number;
}

/**
 * API Key entity for rate limiting
 * Associates API keys with specific rate limit plans
 */
export interface ApiKey extends BaseEntityCustom {
  /**
   * The actual API key string
   */
  key: string;

  /**
   * Status enum value
   */
  status: string;

  /**
   * Whether this API key is currently active
   */
  active: boolean;

  /**
   * Whether this API key is whitelisted
   * Whitelisted keys bypass all rate limits
   */
  isWhitelist: boolean;

  /**
   * Optional name/description for the API key
   */
  name?: string;

  /**
   * Optional owner/user identifier
   */
  userId?: string;

  /**
   * Associated rate limit plan ID
   */
  planId?: string;

  /**
   * Associated rate limit plan
   */
  plan?: Plan;

  /**
   * Last time this API key was used
   */
  lastUsedAt?: Date;

  /**
   * Expiration date for the API key
   */
  expiresAt?: Date;
}

/**
 * IP Whitelist entity for rate limiting
 * IPs in this table bypass all rate limits
 */
export interface IpWhitelist extends BaseEntityCustom {
  /**
   * IP address or CIDR range
   * Examples: '192.168.1.1', '10.0.0.0/8', '::1'
   */
  ip: string;

  /**
   * Optional description for the whitelist entry
   */
  description?: string;

  /**
   * Whether this whitelist entry is active
   */
  active: boolean;

  /**
   * Status enum value
   */
  status: string;

  /**
   * Optional reason for whitelisting
   */
  reason?: string;
}

/**
 * Rate limit scope types
 */
export enum RateLimitScope {
  GLOBAL = "global",
  ROUTE = "route",
  USER = "user",
  ORG = "org",
  IP = "ip",
}

/**
 * Rate limit strategy types
 */
export enum RateLimitStrategy {
  FIXED_WINDOW = "fixedWindow",
  SLIDING_WINDOW = "slidingWindow",
  TOKEN_BUCKET = "tokenBucket",
}

/**
 * Rate limit policy entity
 * Defines flexible rate limiting rules with multiple strategies and scopes
 */
export interface RateLimitPolicy extends BaseEntityCustom {
  /**
   * Policy name for easy reference
   */
  name: string;

  /**
   * Whether this policy is active
   */
  active: boolean;

  /**
   * Status enum value
   */
  status: string;

  /**
   * Whether this policy is enabled
   */
  enabled: boolean;

  /**
   * Priority level (higher number = higher priority)
   */
  priority: number;

  /**
   * Scope of the policy
   */
  scope: RateLimitScope;

  /**
   * Route pattern for route-scoped policies
   * Supports regex patterns, e.g., '^POST:/api/v1/messages$'
   */
  routePattern?: string;

  /**
   * Rate limiting strategy
   */
  strategy: RateLimitStrategy;

  /**
   * Rate limit for fixed/sliding window strategies
   */
  limit?: number;

  /**
   * Time window in seconds for fixed/sliding window strategies
   */
  windowSec?: number;

  /**
   * Burst capacity for token bucket strategy
   */
  burst?: number;

  /**
   * Token refill rate per second for token bucket strategy
   */
  refillPerSec?: number;

  /**
   * Additional configuration as JSON
   */
  extra?: {
    userIds?: string[];
    orgIds?: string[];
    ips?: string[];
    weight?: number;
    whitelist?: boolean;
    [key: string]: unknown;
  };

  /**
   * Policy description for admin interface
   */
  description?: string;
}

/**
 * Cache statistics interface
 */
export interface CacheStats {
  planCount: number;
  ipWhitelistCount: number;
  apiKeyCount: number;
  policyCount: number;
}

/**
 * Rate limit info for a specific key
 */
export interface RateLimitInfo {
  current: number;
  limit: number;
  resetTime?: number;
}

/**
 * Policy match test response
 */
export interface PolicyMatchResponse {
  matches: boolean;
  policy: RateLimitPolicy | null;
}

// ============================================================================
// DTOs (Data Transfer Objects)
// ============================================================================

/**
 * DTO for creating a new rate limit plan
 */
export interface CreatePlanDto {
  name: string;
  limitPerMin: number;
  ttlSec?: number;
  description?: string;
  displayOrder?: number;
}

/**
 * DTO for updating an existing rate limit plan
 */
export interface UpdatePlanDto {
  limitPerMin?: number;
  ttlSec?: number;
  description?: string;
  active?: boolean;
  displayOrder?: number;
}

/**
 * DTO for creating a new API key
 */
export interface CreateApiKeyDto {
  key: string;
  plan: string;
  name?: string;
  ownerId?: string;
  isWhitelist?: boolean;
  expiresAt?: Date | string;
}

/**
 * DTO for updating an existing API key
 */
export interface UpdateApiKeyDto {
  plan?: string;
  name?: string;
  ownerId?: string;
  active?: boolean;
  isWhitelist?: boolean;
  expiresAt?: Date | string;
}

/**
 * DTO for creating a new IP whitelist entry
 */
export interface CreateIpWhitelistDto {
  ip: string;
  description?: string;
  reason?: string;
}

/**
 * DTO for updating an existing IP whitelist entry
 */
export interface UpdateIpWhitelistDto {
  description?: string;
  active?: boolean;
  reason?: string;
}

/**
 * DTO for creating a new rate limit policy
 */
export interface CreateRateLimitPolicyDto {
  name: string;
  enabled?: boolean;
  priority?: number;
  scope: RateLimitScope;
  routePattern?: string;
  strategy?: RateLimitStrategy;
  limit?: number;
  windowSec?: number;
  burst?: number;
  refillPerSec?: number;
  extra?: {
    userIds?: string[];
    orgIds?: string[];
    ips?: string[];
    name?: string;
    [key: string]: unknown;
  };
  description?: string;
}

/**
 * DTO for updating an existing rate limit policy
 */
export interface UpdateRateLimitPolicyDto {
  enabled?: boolean;
  priority?: number;
  scope?: RateLimitScope;
  routePattern?: string;
  strategy?: RateLimitStrategy;
  limit?: number;
  windowSec?: number;
  burst?: number;
  refillPerSec?: number;
  extra?: {
    userIds?: string[];
    orgIds?: string[];
    ips?: string[];
    name?: string;
    [key: string]: unknown;
  };
  description?: string;
}

/**
 * DTO for testing policy matching
 */
export interface TestPolicyMatchDto {
  userId?: string;
  orgId?: string;
  ip?: string;
  routeKey?: string;
  apiKey?: string;
}

