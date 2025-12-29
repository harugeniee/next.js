import { z } from "zod";

import {
  RateLimitScope,
  RateLimitStrategy,
} from "@/lib/interface/rate-limit.interface";

/**
 * Rate limit validation constants
 */
const RATE_LIMIT_CONSTANTS = {
  NAME_MIN_LENGTH: 1,
  NAME_MAX_LENGTH: 100,
  DESCRIPTION_MAX_LENGTH: 500,
  IP_MAX_LENGTH: 45, // IPv6 max length
  API_KEY_MIN_LENGTH: 1,
  API_KEY_MAX_LENGTH: 128,
  ROUTE_PATTERN_MAX_LENGTH: 255,
  PRIORITY_MIN: 1,
  PRIORITY_MAX: 1000,
  LIMIT_MIN: 1,
  TTL_MIN: 1,
  BURST_MIN: 1,
  REFILL_PER_SEC_MIN: 0.1,
} as const;

/**
 * IP address validation (supports IPv4, IPv6, and CIDR)
 */
const ipAddressSchema = z
  .string()
  .min(1, "IP address is required")
  .max(
    RATE_LIMIT_CONSTANTS.IP_MAX_LENGTH,
    `IP address must be less than ${RATE_LIMIT_CONSTANTS.IP_MAX_LENGTH} characters`,
  )
  .refine(
    (ip) => {
      // IPv4 regex
      const ipv4Regex =
        /^((25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)(\/([0-9]|[1-2][0-9]|3[0-2]))?$/;
      // IPv6 regex (simplified)
      const ipv6Regex =
        /^([0-9a-fA-F]{1,4}:){7}[0-9a-fA-F]{1,4}(\/([0-9]|[1-9][0-9]|1[0-2][0-8]))?$/;
      // IPv6 compressed format
      const ipv6CompressedRegex =
        /^::1$|^([0-9a-fA-F]{0,4}:)*::([0-9a-fA-F]{0,4}:)*[0-9a-fA-F]{0,4}(\/([0-9]|[1-9][0-9]|1[0-2][0-8]))?$/;

      return (
        ipv4Regex.test(ip) || ipv6Regex.test(ip) || ipv6CompressedRegex.test(ip)
      );
    },
    {
      message: "IP address must be a valid IPv4, IPv6, or CIDR notation",
    },
  );

/**
 * Create Plan Schema
 */
export const createPlanSchema = z.object({
  name: z
    .string()
    .min(RATE_LIMIT_CONSTANTS.NAME_MIN_LENGTH, "Plan name is required")
    .max(
      RATE_LIMIT_CONSTANTS.NAME_MAX_LENGTH,
      `Plan name must be less than ${RATE_LIMIT_CONSTANTS.NAME_MAX_LENGTH} characters`,
    ),
  limitPerMin: z
    .number()
    .int("Limit per minute must be an integer")
    .min(
      RATE_LIMIT_CONSTANTS.LIMIT_MIN,
      `Limit per minute must be at least ${RATE_LIMIT_CONSTANTS.LIMIT_MIN}`,
    ),
  ttlSec: z
    .number()
    .int("TTL must be an integer")
    .min(
      RATE_LIMIT_CONSTANTS.TTL_MIN,
      `TTL must be at least ${RATE_LIMIT_CONSTANTS.TTL_MIN} seconds`,
    )
    .optional(),
  description: z
    .string()
    .max(
      RATE_LIMIT_CONSTANTS.DESCRIPTION_MAX_LENGTH,
      `Description must be less than ${RATE_LIMIT_CONSTANTS.DESCRIPTION_MAX_LENGTH} characters`,
    )
    .optional(),
  displayOrder: z.number().int("Display order must be an integer").optional(),
});

/**
 * Update Plan Schema
 */
export const updatePlanSchema = z.object({
  limitPerMin: z
    .number()
    .int("Limit per minute must be an integer")
    .int()
    .min(
      RATE_LIMIT_CONSTANTS.LIMIT_MIN,
      `Limit per minute must be at least ${RATE_LIMIT_CONSTANTS.LIMIT_MIN}`,
    )
    .optional(),
  ttlSec: z
    .number()
    .int("TTL must be an integer")
    .min(
      RATE_LIMIT_CONSTANTS.TTL_MIN,
      `TTL must be at least ${RATE_LIMIT_CONSTANTS.TTL_MIN} seconds`,
    )
    .optional(),
  description: z
    .string()
    .max(
      RATE_LIMIT_CONSTANTS.DESCRIPTION_MAX_LENGTH,
      `Description must be less than ${RATE_LIMIT_CONSTANTS.DESCRIPTION_MAX_LENGTH} characters`,
    )
    .optional(),
  active: z.boolean().optional(),
  displayOrder: z.number().int("Display order must be an integer").optional(),
});

/**
 * Create API Key Schema
 */
export const createApiKeySchema = z.object({
  key: z
    .string()
    .min(RATE_LIMIT_CONSTANTS.API_KEY_MIN_LENGTH, "API key is required")
    .max(
      RATE_LIMIT_CONSTANTS.API_KEY_MAX_LENGTH,
      `API key must be less than ${RATE_LIMIT_CONSTANTS.API_KEY_MAX_LENGTH} characters`,
    ),
  plan: z.string().min(1, "Plan is required"),
  name: z
    .string()
    .max(
      RATE_LIMIT_CONSTANTS.NAME_MAX_LENGTH,
      `Name must be less than ${RATE_LIMIT_CONSTANTS.NAME_MAX_LENGTH} characters`,
    )
    .optional(),
  ownerId: z.string().optional(),
  isWhitelist: z.boolean().optional(),
  expiresAt: z.string().datetime().optional().or(z.literal("")),
});

/**
 * Update API Key Schema
 */
export const updateApiKeySchema = z.object({
  plan: z.string().min(1, "Plan is required").optional(),
  name: z
    .string()
    .max(
      RATE_LIMIT_CONSTANTS.NAME_MAX_LENGTH,
      `Name must be less than ${RATE_LIMIT_CONSTANTS.NAME_MAX_LENGTH} characters`,
    )
    .optional(),
  ownerId: z.string().optional(),
  active: z.boolean().optional(),
  isWhitelist: z.boolean().optional(),
  expiresAt: z.string().datetime().optional().or(z.literal("")),
});

/**
 * Create IP Whitelist Schema
 */
export const createIpWhitelistSchema = z.object({
  ip: ipAddressSchema,
  description: z
    .string()
    .max(
      RATE_LIMIT_CONSTANTS.DESCRIPTION_MAX_LENGTH,
      `Description must be less than ${RATE_LIMIT_CONSTANTS.DESCRIPTION_MAX_LENGTH} characters`,
    )
    .optional(),
  reason: z
    .string()
    .max(
      RATE_LIMIT_CONSTANTS.DESCRIPTION_MAX_LENGTH,
      `Reason must be less than ${RATE_LIMIT_CONSTANTS.DESCRIPTION_MAX_LENGTH} characters`,
    )
    .optional(),
});

/**
 * Update IP Whitelist Schema
 */
export const updateIpWhitelistSchema = z.object({
  description: z
    .string()
    .max(
      RATE_LIMIT_CONSTANTS.DESCRIPTION_MAX_LENGTH,
      `Description must be less than ${RATE_LIMIT_CONSTANTS.DESCRIPTION_MAX_LENGTH} characters`,
    )
    .optional(),
  active: z.boolean().optional(),
  reason: z
    .string()
    .max(
      RATE_LIMIT_CONSTANTS.DESCRIPTION_MAX_LENGTH,
      `Reason must be less than ${RATE_LIMIT_CONSTANTS.DESCRIPTION_MAX_LENGTH} characters`,
    )
    .optional(),
});

/**
 * Create Policy Schema
 */
export const createPolicySchema = z.object({
  name: z
    .string()
    .min(RATE_LIMIT_CONSTANTS.NAME_MIN_LENGTH, "Policy name is required")
    .max(
      RATE_LIMIT_CONSTANTS.NAME_MAX_LENGTH,
      `Policy name must be less than ${RATE_LIMIT_CONSTANTS.NAME_MAX_LENGTH} characters`,
    ),
  enabled: z.boolean().optional(),
  priority: z
    .number()
    .int("Priority must be an integer")
    .min(
      RATE_LIMIT_CONSTANTS.PRIORITY_MIN,
      `Priority must be at least ${RATE_LIMIT_CONSTANTS.PRIORITY_MIN}`,
    )
    .max(
      RATE_LIMIT_CONSTANTS.PRIORITY_MAX,
      `Priority must be at most ${RATE_LIMIT_CONSTANTS.PRIORITY_MAX}`,
    )
    .optional(),
  scope: z.nativeEnum(RateLimitScope, {
    message: "Scope is required",
  }),
  routePattern: z
    .string()
    .max(
      RATE_LIMIT_CONSTANTS.ROUTE_PATTERN_MAX_LENGTH,
      `Route pattern must be less than ${RATE_LIMIT_CONSTANTS.ROUTE_PATTERN_MAX_LENGTH} characters`,
    )
    .optional(),
  strategy: z.nativeEnum(RateLimitStrategy).optional(),
  limit: z
    .number()
    .int("Limit must be an integer")
    .min(
      RATE_LIMIT_CONSTANTS.LIMIT_MIN,
      `Limit must be at least ${RATE_LIMIT_CONSTANTS.LIMIT_MIN}`,
    )
    .optional(),
  windowSec: z
    .number()
    .int("Window seconds must be an integer")
    .min(
      RATE_LIMIT_CONSTANTS.TTL_MIN,
      `Window seconds must be at least ${RATE_LIMIT_CONSTANTS.TTL_MIN}`,
    )
    .optional(),
  burst: z
    .number()
    .int("Burst must be an integer")
    .min(
      RATE_LIMIT_CONSTANTS.BURST_MIN,
      `Burst must be at least ${RATE_LIMIT_CONSTANTS.BURST_MIN}`,
    )
    .optional(),
  refillPerSec: z
    .number()
    .min(
      RATE_LIMIT_CONSTANTS.REFILL_PER_SEC_MIN,
      `Refill per second must be at least ${RATE_LIMIT_CONSTANTS.REFILL_PER_SEC_MIN}`,
    )
    .optional(),
  extra: z
    .object({
      userIds: z.array(z.string()).optional(),
      orgIds: z.array(z.string()).optional(),
      ips: z.array(z.string()).optional(),
      name: z.string().optional(),
    })
    .passthrough()
    .optional(),
  description: z
    .string()
    .max(
      RATE_LIMIT_CONSTANTS.DESCRIPTION_MAX_LENGTH,
      `Description must be less than ${RATE_LIMIT_CONSTANTS.DESCRIPTION_MAX_LENGTH} characters`,
    )
    .optional(),
});

/**
 * Update Policy Schema
 */
export const updatePolicySchema = z.object({
  enabled: z.boolean().optional(),
  priority: z
    .number()
    .int("Priority must be an integer")
    .min(
      RATE_LIMIT_CONSTANTS.PRIORITY_MIN,
      `Priority must be at least ${RATE_LIMIT_CONSTANTS.PRIORITY_MIN}`,
    )
    .max(
      RATE_LIMIT_CONSTANTS.PRIORITY_MAX,
      `Priority must be at most ${RATE_LIMIT_CONSTANTS.PRIORITY_MAX}`,
    )
    .optional(),
  scope: z.nativeEnum(RateLimitScope).optional(),
  routePattern: z
    .string()
    .max(
      RATE_LIMIT_CONSTANTS.ROUTE_PATTERN_MAX_LENGTH,
      `Route pattern must be less than ${RATE_LIMIT_CONSTANTS.ROUTE_PATTERN_MAX_LENGTH} characters`,
    )
    .optional(),
  strategy: z.nativeEnum(RateLimitStrategy).optional(),
  limit: z
    .number()
    .int("Limit must be an integer")
    .min(
      RATE_LIMIT_CONSTANTS.LIMIT_MIN,
      `Limit must be at least ${RATE_LIMIT_CONSTANTS.LIMIT_MIN}`,
    )
    .optional(),
  windowSec: z
    .number()
    .int("Window seconds must be an integer")
    .min(
      RATE_LIMIT_CONSTANTS.TTL_MIN,
      `Window seconds must be at least ${RATE_LIMIT_CONSTANTS.TTL_MIN}`,
    )
    .optional(),
  burst: z
    .number()
    .int("Burst must be an integer")
    .min(
      RATE_LIMIT_CONSTANTS.BURST_MIN,
      `Burst must be at least ${RATE_LIMIT_CONSTANTS.BURST_MIN}`,
    )
    .optional(),
  refillPerSec: z
    .number()
    .min(
      RATE_LIMIT_CONSTANTS.REFILL_PER_SEC_MIN,
      `Refill per second must be at least ${RATE_LIMIT_CONSTANTS.REFILL_PER_SEC_MIN}`,
    )
    .optional(),
  extra: z
    .object({
      userIds: z.array(z.string()).optional(),
      orgIds: z.array(z.string()).optional(),
      ips: z.array(z.string()).optional(),
      name: z.string().optional(),
    })
    .passthrough()
    .optional(),
  description: z
    .string()
    .max(
      RATE_LIMIT_CONSTANTS.DESCRIPTION_MAX_LENGTH,
      `Description must be less than ${RATE_LIMIT_CONSTANTS.DESCRIPTION_MAX_LENGTH} characters`,
    )
    .optional(),
});

/**
 * Test Policy Match Schema
 */
export const testPolicyMatchSchema = z.object({
  userId: z.string().optional(),
  orgId: z.string().optional(),
  ip: z.string().optional(),
  routeKey: z.string().optional(),
  apiKey: z.string().optional(),
});

// ============================================================================
// Type Exports
// ============================================================================

export type CreatePlanFormData = z.infer<typeof createPlanSchema>;
export type UpdatePlanFormData = z.infer<typeof updatePlanSchema>;
export type CreateApiKeyFormData = z.infer<typeof createApiKeySchema>;
export type UpdateApiKeyFormData = z.infer<typeof updateApiKeySchema>;
export type CreateIpWhitelistFormData = z.infer<typeof createIpWhitelistSchema>;
export type UpdateIpWhitelistFormData = z.infer<typeof updateIpWhitelistSchema>;
export type CreatePolicyFormData = z.infer<typeof createPolicySchema>;
export type UpdatePolicyFormData = z.infer<typeof updatePolicySchema>;
export type TestPolicyMatchFormData = z.infer<typeof testPolicyMatchSchema>;
