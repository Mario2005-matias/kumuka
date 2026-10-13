import { useEffect, type RefObject } from 'react';
import { loadGsap } from '../lib/gsapConfig';

type Gsap = Awaited<ReturnType<typeof loadGsap>>;
export type GsapSetup<T extends HTMLElement = HTMLElement> = (
  gsap: Gsap,
  scope: T,
) => void;

export function useGsapContext<T extends HTMLElement>(
  scopeRef: RefObject<T | null>,
  setup: GsapSetup<T>,
  enabled = true,
) {
  useEffect(() => {
    if (!enabled) return;

    let cancelled = false;
    let revert: (() => void) | undefined;

    void loadGsap()
      .then((gsap) => {
        const scope = scopeRef.current;
        if (cancelled || !scope) return;

        const context = gsap.context(() => setup(gsap, scope), scope);
        revert = () => context.revert();
      })
      .catch((error: unknown) => {
        if (!cancelled) {
          console.error('Unable to initialise home page animations.', error);
        }
      });

    return () => {
      cancelled = true;
      revert?.();
    };
  }, [enabled, scopeRef, setup]);
}
