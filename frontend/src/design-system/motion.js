export const motion = {
  duration: 200,
  easing: "ease-in-out",
};

export function fadeIn() {
  return {
    initial: { opacity: 0, transform: "translateY(8px)" },
    animate: { opacity: 1, transform: "translateY(0)" },
    transition: { duration: motion.duration / 1000 },
  };
}
