import { create } from "zustand";

const TOKEN_KEY = "token";
const USER_KEY = "user";

function readStoredUser() {
  try {
    const raw = localStorage.getItem(USER_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

/**
 * Single frontend source of truth for auth state.
 * Token format/key is unchanged ("token" in localStorage), so
 * services/api.js and hooks/useApi.js remain compatible.
 */
export const useAuthStore = create((set) => ({
  user: readStoredUser(),
  token: localStorage.getItem(TOKEN_KEY),
  setUser: (user) => {
    if (user) {
      try {
        localStorage.setItem(USER_KEY, JSON.stringify(user));
      } catch {
        // storage full/unavailable — session still valid in memory
      }
    } else {
      localStorage.removeItem(USER_KEY);
    }
    set({ user });
  },
  setToken: (token) => {
    if (token) {
      localStorage.setItem(TOKEN_KEY, token);
    } else {
      localStorage.removeItem(TOKEN_KEY);
    }
    set({ token });
  },
  logout: () => {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
    set({ user: null, token: null });
  },
}));
