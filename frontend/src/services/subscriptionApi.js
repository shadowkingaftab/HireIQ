import { request } from "./api";

export const subscriptionApi = {
  plans: () => request("/subscriptions/plans"),
  current: () => request("/subscriptions/current"),
  update: (data) => request("/subscriptions/current", { method: "PUT", body: JSON.stringify(data) }),
  cancel: () => request("/subscriptions/current/cancel", { method: "POST" }),
};
