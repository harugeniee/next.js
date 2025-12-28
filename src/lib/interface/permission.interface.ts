import { BaseEntityCustom } from "./base.interface";

/**
 * Role entity representing Discord-style roles with permission bitfields
 */
export interface Role extends BaseEntityCustom {
  /**
   * Unique name of the role
   */
  name: string;

  /**
   * Optional description of the role's purpose
   */
  description?: string;

  /**
   * Allow permissions bitmask stored as string for safe BigInt handling
   * Contains bitwise permissions that this role allows
   */
  allowPermissions?: string;

  /**
   * Deny permissions bitmask stored as string for safe BigInt handling
   * Contains bitwise permissions that this role explicitly denies
   */
  denyPermissions?: string;

  /**
   * Type of scope this role applies to (e.g., 'organization', 'team', 'project')
   * If null, role is global
   */
  scopeType?: string;

  /**
   * ID of the scope resource this role applies to
   * If null, role is global
   */
  scopeId?: string;

  /**
   * Position of the role in the hierarchy (higher = more permissions)
   * Used for role precedence in permission calculations
   */
  position: number;

  /**
   * Color for the role (hex format, optional)
   */
  color?: string;

  /**
   * Whether this role is mentionable by users
   */
  mentionable: boolean;

  /**
   * Whether this role is managed by an external service (like integrations)
   */
  managed: boolean;

  /**
   * Icon URL for the role (optional)
   */
  icon?: string;

  /**
   * Unicode emoji for the role (optional)
   */
  unicodeEmoji?: string;

  /**
   * Tags associated with this role (stored as JSON)
   */
  tags?: Record<string, unknown>;

  /**
   * User roles that reference this role
   */
  userRoles?: UserRole[];
}

/**
 * UserRole entity representing the assignment of roles to users
 */
export interface UserRole extends BaseEntityCustom {
  /**
   * ID of the user this role assignment belongs to
   */
  userId: string;

  /**
   * ID of the role assigned to the user
   */
  roleId: string;

  /**
   * The role entity this assignment references
   */
  role?: Role;

  /**
   * Optional reason for role assignment
   */
  reason?: string;

  /**
   * ID of the user who assigned this role (for audit purposes)
   */
  assignedBy?: string;

  /**
   * When this role assignment expires (optional)
   */
  expiresAt?: Date;

  /**
   * Whether this role assignment is temporary
   */
  isTemporary: boolean;
}

/**
 * DTO for creating a new role
 */
export interface CreateRoleDto {
  /**
   * Unique name of the role
   */
  name: string;

  /**
   * Description of the role purpose
   */
  description?: string;

  /**
   * Permission bitmask as string (will be converted to BigInt)
   */
  permissions?: string;

  /**
   * Position of the role in hierarchy (higher = more permissions)
   */
  position?: number;

  /**
   * Hex color for the role
   */
  color?: string;

  /**
   * Whether this role is mentionable by users
   */
  mentionable?: boolean;

  /**
   * Whether this role is managed by an external service
   */
  managed?: boolean;

  /**
   * Icon URL for the role
   */
  icon?: string;

  /**
   * Unicode emoji for the role
   */
  unicodeEmoji?: string;
}

/**
 * DTO for updating an existing role
 * All fields are optional since this is a partial update
 */
export type UpdateRoleDto = Partial<CreateRoleDto>;

/**
 * DTO for assigning a role to a user
 */
export interface AssignRoleDto {
  /**
   * ID of the user to assign the role to
   */
  userId: string;

  /**
   * ID of the role to assign
   */
  roleId: string;

  /**
   * Reason for role assignment (for audit purposes)
   */
  reason?: string;

  /**
   * ID of the user who is assigning this role
   */
  assignedBy?: string;

  /**
   * Whether this role assignment is temporary
   */
  isTemporary?: boolean;

  /**
   * Expiration date for temporary role assignment (ISO string)
   */
  expiresAt?: string;
}

/**
 * Effective permissions result
 * Contains both allow and deny bitfields
 */
export interface EffectivePermissions {
  /**
   * Combined allow permissions bitfield
   */
  allowPermissions: bigint;

  /**
   * Combined deny permissions bitfield
   */
  denyPermissions: bigint;

  /**
   * Boolean map of individual permissions for easy checking
   * Key: PermissionKey, Value: boolean (true if allowed, false if denied or not allowed)
   */
  permissions: Record<string, boolean>;

  /**
   * Detailed permission map showing allow/deny status
   * Key: PermissionKey, Value: 'allow' | 'deny' | 'undefined'
   */
  permissionDetails: Record<string, "allow" | "deny" | "undefined">;
}
