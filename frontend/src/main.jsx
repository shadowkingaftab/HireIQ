import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { QueryClientProvider } from "@tanstack/react-query";

// Self-hosted variable fonts
import "@fontsource-variable/inter";
import "@fontsource-variable/jetbrains-mono";
import "@fontsource/instrument-serif/400.css";
import "@fontsource/instrument-serif/400-italic.css";

// Global styles — single entry chain, no duplicate CSS entry points
import "./styles/animations.css";
import "./styles/accessibility.css";
import "./styles/globals.css";

import App from "./App";
import ErrorBoundary from "./components/ErrorBoundary";
import ToastHost from "./components/ui/ToastHost";
import { queryClient } from "./lib/queryClient";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <ErrorBoundary>
      <QueryClientProvider client={queryClient}>
        <BrowserRouter>
          <App />
          <ToastHost />
        </BrowserRouter>
      </QueryClientProvider>
    </ErrorBoundary>
  </React.StrictMode>
);
