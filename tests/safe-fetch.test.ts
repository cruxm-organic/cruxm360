import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

// DNS is mocked so these tests never touch the network.
vi.mock('node:dns/promises', () => ({
  lookup: vi.fn(async (host: string) => {
    if (host === 'public.example') return [{ address: '93.184.216.34', family: 4 }];
    if (host === 'other-public.example') return [{ address: '93.184.216.35', family: 4 }];
    if (host === 'rebind.example') return [{ address: '10.0.0.5', family: 4 }];
    throw Object.assign(new Error(`ENOTFOUND ${host}`), { code: 'ENOTFOUND' });
  }),
}));

import { fetchPublicPage, MAX_BODY_BYTES } from '@/lib/security/safe-fetch';
import { UnsafeUrlError } from '@/lib/security/url-guard';

function htmlResponse(text: string): Response {
  return new Response(text, { status: 200, headers: { 'content-type': 'text/html' } });
}

function redirect(location: string): Response {
  return new Response(null, { status: 302, headers: { location } });
}

const HEADERS = { 'User-Agent': 'test' };

describe('fetchPublicPage', () => {
  let fetchMock: ReturnType<typeof vi.fn>;

  beforeEach(() => {
    fetchMock = vi.fn();
    vi.stubGlobal('fetch', fetchMock);
  });

  afterEach(() => {
    vi.unstubAllGlobals();
    vi.clearAllMocks();
  });

  it('returns the body of a public page and disables automatic redirects', async () => {
    fetchMock.mockResolvedValueOnce(htmlResponse('<html>ok</html>'));
    const page = await fetchPublicPage(new URL('https://public.example/'), HEADERS);
    expect(page.html).toBe('<html>ok</html>');
    expect(page.status).toBe(200);
    expect(fetchMock.mock.calls[0][1]).toMatchObject({ redirect: 'manual' });
  });

  it('never requests a private start URL', async () => {
    await expect(fetchPublicPage(new URL('http://127.0.0.1/'), HEADERS)).rejects.toBeInstanceOf(UnsafeUrlError);
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it('blocks a redirect that points at an internal address', async () => {
    fetchMock.mockResolvedValueOnce(redirect('http://169.254.169.254/latest/meta-data/'));
    await expect(fetchPublicPage(new URL('https://public.example/'), HEADERS)).rejects.toBeInstanceOf(UnsafeUrlError);
    expect(fetchMock).toHaveBeenCalledTimes(1);
  });

  it('blocks a redirect to a hostname that resolves to a private address', async () => {
    fetchMock.mockResolvedValueOnce(redirect('https://rebind.example/'));
    await expect(fetchPublicPage(new URL('https://public.example/'), HEADERS)).rejects.toBeInstanceOf(UnsafeUrlError);
  });

  it('follows a redirect between public hosts and re-checks each hop', async () => {
    fetchMock
      .mockResolvedValueOnce(redirect('https://other-public.example/landing'))
      .mockResolvedValueOnce(htmlResponse('<html>final</html>'));
    const page = await fetchPublicPage(new URL('https://public.example/'), HEADERS);
    expect(page.finalUrl).toBe('https://other-public.example/landing');
    expect(page.html).toBe('<html>final</html>');
  });

  it('stops after too many redirects', async () => {
    fetchMock.mockImplementation(async () => redirect('https://public.example/loop'));
    await expect(fetchPublicPage(new URL('https://public.example/'), HEADERS)).rejects.toThrow(/Too many redirects/);
  });

  it('caps the body at MAX_BODY_BYTES instead of loading an unbounded response', async () => {
    const chunk = new Uint8Array(64 * 1024).fill(0x61); // 64 KiB of "a"
    const stream = new ReadableStream<Uint8Array>({
      pull(controller) {
        controller.enqueue(chunk); // endless stream
      },
    });
    fetchMock.mockResolvedValueOnce(new Response(stream, { status: 200 }));
    const page = await fetchPublicPage(new URL('https://public.example/'), HEADERS);
    expect(page.html.length).toBeLessThanOrEqual(MAX_BODY_BYTES);
    expect(page.html.length).toBeGreaterThan(0);
  });
});
