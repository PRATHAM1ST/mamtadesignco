import {useEffect, useId, useRef} from 'react';
import {AnimatePresence, motion, useReducedMotion} from 'motion/react';
import {Icon} from './Icon';

let locks = 0;
let originalOverflow = '';
export function Modal({open, onClose, title, children, className = ''}: {
  open: boolean; onClose: () => void; title: React.ReactNode;
  children: React.ReactNode; className?: string;
}) {
  const ref = useRef<HTMLDialogElement>(null);
  const returnFocus = useRef<HTMLElement | null>(null);
  const titleId = useId();
  const reduceMotion = useReducedMotion();
  const closeRef = useRef(onClose);
  closeRef.current = onClose;
  useEffect(() => {
    const dialog = ref.current;
    if (!dialog || !open) return;
    returnFocus.current = document.activeElement instanceof HTMLElement ? document.activeElement : null;
    if (!dialog.open) dialog.showModal();
    if (locks++ === 0) {
      originalOverflow = document.documentElement.style.overflow;
      document.documentElement.style.overflow = 'hidden';
      window.dispatchEvent(new CustomEvent('storefront:scroll-lock', {detail: true}));
    }
    return () => {
      if (--locks === 0) {
        document.documentElement.style.overflow = originalOverflow;
        window.dispatchEvent(new CustomEvent('storefront:scroll-lock', {detail: false}));
      }
    };
  }, [open]);
  return (
    // Native dialog supplies Escape handling and keyboard focus containment.
    // eslint-disable-next-line jsx-a11y/no-noninteractive-element-interactions, jsx-a11y/click-events-have-key-events
    <dialog ref={ref} className={`modal ${className}`} aria-labelledby={titleId}
      onCancel={(event) => {event.preventDefault(); closeRef.current();}}
      onClick={(event) => {if (event.target === event.currentTarget) closeRef.current();}}>
      <AnimatePresence onExitComplete={() => {
        ref.current?.close();
        if (!document.querySelector('dialog[open]') && returnFocus.current?.isConnected) returnFocus.current.focus({preventScroll: true});
      }}>
        {open && <motion.div key="panel" className="modal-panel" data-lenis-prevent
          initial={reduceMotion ? false : {opacity: 0, x: className.includes('drawer') ? 70 : 0, y: className.includes('drawer') ? 0 : 12}}
          animate={{opacity: 1, x: 0, y: 0}} exit={{opacity: 0, x: className.includes('drawer') ? 35 : 0}}
          transition={{duration: reduceMotion ? 0 : 0.24, ease: [0.22, 1, 0.36, 1]}}>
          <header className="modal-header"><h2 id={titleId}>{title}</h2><button className="icon-button" type="button" onClick={onClose} aria-label="Close dialog"><Icon name="close"/></button></header>
          <div className="modal-content">{children}</div>
        </motion.div>}
      </AnimatePresence>
    </dialog>
  );
}
