import type {SVGProps} from 'react';

type IconName = 'search' | 'bag' | 'user' | 'heart' | 'menu' | 'close' | 'arrow' | 'plus' | 'minus' | 'chevron';
const paths: Record<IconName, React.ReactNode> = {
  search: <><circle cx="10.5" cy="10.5" r="6.5"/><path d="m16 16 4 4"/></>,
  bag: <><path d="M5 7h14l1 14H4L5 7Z"/><path d="M8 8V6a4 4 0 0 1 8 0v2"/></>,
  user: <><circle cx="12" cy="7.5" r="3.5"/><path d="M5 21v-2a7 7 0 0 1 14 0v2"/></>,
  heart: <path d="M20.5 4.7a5 5 0 0 0-7.1 0L12 6.1l-1.4-1.4a5 5 0 0 0-7.1 7.1L12 20l8.5-8.2a5 5 0 0 0 0-7.1Z"/>,
  menu: <path d="M3 7h18M3 16h18"/>,
  close: <path d="m5 5 14 14M19 5 5 19"/>,
  arrow: <path d="M3 12h17m-6-6 6 6-6 6"/>,
  plus: <path d="M12 5v14M5 12h14"/>,
  minus: <path d="M5 12h14"/>,
  chevron: <path d="m6 9 6 6 6-6"/>,
};
export function Icon({name, ...props}: SVGProps<SVGSVGElement> & {name: IconName}) {
  return <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.35" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" {...props}>{paths[name]}</svg>;
}
