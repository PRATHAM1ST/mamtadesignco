import {createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode} from 'react';
import {useLocation} from 'react-router';
import {Modal} from '~/components/ui/Modal';

type AsideType = 'search' | 'cart' | 'mobile' | 'closed';
type AsideContextValue = {type: AsideType; open: (mode: AsideType) => void; close: () => void};
const AsideContext = createContext<AsideContextValue | null>(null);
export function Aside({children, heading, type}: {children?: ReactNode; heading: ReactNode; type: AsideType}) {
  const {type: activeType, close} = useAside();
  return <Modal open={type === activeType} onClose={close} title={heading} className={`drawer-dialog ${type === 'search' ? 'search-dialog' : ''}`}>{children}</Modal>;
}
Aside.Provider = function AsideProvider({children}: {children: ReactNode}) {
  const [type, setType] = useState<AsideType>('closed');
  const {pathname} = useLocation();
  const close = useCallback(() => setType('closed'), []);
  useEffect(close, [pathname, close]);
  const value = useMemo(() => ({type, open: setType, close}), [type, close]);
  return <AsideContext.Provider value={value}>{children}</AsideContext.Provider>;
};
export function useAside() {
  const context = useContext(AsideContext);
  if (!context) throw new Error('useAside requires Aside.Provider');
  return context;
}
