export const permissions = {
  candidate: ["profile:read", "applications:write"],
  recruiter: ["jobs:write", "candidates:read", "analytics:read"],
  admin: ["*"],
};

export function can(role, action) {
  const allowed = permissions[role] || [];
  return allowed.includes("*") || allowed.includes(action);
}
