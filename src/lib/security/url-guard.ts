import { isIP } from 'node:net';
import { lookup } from 'node:dns/promises';

/**
 * Guards for user-supplied audit targets. The audit engine fetches URLs from
 * the server, so without these checks anyone who can reach the API could make
 * the server request internal services (SSRF): localhost, LAN hosts, or cloud
 * metadata endpoints such as 169.254.169.254.
 */

export const MAX_URL_LENGTH = 2048;
const ALLOWED_PORTS = new Set(['', '80', '443']);
const BLOCKED_HOSTNAMES = new Set(['localhost', 'metadata', 'metadata.google.internal']);
const BLOCKED_SUFFIXES = ['.localhost', '.local', '.internal', '.localdomain'];

export type UrlCheck = { ok: true; url: URL } | { ok: false; reason: string };

export class UnsafeUrlError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'UnsafeUrlError';
  }
}

function fail(reason: string): UrlCheck {
  return { ok: false, reason };
}

/** IPv4 ranges that must never be reached from a public audit. Fails closed on malformed input. */
export function isPrivateIPv4(ip: string): boolean {
  const parts = ip.split('.').map(Number);
  if (parts.length !== 4 || parts.some((n) => !Number.isInteger(n) || n < 0 || n > 255)) return true;
  const [a, b] = parts;
  return (
    a === 0 ||                          // 0.0.0.0/8 "this network"
    a === 10 ||                         // 10.0.0.0/8 private
    a === 127 ||                        // loopback
    (a === 100 && b >= 64 && b <= 127) || // 100.64.0.0/10 carrier-grade NAT
    (a === 169 && b === 254) ||         // link-local, includes cloud metadata
    (a === 172 && b >= 16 && b <= 31) || // 172.16.0.0/12 private
    (a === 192 && b === 0) ||           // 192.0.0.0/24 IETF protocol assignments
    (a === 192 && b === 168) ||         // 192.168.0.0/16 private
    (a === 198 && (b === 18 || b === 19)) || // benchmarking
    a >= 224                            // multicast and reserved
  );
}

/** IPv6: only 2000::/3 (global unicast) is treated as public. Everything else fails closed. */
export function isPrivateIPv6(ip: string): boolean {
  const s = ip.toLowerCase();
  if (s.startsWith('::ffff:')) {
    const tail = s.slice(7);
    if (isIP(tail) === 4) return isPrivateIPv4(tail);
    const hextets = tail.split(':');
    if (hextets.length !== 2) return true;
    const hi = parseInt(hextets[0], 16);
    const lo = parseInt(hextets[1], 16);
    if (Number.isNaN(hi) || Number.isNaN(lo)) return true;
    return isPrivateIPv4(`${hi >> 8}.${hi & 255}.${lo >> 8}.${lo & 255}`);
  }
  const first = parseInt(s.split(':').find((p) => p !== '') ?? '', 16);
  if (s.startsWith('::') || Number.isNaN(first)) return true;
  return (first & 0xe000) !== 0x2000;
}

export function isPrivateAddress(ip: string): boolean {
  const kind = isIP(ip);
  if (kind === 4) return isPrivateIPv4(ip);
  if (kind === 6) return isPrivateIPv6(ip);
  return true; // not an IP literal: fail closed
}

/** Validates a parsed URL against the audit policy. */
export function checkAuditUrl(u: URL): UrlCheck {
  if (u.protocol !== 'http:' && u.protocol !== 'https:') {
    return fail('Only http and https URLs can be audited.');
  }
  if (u.username || u.password) {
    return fail('URLs with embedded credentials are not allowed.');
  }
  if (!ALLOWED_PORTS.has(u.port)) {
    return fail('Only the standard web ports (80 and 443) can be audited.');
  }
  const host = u.hostname.toLowerCase().replace(/^\[|\]$/g, '');
  if (!host || BLOCKED_HOSTNAMES.has(host) || BLOCKED_SUFFIXES.some((s) => host.endsWith(s))) {
    return fail('That host cannot be audited.');
  }
  if (isIP(host)) {
    return isPrivateAddress(host)
      ? fail('Private, loopback and link-local addresses cannot be audited.')
      : { ok: true, url: u };
  }
  if (!host.includes('.')) {
    return fail('Enter a full domain name, for example example.com.');
  }
  return { ok: true, url: u };
}

/** Parses user input (a bare domain or a full URL) and applies the audit policy. */
export function parseAuditUrl(input: unknown): UrlCheck {
  if (typeof input !== 'string') return fail('A URL is required.');
  const trimmed = input.trim();
  if (!trimmed) return fail('A URL is required.');
  if (trimmed.length > MAX_URL_LENGTH) return fail('URL is too long.');
  for (const ch of trimmed) {
    const code = ch.charCodeAt(0);
    if (code <= 32 || code === 127) return fail('URL contains invalid characters.');
  }
  if (/^[a-z][a-z0-9+.-]*:\/\//i.test(trimmed) && !/^https?:\/\//i.test(trimmed)) {
    return fail('Only http and https URLs can be audited.');
  }
  const withScheme = /^https?:\/\//i.test(trimmed) ? trimmed : `https://${trimmed}`;
  let parsed: URL;
  try {
    parsed = new URL(withScheme);
  } catch {
    return fail('That is not a valid URL.');
  }
  return checkAuditUrl(parsed);
}

/**
 * Resolves the hostname and rejects it if any address is private.
 * Note: this checks at resolution time; a DNS rebinding attack between this
 * check and the socket connect is not fully prevented by it.
 */
export async function assertResolvesToPublic(hostname: string): Promise<void> {
  const bare = hostname.replace(/^\[|\]$/g, '');
  if (isIP(bare)) return;
  const addresses = await lookup(bare, { all: true, verbatim: true });
  if (addresses.length === 0) throw new Error(`Could not resolve ${bare}`);
  if (addresses.some((a) => isPrivateAddress(a.address))) {
    throw new UnsafeUrlError('That domain resolves to a private network address and cannot be audited.');
  }
}
