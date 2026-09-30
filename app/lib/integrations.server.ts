export type FormIntegration = {endpoint?: string; secret?: string};

export function integrationEnabled(endpoint?: string) {
  if (!endpoint) return false;
  try { return new URL(endpoint).protocol === 'https:'; } catch { return false; }
}

export function sameOriginRequest(request: Request) {
  const origin = request.headers.get('Origin');
  return !origin || origin === new URL(request.url).origin;
}

export function validEmail(email: string) {
  return email.length <= 254 && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

/** A configured backend must explicitly confirm persistence with {success:true}. */
export async function submitIntegration(config: FormIntegration, payload: Record<string, string | boolean>) {
  if (!integrationEnabled(config.endpoint)) return false;
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 8000);
  try {
    const response = await fetch(config.endpoint!, {
      method: 'POST', signal: controller.signal,
      headers: {'Content-Type': 'application/json', ...(config.secret ? {Authorization: `Bearer ${config.secret}`} : {})},
      body: JSON.stringify(payload),
    });
    if (!response.ok) return false;
    const result: unknown = await response.json();
    return typeof result === 'object' && result !== null && 'success' in result && result.success === true;
  } catch {
    // Log the integration category, never customer data or credentials.
    console.error('Merchant form integration could not be reached.');
    return false;
  } finally { clearTimeout(timeout); }
}
