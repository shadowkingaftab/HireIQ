/**
 * Motion tokens. Values mirror tailwind.config.js `animation` entries and the
 * keyframes in src/styles/animations.css. All motion is disabled under
 * prefers-reduced-motion via globals.css.
 */

export const duration = {
  instant: 120,
  fast: 200,
  base: 240,
  slow: 280,
  deliberate: 450,
};

export const easing = {
  standard: "cubic-bezier(0.22, 1, 0.36, 1)", // ease-out-quint-ish, default
  entrance: "cubic-bezier(0.16, 1, 0.3, 1)", // decelerate for entrances
  exit: "cubic-bezier(0.4, 0, 1, 1)", // accelerate for exits
};

export function fadeIn() {
  return {
    initial: { opacity: 0, transform: "translateY(10px)" },
    animate: { opacity: 1, transform: "translateY(0)" },
    transition: { duration: duration.slow / 1000, ease: easing.standard },
  };
}
