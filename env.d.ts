/// <reference types="vite/client" />
/// <reference types="react-router" />
/// <reference types="@shopify/oxygen-workers-types" />
/// <reference types="@shopify/hydrogen/react-router-types" />

// Enhance TypeScript's built-in typings.
import '@total-typescript/ts-reset';

declare global {
  interface Env {
    CONTACT_ENDPOINT?: string;
    CONTACT_SECRET?: string;
    NEWSLETTER_ENDPOINT?: string;
    NEWSLETTER_SECRET?: string;
    SUPPORT_EMAIL?: string;
  }
}
