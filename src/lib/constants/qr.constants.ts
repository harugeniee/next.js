/**
 * QR Module Constants - Comprehensive configuration and constants for the QR Actions feature
 * This file contains all constants used across the QR module including Redis keys, TTLs,
 * rate limits, deep link configuration, status messages, error messages, and more.
 */

/**
 * Redis key prefixes for different QR-related data types
 */
export const QR_REDIS_PREFIXES = {
  /** Prefix for QR tickets stored in Redis */
  TICKET: "QR:TICKET:",
  /** Prefix for QR grants stored in Redis */
  GRANT: "QR:GRANT:",
  /** Prefix for rate limiting keys */
  RATE_LIMIT: "QR:RATE_LIMIT:",
  /** Prefix for QR ticket delivery codes */
  DELIVERY: "QR:DELIVERY:",
  /** Prefix for QR status pub/sub channels */
  STATUS_CHANNEL: "qr:status:",
} as const;

/**
 * Default TTL values in seconds for different QR components
 */
export const QR_TTL_DEFAULTS = {
  /** Default TTL for QR tickets (3 minutes) */
  TICKET: 180,
  /** Default TTL for QR grants (30 seconds) */
  GRANT: 30,
  /** Default TTL for rate limiting windows (1 minute) */
  RATE_LIMIT_WINDOW: 60,
} as const;

/**
 * Rate limiting configuration for QR endpoints
 */
export const QR_RATE_LIMITS = {
  /** Maximum number of tickets that can be created per IP per window */
  CREATE_TICKET: 10,
  /** Maximum number of grant exchanges per IP per window */
  EXCHANGE_GRANT: 5,
  /** Maximum number of scan attempts per ticket per user */
  SCAN_ATTEMPTS: 3,
  /** Maximum number of approval attempts per ticket per user */
  APPROVAL_ATTEMPTS: 3,
  /** Maximum number of polling requests per IP+ticket per window (2 seconds) */
  POLLING: 1,
} as const;

/**
 * QR deep link configuration
 */
export const QR_DEEP_LINK_CONFIG = {
  /** Default scheme for app deep links */
  DEFAULT_SCHEME: "app",
  /** Default path for QR handling */
  DEFAULT_PATH: "qr",
  /** Default HTTPS fallback URL */
  DEFAULT_HTTPS_FALLBACK: "https://example.com/qr/mobile/open",
  /** Default base URL for fallback links */
  DEFAULT_BASE_URL: "https://example.com",
  /** Whether to use HTTPS fallback by default */
  DEFAULT_USE_HTTPS_FALLBACK: true,
} as const;

/**
 * QR status messages for different states
 */
export const QR_STATUS_MESSAGES = {
  PENDING: "QR code is waiting to be scanned",
  SCANNED: "QR code has been scanned, waiting for approval",
  APPROVED: "Action has been approved, proceed with grant exchange",
  REJECTED: "Action has been rejected by the user",
  EXPIRED: "QR code has expired, please generate a new one",
  USED: "QR code has been used and is no longer valid",
} as const;

/**
 * Error messages for QR operations
 */
export const QR_ERROR_MESSAGES = {
  TICKET_NOT_FOUND: "QR ticket not found or has expired",
  TICKET_ALREADY_USED: "QR ticket has already been used",
  TICKET_EXPIRED: "QR ticket has expired",
  INVALID_CODE_VERIFIER: "Invalid code verifier provided",
  INVALID_STATUS_TRANSITION: "Invalid status transition for this ticket",
  RATE_LIMIT_EXCEEDED: "Rate limit exceeded, please try again later",
  UNAUTHORIZED_OPERATION: "You are not authorized to perform this operation",
  ACTION_EXECUTION_FAILED: "Failed to execute the requested action",
  INVALID_ACTION_TYPE: "Invalid action type specified",
  MISSING_ACTION_IMPLEMENTATION: "Action implementation not found",
  INVALID_TICKET_ID: "Invalid ticket ID format",
  INVALID_CODE_CHALLENGE: "Invalid code challenge format",
} as const;

/**
 * WebSocket event names for QR status updates
 */
export const QR_WS_EVENTS = {
  /** Event emitted when ticket status changes */
  STATUS_UPDATE: "qr:status:update",
  /** Event emitted when a client joins a ticket room */
  JOIN_ROOM: "qr:room:join",
  /** Event emitted when a client leaves a ticket room */
  LEAVE_ROOM: "qr:room:leave",
  /** Event emitted when a ticket is scanned */
  TICKET_SCANNED: "qr:ticket:scanned",
  /** Event emitted when a ticket is approved */
  TICKET_APPROVED: "qr:ticket:approved",
  /** Event emitted when a ticket is rejected */
  TICKET_REJECTED: "qr:ticket:rejected",
  /** Event emitted when a ticket expires */
  TICKET_EXPIRED: "qr:ticket:expired",
} as const;

/**
 * QR room naming convention for WebSocket connections
 */
export const QR_ROOM_PREFIX = "qr:ticket:";

/**
 * QR cryptographic configuration
 */
export const QR_CRYPTO_CONFIG = {
  /** Default length for code verifier (PKCE) */
  DEFAULT_CODE_VERIFIER_LENGTH: 64,
  /** Default length for grant tokens */
  DEFAULT_GRANT_TOKEN_LENGTH: 32,
  /** Default length for ticket IDs */
  DEFAULT_TICKET_ID_LENGTH: 16,
  /** Hash algorithm used for PKCE code challenge */
  HASH_ALGORITHM: "sha256",
} as const;

/**
 * QR validation rules and limits
 */
export const QR_VALIDATION_RULES = {
  /** Minimum length for ticket IDs */
  MIN_TICKET_ID_LENGTH: 16,
  /** Maximum length for ticket IDs */
  MAX_TICKET_ID_LENGTH: 64,
  /** Minimum length for code verifiers */
  MIN_CODE_VERIFIER_LENGTH: 32,
  /** Maximum length for code verifiers */
  MAX_CODE_VERIFIER_LENGTH: 128,
  /** Maximum depth for payload sanitization */
  MAX_PAYLOAD_DEPTH: 2,
  /** Maximum string length in sanitized payloads */
  MAX_STRING_LENGTH: 100,
  /** Maximum array items in sanitized payloads */
  MAX_ARRAY_ITEMS: 10,
} as const;

/**
 * QR sensitive data patterns for sanitization
 */
export const QR_SENSITIVE_KEYS = [
  "password",
  "token",
  "secret",
  "key",
  "auth",
  "credential",
  "userid",
  "user_id",
  "api_key",
  "private_key",
  "access_token",
  "refresh_token",
] as const;

/**
 * QR HTTP status codes for different scenarios
 */
export const QR_HTTP_STATUS_CODES = {
  /** Success - Ticket created successfully */
  TICKET_CREATED: 201,
  /** Success - Action executed successfully */
  ACTION_EXECUTED: 200,
  /** Bad Request - Invalid input data */
  BAD_REQUEST: 400,
  /** Unauthorized - Authentication required */
  UNAUTHORIZED: 401,
  /** Forbidden - Insufficient permissions */
  FORBIDDEN: 403,
  /** Not Found - Ticket or resource not found */
  NOT_FOUND: 404,
  /** Conflict - Ticket already used or expired */
  CONFLICT: 409,
  /** Too Many Requests - Rate limit exceeded */
  TOO_MANY_REQUESTS: 429,
  /** Internal Server Error - Action execution failed */
  INTERNAL_SERVER_ERROR: 500,
} as const;

/**
 * QR response messages for successful operations
 */
export const QR_SUCCESS_MESSAGES = {
  TICKET_CREATED: "QR ticket created successfully",
  TICKET_SCANNED: "QR ticket scanned successfully",
  TICKET_APPROVED: "QR ticket approved successfully",
  TICKET_REJECTED: "QR ticket rejected successfully",
  GRANT_EXCHANGED: "Grant exchanged successfully",
  ACTION_EXECUTED: "Action executed successfully",
} as const;

/**
 * QR logging constants
 */
export const QR_LOG_LEVELS = {
  DEBUG: "debug",
  INFO: "info",
  WARN: "warn",
  ERROR: "error",
} as const;

/**
 * QR monitoring and metrics constants
 */
export const QR_METRICS = {
  /** Metric name for ticket creation */
  TICKET_CREATION: "qr.ticket.creation",
  /** Metric name for ticket scanning */
  TICKET_SCANNING: "qr.ticket.scanning",
  /** Metric name for ticket approval */
  TICKET_APPROVAL: "qr.ticket.approval",
  /** Metric name for grant exchange */
  GRANT_EXCHANGE: "qr.grant.exchange",
  /** Metric name for action execution */
  ACTION_EXECUTION: "qr.action.execution",
  /** Metric name for WebSocket connections */
  WS_CONNECTIONS: "qr.websocket.connections",
  /** Metric name for polling requests */
  POLLING: "qr.polling.requests",
} as const;

/**
 * QR polling configuration
 */
export const QR_POLLING_CONFIG = {
  /** Default short-poll interval in milliseconds */
  SHORT_POLL_INTERVAL_MS: 2000,
  /** Default long-poll timeout in milliseconds */
  LONG_POLL_TIMEOUT_MS: 25000,
  /** Rate limit window for polling in seconds */
  RATE_LIMIT_WINDOW_SEC: 2,
  /** Default delivery code TTL in seconds (same as grant TTL) */
  DELIVERY_CODE_TTL_SEC: 30,
} as const;

/**
 * QR Action Types - Defines the different types of actions that can be performed via QR codes
 */
export const QR_ACTION_TYPES = {
  LOGIN: "LOGIN",
  ADD_FRIEND: "ADD_FRIEND",
  JOIN_ORG: "JOIN_ORG",
  PAIR: "PAIR",
} as const;

/**
 * QR Ticket Status - Represents the current state of a QR ticket in its lifecycle
 */
export const QR_TICKET_STATUSES = {
  PENDING: "PENDING", // The ticket is waiting to be scanned
  SCANNED: "SCANNED",
  APPROVED: "APPROVED", // The ticket has been approved by the user
  REJECTED: "REJECTED", // The ticket has been rejected by the user
  EXPIRED: "EXPIRED", // The ticket has expired
  USED: "USED", // The ticket has been used
} as const;

/**
 * QR Ticket Interface - Represents a QR ticket with all its properties and metadata
 */
export interface QrTicket {
  /** Unique identifier for the ticket */
  tid: string;
  /** Type of action this ticket represents */
  type: QrActionType;
  /** Current status of the ticket */
  status: QrTicketStatus;
  /** PKCE code challenge (base64url encoded SHA256 hash of code verifier) */
  codeChallenge: string;
  /** Optional web session identifier to bind the ticket to a specific browser session */
  webSessionId?: string;
  /** Additional data specific to the action type */
  payload?: Record<string, any>;
  /** User ID who created the ticket (if applicable) */
  createdBy?: string;
  /** User ID who scanned the QR code */
  scannedBy?: string;
  /** User ID who approved the action */
  approvedBy?: string;
  /** Timestamp when the ticket was created (Unix timestamp in milliseconds) */
  createdAt: number;
  /** Timestamp when the QR was scanned (Unix timestamp in milliseconds) */
  scannedAt?: number;
  /** Timestamp when the action was approved (Unix timestamp in milliseconds) */
  approvedAt?: number;
  /** Timestamp when the ticket expires (Unix timestamp in milliseconds) */
  expiresAt: number;
  /** Version number for ETag support (increments on status changes) */
  version: number;
}

/**
 * QR Grant Interface - Represents a short-lived grant token for exchanging QR approval to JWT
 */
export interface QrGrant {
  /** The ticket ID this grant is associated with */
  tid: string;
  /** Type of action that was approved */
  type: QrActionType;
  /** Web session ID that requested the action */
  webSessionId?: string;
  /** User ID who approved the action */
  userId: string;
  /** Timestamp when the grant was created (Unix timestamp in milliseconds) */
  createdAt: number;
  /** Timestamp when the grant expires (Unix timestamp in milliseconds) */
  expiresAt: number;
}

/**
 * QR Delivery Code Interface - Represents a one-time delivery code for polling-based grant exchange
 */
export interface QrDeliveryCode {
  /** The delivery code (base64url encoded random string) */
  deliveryCode: string;
  /** The ticket ID this delivery code is associated with */
  tid: string;
  /** Web session ID that can use this delivery code */
  webSessionId: string;
  /** Timestamp when the delivery code was created (Unix timestamp in milliseconds) */
  createdAt: number;
  /** Timestamp when the delivery code expires (Unix timestamp in milliseconds) */
  expiresAt: number;
}

/**
 * QR Ticket Preview - Safe preview data returned to mobile clients (no sensitive information)
 */
export interface QrTicketPreview {
  /** Type of action this ticket represents */
  type: QrActionType;
  /** Safe preview of payload data (sanitized) */
  payloadPreview?: Record<string, any>;
  /** Current status of the ticket */
  status: QrTicketStatus;
  /** Whether the ticket is expired */
  isExpired: boolean;
}

/**
 * QR Status Event - WebSocket event payload for status updates
 */
export interface QrStatusEvent {
  /** The ticket ID this status update is for */
  tid: string;
  /** New status of the ticket */
  status: QrTicketStatus;
  /** Optional message describing the status change */
  message?: string;
  /** Timestamp of the status change (Unix timestamp in milliseconds) */
  timestamp: number;
}

/**
 * QR Deep Link Options - Configuration for generating deep links
 */
export interface QrDeepLinkOptions {
  /** Base URL for the deep link */
  baseUrl?: string;
  /** Custom scheme for app deep links */
  scheme?: string;
  /** Whether to use HTTPS fallback if app is not installed */
  useHttpsFallback?: boolean;
  /** Custom path for the QR handler */
  path?: string;
}

// Type definitions for better TypeScript support
export type QrActionType =
  (typeof QR_ACTION_TYPES)[keyof typeof QR_ACTION_TYPES];

export type QrTicketStatus =
  (typeof QR_TICKET_STATUSES)[keyof typeof QR_TICKET_STATUSES];
