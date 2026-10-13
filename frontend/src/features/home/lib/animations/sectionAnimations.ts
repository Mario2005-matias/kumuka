import type {
  ScrollAnimation,
  ScrollAnimationOptions,
} from '../../hooks/useScrollAnimation';
import { defaultScrollAnimationOptions } from '../../hooks/useScrollAnimation';

export const revealSection: ScrollAnimation = (gsap, scope, options) => {
  const targets = scope.querySelectorAll<HTMLElement>('[data-reveal]');
  if (!targets.length) return;

  gsap.from(targets, {
    immediateRender: false,
    autoAlpha: 0,
    y: 22,
    stagger: 0.1,
    duration: 0.6,
    clearProps: 'opacity,visibility,transform',
    scrollTrigger: {
      trigger: scope,
      start: options.start,
      end: options.end,
      scrub: options.scrub,
      once: options.scrub ? false : options.once,
    },
  });
};

export const animateJourney: ScrollAnimation<HTMLElement> = (
  gsap,
  scope,
  options: ScrollAnimationOptions,
) => {
  const list = scope.querySelector<HTMLOListElement>('[data-journey-list]');
  const progress = scope.querySelector<HTMLElement>('[data-journey-progress]');
  if (!list || !progress) return;

  gsap.to(progress, {
    scaleY: 1,
    ease: 'none',
    scrollTrigger: {
      trigger: list,
      start: 'top center',
      end: 'bottom center',
      scrub: true,
    },
  });

  list.querySelectorAll<HTMLElement>('[data-journey-card]').forEach((card, index) => {
    const number = card.querySelector<HTMLElement>('[data-step-number]');
    const icon = card.querySelector<HTMLElement>('[data-step-icon]');
    const timeline = gsap.timeline({
      scrollTrigger: {
        trigger: card,
        start: options.start,
        once: true,
        onEnter: () => card.classList.add('is-active'),
      },
    });

    timeline.from(card, {
      immediateRender: false,
      autoAlpha: 0,
      x: index % 2 === 0 ? -20 : 20,
      y: 12,
      duration: 0.6,
    });

    if (icon) {
      timeline.fromTo(
        icon,
        { scale: 1 },
        { scale: 1.1, duration: 0.18, yoyo: true, repeat: 1 },
        '<',
      );
    }

    if (number) {
      const counter = { value: 0 };
      timeline.to(
        counter,
        {
          value: index + 1,
          duration: 0.45,
          snap: { value: 1 },
          onUpdate: () => {
            number.textContent = String(Math.round(counter.value)).padStart(2, '0');
          },
        },
        '<',
      );
    }
  });
};

export const defaultJourneyOptions: ScrollAnimationOptions =
  defaultScrollAnimationOptions;
