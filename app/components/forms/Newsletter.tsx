import {useId} from 'react';
import {useFetcher} from 'react-router';

export function Newsletter({enabled}: {enabled: boolean}) {
  const fetcher = useFetcher<{success?: boolean; error?: string}>();
  const id = useId();
  if (!enabled) return null;
  const pending = fetcher.state !== 'idle';
  return (
    <div className="newsletter">
      <p className="eyebrow">A note from the atelier</p>
      <h3>Be part of the next chapter.</h3>
      <p>Collection notes and new arrivals, in your inbox.</p>
      <fetcher.Form action="/api/newsletter" method="post">
        <label htmlFor={`${id}-email`}>Email address</label>
        <div className="newsletter-input">
          <input id={`${id}-email`} name="email" type="email" autoComplete="email" maxLength={254} required aria-describedby={`${id}-status`} />
          <button type="submit" disabled={pending || fetcher.data?.success}>{pending ? 'Joining…' : fetcher.data?.success ? 'Subscribed' : 'Join →'}</button>
        </div>
        <div className="form-honeypot" aria-hidden="true"><label htmlFor={`${id}-website`}>Website</label><input id={`${id}-website`} name="website" tabIndex={-1} autoComplete="off" /></div>
        <p className="form-fineprint">By joining, you agree to receive marketing emails. Unsubscribe at any time.</p>
        <p id={`${id}-status`} role={fetcher.data?.error ? 'alert' : 'status'}>{fetcher.data?.error || (fetcher.data?.success ? 'You’re on the list. Thank you for joining us.' : '')}</p>
      </fetcher.Form>
    </div>
  );
}
