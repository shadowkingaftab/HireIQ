/**
 * Accessibility tokens. The ring color tracks the theme via --ph-ring in
 * globals.css; these are static fallbacks for JS-driven styles.
 */

export const focusRing = "0 0 0 3px hsl(239 84% 67% / 0.4)";
export const focusRingStrong = "0 0 0 2px hsl(var(--ph-canvas)), 0 0 0 5px hsl(239 84% 67% / 0.55)";

export function screenReaderOnly(children) {
  return `<span class="sr-only">${children}</span>`;
}
