export const subscriptionsApi = {
  list: () => fetch("/api/v1/subscriptions").then((r) => r.json()),
  create: (data) => fetch("/api/v1/subscriptions", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(data) }).then((r) => r.json()),
};
