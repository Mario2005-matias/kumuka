import { useCallback, useRef } from 'react';
import {
  sectionRevealEnd,
  sectionRevealStart,
} from '../lib/animations/scrollTriggers';
import type { GsapSetup } from './useGsapContext';
import { useGsapContext } from './useGsapContext';
import { usePrefersReducedMotion } from './usePrefersReducedMotion';

export type ScrollAnimationOptions = {
  start: string;
  end: string;
  scrub: boolean | number;
  once: boolean;
};

export const defaultScrollAnimationOptions: ScrollAnimationOptions = {
  start: sectionRevealStart,
  end: sectionRevealEnd,
  scrub: false,
  once: true,
};

export type ScrollAnimation<T extends HTMLElement = HTMLElement> = (
  gsap: Parameters<GsapSetup<T>>[0],
  scope: T,
  options: ScrollAnimationOptions,
) => void;

export function useScrollAnimation<T extends HTMLElement = HTMLElement>(
  animation: ScrollAnimation<T>,
  options = defaultScrollAnimationOptions,
) {
  const scopeRef = useRef<T>(null);
  const prefersReducedMotion = usePrefersReducedMotion();
  const setup = useCallback<GsapSetup<T>>(
    (gsap, scope) => animation(gsap, scope, options),
    [animation, options],
  );

  useGsapContext(scopeRef, setup, !prefersReducedMotion);
  return scopeRef;
}
