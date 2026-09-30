import {SearchFormPredictive} from '~/components/SearchFormPredictive';
import {useAside} from '~/components/Aside';

export function SearchOverlayContent() {
  const {close} = useAside();
  return <div className="search-overlay-content"><span className="eyebrow">Find what moves you</span><SearchFormPredictive onClose={close} /></div>;
}
