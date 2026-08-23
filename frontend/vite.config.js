import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000,
    proxy: {
      "/api": {
        target: "http://localhost:8000",
        changeOrigin: true,
      },
    },
    hmr: {
      protocol: 'wss',
      host: 'jump-balance-aftermost.ngrok-free.dev',
      port: 443
    },
  },
  test: {
    globals: true,
    environment: "jsdom",
  },
});