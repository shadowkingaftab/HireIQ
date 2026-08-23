/** @type {import('tailwindcss').Config} */

/**
 * ProofHire design tokens.
 * Single source of truth for theme values consumed by globals.css (CSS
 * variables) and mirrored in src/design-system/*.js for programmatic use.
 *
 * Theme strategy: CSS variables hold HSL triplets; :root carries light-mode
 * values and .dark overrides them. Dark is the default experience and is set
 * pre-paint by an inline script in index.html.
 */
export default {
  darkMode: "class",
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        // Canvas + layered surfaces
        canvas: "hsl(var(--ph-canvas) / <alpha-value>)",
        surface: {
          1: "hsl(var(--ph-surface-1) / <alpha-value>)",
          2: "hsl(var(--ph-surface-2) / <alpha-value>)",
          3: "hsl(var(--ph-surface-3) / <alpha-value>)",
          inverse: "hsl(var(--ph-surface-inverse) / <alpha-value>)",
        },
        line: {
          subtle: "hsl(var(--ph-line-subtle) / <alpha-value>)",
          strong: "hsl(var(--ph-line-strong) / <alpha-value>)",
        },
        // Text hierarchy
        ink: {
          DEFAULT: "hsl(var(--ph-ink-hi) / <alpha-value>)",
          hi: "hsl(var(--ph-ink-hi) / <alpha-value>)",
          med: "hsl(var(--ph-ink-med) / <alpha-value>)",
          muted: "hsl(var(--ph-ink-muted) / <alpha-value>)",
          faint: "hsl(var(--ph-ink-faint) / <alpha-value>)",
          inverse: "hsl(var(--ph-ink-inverse) / <alpha-value>)",
        },
        // Intelligence accent (indigo)
        intel: {
          DEFAULT: "hsl(var(--ph-intel) / <alpha-value>)",
          firm: "hsl(var(--ph-intel-firm) / <alpha-value>)",
          soft: "hsl(var(--ph-intel-soft) / <alpha-value>)",
          contrast: "hsl(var(--ph-intel-contrast) / <alpha-value>)",
        },
        // Signal cyan — data/score highlights, used sparingly
        signal: {
          DEFAULT: "hsl(var(--ph-signal) / <alpha-value>)",
          soft: "hsl(var(--ph-signal-soft) / <alpha-value>)",
        },
        // Verification signals
        verified: {
          DEFAULT: "hsl(var(--ph-verified) / <alpha-value>)",
          soft: "hsl(var(--ph-verified-soft) / <alpha-value>)",
        },
        // Uncertainty signals
        caution: {
          DEFAULT: "hsl(var(--ph-caution) / <alpha-value>)",
          soft: "hsl(var(--ph-caution-soft) / <alpha-value>)",
        },
        danger: {
          DEFAULT: "hsl(var(--ph-danger) / <alpha-value>)",
          soft: "hsl(var(--ph-danger-soft) / <alpha-value>)",
        },
      },
      fontFamily: {
        sans: [
          "Inter Variable",
          "Inter",
          "ui-sans-serif",
          "system-ui",
          "-apple-system",
          "BlinkMacSystemFont",
          "Segoe UI",
          "Roboto",
          "Helvetica Neue",
          "Arial",
          "sans-serif",
        ],
        mono: [
          "JetBrains Mono Variable",
          "JetBrains Mono",
          "ui-monospace",
          "SFMono-Regular",
          "Menlo",
          "Monaco",
          "Consolas",
          "Liberation Mono",
          "monospace",
        ],
      },
      fontSize: {
        // Display scale — marketing/hero surfaces
        "display-xl": ["3.5rem", { lineHeight: "1.04", letterSpacing: "-0.032em", fontWeight: "700" }],
        "display-lg": ["2.75rem", { lineHeight: "1.08", letterSpacing: "-0.028em", fontWeight: "700" }],
        display: ["2.25rem", { lineHeight: "1.12", letterSpacing: "-0.024em", fontWeight: "650" }],
        // Page scale — screen titles
        page: ["1.75rem", { lineHeight: "1.18", letterSpacing: "-0.02em", fontWeight: "640" }],
        "page-sm": ["1.4375rem", { lineHeight: "1.22", letterSpacing: "-0.018em", fontWeight: "620" }],
        // Section scale — card/group headings
        section: ["1.25rem", { lineHeight: "1.32", letterSpacing: "-0.014em", fontWeight: "600" }],
        "section-sm": ["1.0625rem", { lineHeight: "1.38", letterSpacing: "-0.01em", fontWeight: "600" }],
        // Body scale (base 16px remains untouched)
        "body-lg": ["1.125rem", { lineHeight: "1.62", letterSpacing: "0em", fontWeight: "420" }],
        body: ["1rem", { lineHeight: "1.6", letterSpacing: "0em", fontWeight: "420" }],
        "body-sm": ["0.875rem", { lineHeight: "1.55", fontWeight: "420" }],
        // Metadata scale — evidence IDs, timestamps, captions
        meta: ["0.8125rem", { lineHeight: "1.45", fontWeight: "450" }],
        micro: ["0.6875rem", { lineHeight: "1.4", fontWeight: "500" }],
      },
      letterSpacing: {
        caps: "0.08em",
      },
      borderRadius: {
        panel: "0.875rem",
        card: "1rem",
      },
      boxShadow: {
        "card": "var(--ph-shadow-card)",
        "raised": "var(--ph-shadow-raised)",
        "overlay": "var(--ph-shadow-overlay)",
        "focus": "var(--ph-shadow-focus)",
      },
      // Keyframes live in src/styles/animations.css (ph-* names)
      animation: {
        "fade-in": "ph-fade-in 240ms ease-out both",
        "fade-up": "ph-fade-up 280ms cubic-bezier(0.22, 1, 0.36, 1) both",
        "scale-in": "ph-scale-in 200ms cubic-bezier(0.22, 1, 0.36, 1) both",
        "slide-in-right": "ph-slide-in-right 260ms cubic-bezier(0.16, 1, 0.3, 1) both",
        "slide-in-left": "ph-slide-in-left 260ms cubic-bezier(0.16, 1, 0.3, 1) both",
      },
      zIndex: {
        raised: "10",
        sticky: "20",
        overlay: "40",
        toast: "50",
        modal: "60",
      },
    },
  },
  plugins: [],
};
