import { request } from "./api";

export const integrationApi = {
  list: () => request("/integrations"),
  update: (id, data) =>
    request(`/integrations/${id}`, { method: "PUT", body: JSON.stringify(data) }),
  connect: (provider, credentials) =>
    request("/integrations/connect", { method: "POST", body: JSON.stringify({ provider, credentials }) }),
};
