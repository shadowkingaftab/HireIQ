/**
 * Typography system.
 * Inter Variable carries UI/body/display; JetBrains Mono Variable carries
 * scores, IDs, evidence metadata, and technical values. Both are self-hosted
 * via @fontsource-variable packages imported in main.jsx; system fallbacks
 * mirror tailwind.config.js.
 */

export const fontFamily = {
  sans: "'Inter Variable', Inter, ui-sans-serif, system-ui, -apple-system, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif",
  mono: "'JetBrains Mono Variable', 'JetBrains Mono', ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', monospace",
};

/**
 * Scale keys intentionally match Tailwind fontSize keys in
 * tailwind.config.js so JS consumers and utility classes stay aligned.
 */
export const typeScale = {
  "display-xl": { size: "3.5rem", lineHeight: 1.04, tracking: "-0.032em", weight: 700 },
  "display-lg": { size: "2.75rem", lineHeight: 1.08, tracking: "-0.028em", weight: 700 },
  display: { size: "2.25rem", lineHeight: 1.12, tracking: "-0.024em", weight: 650 },
  page: { size: "1.75rem", lineHeight: 1.18, tracking: "-0.02em", weight: 640 },
  "page-sm": { size: "1.4375rem", lineHeight: 1.22, tracking: "-0.018em", weight: 620 },
  section: { size: "1.25rem", lineHeight: 1.32, tracking: "-0.014em", weight: 600 },
  "section-sm": { size: "1.0625rem", lineHeight: 1.38, tracking: "-0.01em", weight: 600 },
  body: { size: "1rem", lineHeight: 1.6, tracking: "0em", weight: 420 },
  "body-sm": { size: "0.875rem", lineHeight: 1.55, tracking: "0em", weight: 420 },
  meta: { size: "0.8125rem", lineHeight: 1.45, tracking: "0em", weight: 450 },
  micro: { size: "0.6875rem", lineHeight: 1.4, tracking: "0em", weight: 500 },
};

export const textStyles = {
  heading: { fontFamily: fontFamily.sans, fontWeight: 600, letterSpacing: "-0.02em" },
  body: { fontFamily: fontFamily.sans, fontWeight: 420, lineHeight: 1.6 },
  meta: { fontFamily: fontFamily.mono, fontSize: "0.8125rem", fontWeight: 450, letterSpacing: "-0.01em" },
};
