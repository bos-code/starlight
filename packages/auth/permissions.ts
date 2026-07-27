// packages/auth/permissions.ts
// Defines all permission strings and the role → permission mapping.
// This is the single source of truth for authorization.
// ALL permission checks on the server must use `can()`.

export type Permission =
  // Products
  | 'products:read'
  | 'products:create'
  | 'products:update'
  | 'products:publish'
  | 'products:delete'
  // Categories
  | 'categories:read'
  | 'categories:create'
  | 'categories:update'
  | 'categories:delete'
  // Brands
  | 'brands:read'
  | 'brands:create'
  | 'brands:update'
  | 'brands:delete'
  // Media & Documents
  | 'media:upload'
  | 'media:delete'
  | 'documents:upload'
  | 'documents:delete'
  // Quotes
  | 'quotes:read'
  | 'quotes:assign'
  | 'quotes:price'
  | 'quotes:note'
  | 'quotes:status'
  | 'quotes:close'
  | 'quotes:export'
  // Dealer Enquiries
  | 'dealer:read'
  | 'dealer:respond'
  // Feedback
  | 'feedback:read'
  | 'feedback:triage'
  | 'feedback:resolve'
  // Staff Management (Super Admin only)
  | 'staff:read'
  | 'staff:create'
  | 'staff:disable'
  | 'staff:enable'
  | 'staff:change-role'
  // Settings
  | 'settings:read'
  | 'settings:update'
  // Audit
  | 'audit:read'
  // Security
  | 'security:read'
  | 'security:respond'
  | 'security:emergency';

type RolePermissions = {
  SUPER_ADMIN: Permission[];
  CATALOGUE_ADMIN: Permission[];
  SALES_ADMIN: Permission[];
};

const CATALOGUE_ADMIN_PERMISSIONS: Permission[] = [
  'products:read',
  'products:create',
  'products:update',
  'products:publish',
  'products:delete',
  'categories:read',
  'categories:create',
  'categories:update',
  'categories:delete',
  'brands:read',
  'brands:create',
  'brands:update',
  'brands:delete',
  'media:upload',
  'media:delete',
  'documents:upload',
  'documents:delete',
];

const SALES_ADMIN_PERMISSIONS: Permission[] = [
  'products:read',
  'categories:read',
  'brands:read',
  'quotes:read',
  'quotes:assign',
  'quotes:price',
  'quotes:note',
  'quotes:status',
  'quotes:close',
  'quotes:export',
  'dealer:read',
  'dealer:respond',
  'feedback:read',
  'feedback:triage',
  'feedback:resolve',
];

const SUPER_ADMIN_PERMISSIONS: Permission[] = [
  ...CATALOGUE_ADMIN_PERMISSIONS,
  ...SALES_ADMIN_PERMISSIONS,
  'staff:read',
  'staff:create',
  'staff:disable',
  'staff:enable',
  'staff:change-role',
  'settings:read',
  'settings:update',
  'audit:read',
  'security:read',
  'security:respond',
  'security:emergency',
];

const ROLE_PERMISSIONS: RolePermissions = {
  SUPER_ADMIN: SUPER_ADMIN_PERMISSIONS,
  CATALOGUE_ADMIN: CATALOGUE_ADMIN_PERMISSIONS,
  SALES_ADMIN: SALES_ADMIN_PERMISSIONS,
};

/**
 * Checks whether a user's role grants the given permission.
 * Always call this server-side — never trust the client.
 */
export function can(
  role: keyof RolePermissions,
  permission: Permission,
): boolean {
  return ROLE_PERMISSIONS[role]?.includes(permission) ?? false;
}

/**
 * Returns all permissions for a given role.
 */
export function permissionsForRole(role: keyof RolePermissions): Permission[] {
  return ROLE_PERMISSIONS[role] ?? [];
}
