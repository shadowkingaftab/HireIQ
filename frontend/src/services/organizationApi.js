import { request } from "./api";

export const organizationApi = {
  settings: () => request("/organizations/settings"),
  updateSettings: (data) =>
    request("/organizations/settings", { method: "PUT", body: JSON.stringify(data) }),
  members: () => request("/organizations/members"),
  invite: (data) =>
    request("/organizations/members/invite", { method: "POST", body: JSON.stringify(data) }),
};
