import { useLayoutEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import usePrefersReducedMotion from "../../hooks/usePrefersReducedMotion";

gsap.registerPlugin(ScrollTrigger);

/**
 * Scroll-reveal wrapper. Cards lift 50px and fade in as the narrative
 * scrolls, driven by GSAP ScrollTrigger (synced to Lenis globally). With
 * prefers-reduced-motion the content is simply present — no motion, no
 * hidden state, no dependency on the animation ever running.
 */
export default function Reveal({
  delay = 0,
  className = "",
  children,
  as: Tag = "div",
  ...props
}) {
  const ref = useRef(null);
  const reducedMotion = usePrefersReducedMotion();

  useLayoutEffect(() => {
    const node = ref.current;
    if (!node) return undefined;

    if (reducedMotion) {
      gsap.set(node, { clearProps: "opacity,visibility,transform" });
      return undefined;
    }

    const context = gsap.context(() => {
      gsap.fromTo(
        node,
        { y: 50, autoAlpha: 0 },
        {
          y: 0,
          autoAlpha: 1,
          duration: 0.95,
          ease: "power3.out",
          delay: delay / 1000,
          scrollTrigger: {
            trigger: node,
            start: "top 88%",
            once: true,
            invalidateOnRefresh: true,
          },
        }
      );
    }, ref);

    return () => context.revert();
  }, [delay, reducedMotion]);

  return (
    <Tag ref={ref} className={className} {...props}>
      {children}
    </Tag>
  );
}
