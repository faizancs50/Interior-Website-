import gsap from 'gsap';

/**
 * Premium Hero Entrance Animation
 * - Slow subtle scale of hero image (1.08 -> 1)
 * - Line-by-line heading reveal
 * - Eyebrow, subtitle, and CTA button staggered upward fade
 */
export const animateHero = ({
  imageRef,
  eyebrowRef,
  headingLinesRef,
  descRef,
  buttonsRef,
  metaRef
}) => {
  const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });

  // 1. Subtle image scale and gentle continuous ambient motion
  if (imageRef?.current) {
    tl.fromTo(
      imageRef.current,
      { scale: 1.12, opacity: 0.8 },
      { scale: 1.0, opacity: 1, duration: 2.2, ease: 'power2.out' },
      0
    );
  }

  // 2. Eyebrow reveal
  if (eyebrowRef?.current) {
    tl.fromTo(
      eyebrowRef.current,
      { y: 20, opacity: 0 },
      { y: 0, opacity: 1, duration: 1.0 },
      0.3
    );
  }

  // 3. Heading lines reveal
  if (headingLinesRef?.current && headingLinesRef.current.length > 0) {
    tl.fromTo(
      headingLinesRef.current,
      { y: '100%', opacity: 0 },
      { y: '0%', opacity: 1, duration: 1.2, stagger: 0.15, ease: 'power4.out' },
      0.4
    );
  }

  // 4. Description fade up
  if (descRef?.current) {
    tl.fromTo(
      descRef.current,
      { y: 25, opacity: 0 },
      { y: 0, opacity: 1, duration: 1.0 },
      0.8
    );
  }

  // 5. Buttons fade up
  if (buttonsRef?.current) {
    tl.fromTo(
      buttonsRef.current.children || buttonsRef.current,
      { y: 20, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.9, stagger: 0.12 },
      0.95
    );
  }

  // 6. Metadata and scroll indicator
  if (metaRef?.current) {
    tl.fromTo(
      metaRef.current,
      { opacity: 0 },
      { opacity: 1, duration: 1.0 },
      1.1
    );
  }

  return tl;
};
