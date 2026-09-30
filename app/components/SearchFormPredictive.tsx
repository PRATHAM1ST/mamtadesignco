import {Form, Link, useNavigate} from 'react-router';
import {useEffect, useId, useRef, useState, type KeyboardEvent} from 'react';
import {SearchResultsPredictive, getPredictiveOptions} from './SearchResultsPredictive';
import {getEmptyPredictiveSearchResult, type PredictiveSearchReturn} from '~/lib/search';

export const SEARCH_ENDPOINT = '/api/predictive-search';

export function SearchFormPredictive({onClose}: {onClose: () => void}) {
  const [query, setQuery] = useState('');
  const [response, setResponse] = useState<PredictiveSearchReturn | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [activeIndex, setActiveIndex] = useState(-1);
  const [recent, setRecent] = useState<string[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();
  const id = useId();
  const listId = `search-results-${id}`;
  const term = query.trim();
  const items = response?.term === term ? response.result.items : getEmptyPredictiveSearchResult().items;
  const options = getPredictiveOptions(items, term);

  useEffect(() => {
    if (activeIndex >= 0) document.getElementById(`${listId}-${activeIndex}`)?.scrollIntoView({block: 'nearest'});
  }, [activeIndex, listId]);

  useEffect(() => {
    const frame = window.requestAnimationFrame(() => inputRef.current?.focus());
    return () => window.cancelAnimationFrame(frame);
  }, []);
  useEffect(() => {
    try {
      const parsed: unknown = JSON.parse(localStorage.getItem('mamta:recent-searches') || '[]');
      if (Array.isArray(parsed)) setRecent(parsed.filter((value): value is string => typeof value === 'string').slice(0, 5));
    } catch { /* Browser storage can be unavailable in private browsing. */ }
  }, []);
  useEffect(() => {
    const controller = new AbortController();
    setActiveIndex(-1);
    setError('');
    if (!term) {
      setResponse(null);
      setLoading(false);
      return () => controller.abort();
    }
    setLoading(true);
    const timeout = window.setTimeout(() => {
      void fetch(`${SEARCH_ENDPOINT}?q=${encodeURIComponent(term)}`, {signal: controller.signal})
        .then(async (result) => {
          if (!result.ok) throw new Error('Live suggestions are unavailable. You can still search the full collection.');
          const data = await result.json() as PredictiveSearchReturn;
          if (!controller.signal.aborted && data.term === term) setResponse(data);
        })
        .catch((cause: unknown) => {
          if (!controller.signal.aborted) setError(cause instanceof Error ? cause.message : 'Live suggestions are unavailable.');
        })
        .finally(() => {if (!controller.signal.aborted) setLoading(false);});
    }, 240);
    return () => {window.clearTimeout(timeout); controller.abort();};
  }, [term]);

  function rememberSearch() {
    if (!term) return;
    const next = [term, ...recent.filter((value) => value !== term)].slice(0, 5);
    setRecent(next);
    try { localStorage.setItem('mamta:recent-searches', JSON.stringify(next)); } catch { /* Search works without browser storage. */ }
  }

  function keyboard(event: KeyboardEvent<HTMLInputElement>) {
    if (event.key === 'ArrowDown' && options.length) {event.preventDefault(); setActiveIndex((index) => (index + 1) % options.length);}
    if (event.key === 'ArrowUp' && options.length) {event.preventDefault(); setActiveIndex((index) => index <= 0 ? options.length - 1 : index - 1);}
    if (event.key === 'Escape') {event.preventDefault(); onClose();}
    if (event.key === 'Enter' && activeIndex >= 0 && options[activeIndex]) {
      event.preventDefault(); rememberSearch(); onClose(); void navigate(options[activeIndex].url);
    }
  }

  return <div className="predictive-search">
    <Form className="predictive-search-form" method="get" action="/search" role="search" onSubmit={() => {rememberSearch(); onClose();}}>
      <label className="sr-only" htmlFor={`search-input-${id}`}>Search products, collections and stories</label>
      <div className="search-input-row">
        <input ref={inputRef} id={`search-input-${id}`} name="q" type="search" role="combobox" value={query} onChange={(event) => setQuery(event.target.value)} onKeyDown={keyboard} placeholder="A colour, a piece, a feeling…" autoComplete="off" maxLength={200} aria-autocomplete="list" aria-expanded={Boolean(term && options.length)} aria-controls={listId} aria-activedescendant={activeIndex >= 0 && options[activeIndex] ? `${listId}-${activeIndex}` : undefined} />
        {query && <button className="icon-button search-clear" type="button" aria-label="Clear search" onClick={() => {setQuery(''); inputRef.current?.focus();}}>×</button>}
        <button className="search-submit" type="submit" aria-label="Search"><span aria-hidden="true">↗</span></button>
      </div>
    </Form>
    <p className="search-status" aria-live="polite">{loading ? 'Finding your pieces…' : error || (term && response?.term === term ? `${response.result.total} suggestions for “${term}”` : '')}</p>
    {term ? <>
      <SearchResultsPredictive options={options} listId={listId} activeIndex={activeIndex} onSelect={() => {rememberSearch(); onClose();}} onActive={setActiveIndex} />
      {!loading && !error && response?.term === term && !response.result.total && <div className="search-empty"><h3>Nothing just yet.</h3><p>Try a product name or a different spelling.</p></div>}
      <Link className="search-view-all text-link" to={`/search?q=${encodeURIComponent(term)}`} onClick={() => {rememberSearch(); onClose();}}>View all results for “{term}” <span aria-hidden="true">↗</span></Link>
    </> : <div className="search-initial">
      {recent.length > 0 && <div><div className="search-initial-heading"><h3>Recent searches</h3><button className="text-link" type="button" onClick={() => {setRecent([]); try {localStorage.removeItem('mamta:recent-searches');} catch { /* No storage access. */ }}}>Clear</button></div><div className="search-recent">{recent.map((value) => <button key={value} type="button" onClick={() => {setQuery(value); inputRef.current?.focus();}}>{value}<span aria-hidden="true">↗</span></button>)}</div></div>}
      <div className="search-initial-heading"><h3>Start exploring</h3></div>
      <Link className="search-discovery-link" to="/shop" onClick={onClose}>Shop the collection<span aria-hidden="true">↗</span></Link>
      <Link className="search-discovery-link" to="/catalogue" onClick={onClose}>The catalogue<span aria-hidden="true">↗</span></Link>
    </div>}
  </div>;
}

