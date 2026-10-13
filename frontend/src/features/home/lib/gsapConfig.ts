type Gsap = typeof import('gsap').gsap;

let gsapPromise: Promise<Gsap> | undefined;

export function loadGsap(): Promise<Gsap> {
  if (!gsapPromise) {
    gsapPromise = Promise.all([
      import('gsap'),
      import('gsap/ScrollTrigger'),
    ])
      .then(([gsapModule, scrollTriggerModule]) => {
        const gsap = gsapModule.gsap;
        gsap.registerPlugin(scrollTriggerModule.ScrollTrigger);
        gsap.defaults({
          duration: 0.65,
          ease: 'power3.out',
        });
        return gsap;
      })
      .catch((error: unknown) => {
        gsapPromise = undefined;
        throw error;
      });
  }

  return gsapPromise;
}
