import { useMemo } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { API_BASE_URL } from "../utils/constants";

async function request(path, options = {}) {
  const token = localStorage.getItem("token");
  const headers = {
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...options.headers,
  };
  const res = await fetch(`${API_BASE_URL}${path}`, { ...options, headers });
  if (!res.ok) {
    const error = await res.json().catch(() => ({ message: "Request failed" }));
    throw new Error(error.message || "Request failed");
  }
  if (res.status === 204) return null;
  return res.json();
}

export function useGet(path, key) {
  return useQuery({
    queryKey: key ? [key] : [path],
    queryFn: () => request(path),
  });
}

export function usePost(path, key) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (body) => request(path, { method: "POST", body: JSON.stringify(body) }),
    onSuccess: () => {
      if (key) queryClient.invalidateQueries(key);
    },
  });
}

export function usePut(path, key) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (body) => request(path, { method: "PUT", body: JSON.stringify(body) }),
    onSuccess: () => {
      if (key) queryClient.invalidateQueries(key);
    },
  });
}

export function useDelete(path, key) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: () => request(path, { method: "DELETE" }),
    onSuccess: () => {
      if (key) queryClient.invalidateQueries(key);
    },
  });
}
