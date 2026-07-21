export interface AuthUser {
  id: string;
  username: string;
  email: string;
  phone: string | null;
  role: "SUPER_ADMIN" | "ADMIN" | "STAFF" | "CUSTOMER";
  permissions: string[]; // ["*"] for admins
  organizationId: string;
}

export function hasPermission(user: AuthUser | null, key: string): boolean {
  if (!user) return false;
  return user.permissions.includes("*") || user.permissions.includes(key);
}
