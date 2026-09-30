import type {CartQueryDataReturn} from '@shopify/hydrogen';

export type CartActionData = {
  cart: CartQueryDataReturn['cart'] | null;
  errors?: readonly {message: string}[];
  warnings?: readonly {message: string}[];
  success?: boolean;
};

export function CartFeedback({result}: {result?: CartActionData}) {
  const errors = result?.errors;
  const warnings = result?.warnings;
  return (
    <>
      {!!errors?.length && (
        <div className="commerce-feedback commerce-feedback-error" role="alert">
          {[...new Set(errors.map((error) => error.message))].map((message) => <p key={message}>{message}</p>)}
        </div>
      )}
      {!!warnings?.length && (
        <div className="commerce-feedback" role="status">
          {[...new Set(warnings.map((warning) => warning.message))].map((message) => <p key={message}>{message}</p>)}
        </div>
      )}
    </>
  );
}
