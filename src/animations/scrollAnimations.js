import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

/**
 * Fade up an element as it enters viewport
 */
export const fadeUp = (element, options = {}) => {
  if (!element) return null;
  const { delay = 0, duration = 1.0, y = 40, trigger = element, start = 'top 85%' } = options;

  return gsap.fromTo(
    element,
    { y, opacity: 0 },
    {
      y: 0,
      opacity: 1,
      duration,
      delay,
      ease: 'power3.out',
      scrollTrigger: {
        trigger,
        start,
        toggleActions: 'play none none none',
        once: true
      }
    }
  );
};

/**
 * Stagger multiple elements upward
 */
export const staggerFadeUp = (elements, options = {}) => {
  if (!elements || elements.length === 0) return null;
  const {
    stagger = 0.15,
    duration = 0.9,
    y = 35,
    trigger = elements[0],
    start = 'top 85%'
  } = options;

  return gsap.fromTo(
    elements,
    { y, opacity: 0 },
    {
      y: 0,
      opacity: 1,
      duration,
      stagger,
      ease: 'power3.out',
      scrollTrigger: {
        trigger,
        start,
        toggleActions: 'play none none none',
        once: true
      }
    }
  );
};

/**
 * Editorial Image Reveal:
 * Scales image from 1.08 -> 1 with smooth clip-path or subtle container reveal
 */
export const revealImage = (container, image, options = {}) => {
  if (!container || !image) return null;
  const { start = 'top 80%', duration = 1.4 } = options;

  const tl = gsap.timeline({
    scrollTrigger: {
      trigger: container,
      start,
      once: true
    }
  });

  tl.fromTo(
    image,
    { scale: 1.12 },
    { scale: 1.0, duration, ease: 'power2.out' },
    0
  );

  return tl;
};

/**
 * Subtle Parallax on Scroll
 */
export const parallaxImage = (image, container, distance = 40) => {
  if (!image || !container) return null;

  return gsap.fromTo(
    image,
    { y: -distance },
    {
      y: distance,
      ease: 'none',
      scrollTrigger: {
        trigger: container,
        start: 'top bottom',
        end: 'bottom top',
        scrub: 1.2
      }
    }
  );
};

/**
 * Editorial Line/Headline reveal
 */
export const textReveal = (lines, trigger, options = {}) => {
  if (!lines || lines.length === 0) return null;
  const { start = 'top 85%', stagger = 0.1 } = options;

  return gsap.fromTo(
    lines,
    { y: '100%', opacity: 0 },
    {
      y: '0%',
      opacity: 1,
      duration: 1.1,
      stagger,
      ease: 'power4.out',
      scrollTrigger: {
        trigger: trigger || lines[0],
        start,
        once: true
      }
    }
  );
};
