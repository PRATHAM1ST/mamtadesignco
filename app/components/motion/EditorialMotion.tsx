import {useRef} from 'react';
import {useGSAP} from '@gsap/react';
import {gsap} from 'gsap';
import {ScrollTrigger} from 'gsap/ScrollTrigger';
if (typeof window !== 'undefined') {
  gsap.registerPlugin(useGSAP, ScrollTrigger);
}

export function EditorialMotion({children}: {children: React.ReactNode}) {
  const ref = useRef<HTMLDivElement>(null);
  useGSAP(() => {
    const media = gsap.matchMedia();
    media.add('(prefers-reduced-motion: no-preference)', () => {
      gsap.from('[data-hero-copy] > *', {y: 22, opacity: 0, duration: 0.85, stagger: 0.09, ease: 'power3.out', clearProps: 'all'});
      gsap.from('[data-hero-image]', {scale: 1.045, duration: 1.5, ease: 'power2.out', clearProps: 'transform'});
      gsap.utils.toArray<HTMLElement>('[data-reveal]').forEach((element) => {
        gsap.from(element, {y: 28, opacity: 0, duration: 0.8, ease: 'power3.out', clearProps: 'all', scrollTrigger: {trigger: element, start: 'top 93%', once: true}});
      });
    });
    return () => media.revert();
  }, {scope: ref});
  return <div ref={ref}>{children}</div>;
}
