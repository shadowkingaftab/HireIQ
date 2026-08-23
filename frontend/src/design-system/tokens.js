/**
 * ProofHire design tokens — programmatic mirror of the CSS variables in
 * src/styles/globals.css and tailwind.config.js. Keep all three in sync.
 */

export const colors = {
  // Canvas + surfaces
  canvas: "hsl(224 50% 5%)",
  surface1: "hsl(223 42% 7%)",
  surface2: "hsl(222 38% 9%)",
  surface3: "hsl(221 34% 12%)",

  // Text hierarchy
  inkHi: "hsl(214 32% 96%)",
  inkMed: "hsl(215 20% 72%)",
  inkMuted: "hsl(217 14% 52%)",
  inkFaint: "hsl(218 12% 40%)",

  // Intelligence accent
  intel: "#6366f1",
  intelFirm: "#5457e5",
  signal: "#22d3ee",

  // Signals
  verified: "#34d399",
  caution: "#fbbf24",
  danger: "#fb7185",

  // Legacy aliases (kept for existing imports)
  primary: "#6366f1",
  success: "#34d399",
  warning: "#fbbf24",
  muted: "hsl(217 14% 52%)",
};

export const semantic = {
  accent: "intel", // intelligence / interactive
  positive: "verified", // verification, strong evidence
  uncertain: "caution", // low confidence, gaps
};

export const radius = {
  sm: "0.375rem",
  md: "0.5rem",
  lg: "0.75rem",
  panel: "0.875rem",
  card: "1rem",
  full: "9999px",
};

export const shadow = {
  card: "var(--ph-shadow-card)",
  raised: "var(--ph-shadow-raised)",
  overlay: "var(--ph-shadow-overlay)",
  focus: "var(--ph-shadow-focus)",
};

export const zIndex = {
  base: 0,
  raised: 10,
  sticky: 20,
  overlay: 40,
  toast: 50,
  modal: 60,
};

export const spacing = {
  xs: "4px",
  sm: "8px",
  md: "16px",
  lg: "24px",
  xl: "32px",
};
