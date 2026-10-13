import type { GsapSetup } from '../../hooks/useGsapContext';

export const animateHero: GsapSetup<HTMLElement> = (gsap, scope) => {
  const timeline = gsap.timeline();

  timeline
    .from(scope.querySelector('[data-hero-badge]'), {
      autoAlpha: 0,
      y: -14,
      duration: 0.5,
    })
    .from(
      scope.querySelectorAll('[data-hero-word]'),
      {
        autoAlpha: 0,
        y: 24,
        stagger: 0.08,
        duration: 0.7,
      },
      '-=0.16',
    )
    .from(
      scope.querySelector('[data-hero-copy]'),
      { autoAlpha: 0, y: 16, duration: 0.55 },
      '-=0.25',
    )
    .from(
      scope.querySelector('[data-hero-actions]'),
      { autoAlpha: 0, y: 12, scale: 0.98, duration: 0.5 },
      '-=0.18',
    )
    .from(
      scope.querySelectorAll('[data-hero-journey-step]'),
      { autoAlpha: 0, x: -12, stagger: 0.09, duration: 0.45 },
      '-=0.12',
    )
    .from(
      scope.querySelector('[data-hero-scroll]'),
      { autoAlpha: 0, y: -6, duration: 0.4 },
      '-=0.08',
    );
};
