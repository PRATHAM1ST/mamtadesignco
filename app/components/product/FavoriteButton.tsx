import {useSyncExternalStore} from 'react';
import {Icon} from '~/components/ui/Icon';

const KEY = 'mamta:favorites:v1';
const listeners = new Set<() => void>();
function subscribe(listener: () => void) {
  listeners.add(listener);
  window.addEventListener('storage', listener);
  return () => {listeners.delete(listener); window.removeEventListener('storage', listener);};
}
function snapshot() {try {return localStorage.getItem(KEY) || '[]';} catch {return '[]';}}
export function useFavorites() {
  const raw = useSyncExternalStore(subscribe, snapshot, () => '[]');
  let entries: {handle: string; id: string}[] = [];
  try {const parsed: unknown = JSON.parse(raw); if (Array.isArray(parsed)) entries = parsed.filter((value): value is {handle: string; id: string} => typeof value === 'object' && value !== null && 'handle' in value && 'id' in value && typeof value.handle === 'string' && typeof value.id === 'string' && /^[a-z0-9-]+$/.test(value.handle) && /^gid:\/\/shopify\/Product\/\d+$/.test(value.id)).slice(0, 40);} catch { /* Invalid local storage is treated as an empty list. */ }
  const handles = entries.map((entry) => entry.handle);
  const toggle = (handle: string, id: string) => {
    const next = handles.includes(handle) ? entries.filter((item) => item.handle !== handle) : [...entries, {handle, id}].slice(-40);
    try {localStorage.setItem(KEY, JSON.stringify(next));} catch {return;}
    listeners.forEach((listener) => listener());
  };
  return {handles, ids: entries.map((entry) => entry.id), toggle};
}
export function FavoriteButton({handle, id}: {handle: string; id: string}) {
  const {handles, toggle} = useFavorites();
  const selected = handles.includes(handle);
  return <button type="button" className={`icon-button favorite-button ${selected ? 'selected' : ''}`} aria-pressed={selected} aria-label={selected ? 'Remove from favorites' : 'Save to favorites'} onClick={() => toggle(handle, id)}><Icon name="heart"/></button>;
}
