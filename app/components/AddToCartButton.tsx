import {useEffect, useRef} from 'react';
import {CartForm, type OptimisticCartLineInput} from '@shopify/hydrogen';
import type {FetcherWithComponents} from 'react-router';
import {CartFeedback, type CartActionData} from './cart/CartFeedback';

export function AddToCartButton({analytics, children, disabled, lines, onClick, onSuccess, className = 'button button-primary px-4'}: {
  analytics?: unknown;
  children: React.ReactNode;
  disabled?: boolean;
  lines: OptimisticCartLineInput[];
  /** Called after Shopify accepts the mutation, useful for opening the cart. */
  onClick?: () => void;
  onSuccess?: () => void;
  className?: string;
}) {
  return (
    <CartForm route="/cart" inputs={{lines}} action={CartForm.ACTIONS.LinesAdd}>
      {(fetcher: FetcherWithComponents<CartActionData>) => (
        <AddToCartSubmit fetcher={fetcher} analytics={analytics} disabled={disabled || !lines.length} onSuccess={onSuccess ?? onClick} className={className}>
          {children}
        </AddToCartSubmit>
      )}
    </CartForm>
  );
}

function AddToCartSubmit({fetcher, analytics, disabled, onSuccess, className, children}: {
  fetcher: FetcherWithComponents<CartActionData>;
  analytics?: unknown;
  disabled?: boolean;
  onSuccess?: () => void;
  className: string;
  children: React.ReactNode;
}) {
  const submitted = useRef(false);
  const callback = useRef(onSuccess);
  callback.current = onSuccess;
  useEffect(() => {
    if (fetcher.state !== 'idle') submitted.current = true;
    else if (submitted.current) {
      submitted.current = false;
      if (fetcher.data?.cart && !fetcher.data.errors?.length && fetcher.data.success !== false) callback.current?.();
    }
  }, [fetcher.state, fetcher.data]);
  const busy = fetcher.state !== 'idle';
  return (
    <>
      {analytics != null && <input name="analytics" type="hidden" value={JSON.stringify(analytics)} />}
      <button type="submit" className={className} disabled={disabled || busy} aria-busy={busy}>
        {busy ? 'Adding…' : children}
      </button>
      <CartFeedback result={fetcher.data} />
    </>
  );
}
