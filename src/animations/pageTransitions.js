import gsap from 'gsap';

/**
 * Page Enter Animation
 */
export const pageEnter = (container) => {
  if (!container) return;
  window.scrollTo(0, 0);

  return gsap.fromTo(
    container,
    { opacity: 0, y: 15 },
    { opacity: 1, y: 0, duration: 0.6, ease: 'power2.out' }
  );
};

/**
 * Page Exit Animation (Promise-based for clean routing transition)
 */
export const pageExit = (container) => {
  if (!container) return Promise.resolve();

  return new Promise((resolve) => {
    gsap.to(container, {
      opacity: 0,
      y: -10,
      duration: 0.35,
      ease: 'power2.in',
      onComplete: resolve
    });
  });
};
