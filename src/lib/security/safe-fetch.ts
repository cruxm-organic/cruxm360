import { assertResolvesToPublic, checkAuditUrl, UnsafeUrlError } from './url-guard';

export const FETCH_TIMEOUT_MS = 10_000;
export const MAX_BODY_BYTES = 2 * 1024 * 1024;
export const MAX_REDIRECTS = 5;

export interface PublicPage {
  finalUrl: string;
  status: number;
  headers: Headers;
  html: string;
}

/** Reads at most `max` bytes of the response body and decodes it as UTF-8. */
async function readBodyCapped(res: Response, max: number): Promise<string> {
  if (!res.body) return '';
  const reader = res.body.getReader();
  const chunks: Uint8Array[] = [];
  let total = 0;
  try {
    while (total < max) {
      const { done, value } = await reader.read();
      if (done) break;
      const room = max - total;
      const slice = value.byteLength > room ? value.subarray(0, room) : value;
      chunks.push(slice);
      total += slice.byteLength;
    }
  } finally {
    await reader.cancel().catch(() => undefined);
  }
  const out = new Uint8Array(total);
  let offset = 0;
  for (const chunk of chunks) {
    out.set(chunk, offset);
    offset += chunk.byteLength;
  }
  return new TextDecoder().decode(out);
}

/**
 * Fetches a page for auditing with SSRF protection:
 * - every hop (including redirects) is checked against the URL policy and DNS
 * - redirects are followed manually so a public site cannot bounce us to an internal host
 * - the body is capped, and one timeout covers the whole request including the body read
 */
export async function fetchPublicPage(start: URL, headers: Record<string, string>): Promise<PublicPage> {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), FETCH_TIMEOUT_MS);
  try {
    let current = start;
    for (let hop = 0; hop <= MAX_REDIRECTS; hop++) {
      const check = checkAuditUrl(current);
      if (!check.ok) throw new UnsafeUrlError(check.reason);
      await assertResolvesToPublic(current.hostname);

      const res = await fetch(current, { headers, redirect: 'manual', signal: controller.signal });
      const location = res.headers.get('location');
      if (res.status >= 300 && res.status < 400 && location) {
        await res.body?.cancel().catch(() => undefined);
        current = new URL(location, current);
        continue;
      }
      const html = await readBodyCapped(res, MAX_BODY_BYTES);
      return { finalUrl: current.toString(), status: res.status, headers: res.headers, html };
    }
    throw new UnsafeUrlError('Too many redirects.');
  } finally {
    clearTimeout(timer);
  }
}
