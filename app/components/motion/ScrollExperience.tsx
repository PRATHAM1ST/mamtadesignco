import {useEffect, useRef, useState} from 'react';
import {useLocation} from 'react-router';
import {ReactLenis, useLenis} from 'lenis/react';
import type {LenisRef} from 'lenis/react';
import {gsap} from 'gsap';
import {ScrollTrigger} from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);
export function ScrollExperience() {
  const [enabled, setEnabled] = useState(false);
  useEffect(() => {
    const media = window.matchMedia('(prefers-reduced-motion: no-preference) and (pointer: fine)');
    const update = () => setEnabled(media.matches);
    update(); media.addEventListener('change', update);
    return () => media.removeEventListener('change', update);
  }, []);
  return enabled ? <SmoothScroll/> : null;
}
function SmoothScroll() {
  const ref = useRef<LenisRef>(null);
  const location = useLocation();
  useEffect(() => {
    function frame(time: number) {ref.current?.lenis?.raf(time * 1000);}
    function lock(event: Event) {
      if ((event as CustomEvent<boolean>).detail) ref.current?.lenis?.stop();
      else ref.current?.lenis?.start();
    }
    gsap.ticker.add(frame);
    window.addEventListener('storefront:scroll-lock', lock);
    return () => {
      gsap.ticker.remove(frame);
      window.removeEventListener('storefront:scroll-lock', lock);
    };
  }, []);
  useEffect(() => {ScrollTrigger.refresh();}, [location.pathname]);
  return <ReactLenis root ref={ref} options={{autoRaf: false, smoothWheel: true, syncTouch: false, anchors: true, duration: 0.85}}><ScrollSync/></ReactLenis>;
}
function ScrollSync() {
  useLenis(() => ScrollTrigger.update());
  return null;
}
