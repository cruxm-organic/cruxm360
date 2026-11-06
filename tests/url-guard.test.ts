import { describe, expect, it } from 'vitest';
import { isPrivateIPv4, isPrivateIPv6, parseAuditUrl } from '@/lib/security/url-guard';

describe('isPrivateIPv4', () => {
  it.each([
    '10.1.2.3', '127.0.0.1', '169.254.169.254', '172.16.0.1', '172.31.255.255',
    '192.168.1.1', '100.64.0.1', '0.0.0.0', '224.0.0.1', '198.18.0.1',
  ])('treats %s as private', (ip) => {
    expect(isPrivateIPv4(ip)).toBe(true);
  });

  it.each(['8.8.8.8', '93.184.216.34', '172.32.0.1', '1.1.1.1'])('treats %s as public', (ip) => {
    expect(isPrivateIPv4(ip)).toBe(false);
  });

  it('fails closed on malformed input', () => {
    expect(isPrivateIPv4('not-an-ip')).toBe(true);
    expect(isPrivateIPv4('300.1.1.1')).toBe(true);
  });
});

describe('isPrivateIPv6', () => {
  it.each(['::1', '::', 'fe80::1', 'fc00::1', 'fd12:3456::1', 'ff02::1', '::7f00:1', '::ffff:127.0.0.1', '::ffff:7f00:1'])(
    'treats %s as private',
    (ip) => {
      expect(isPrivateIPv6(ip)).toBe(true);
    },
  );

  it.each(['2001:4860:4860::8888', '2606:4700:4700::1111'])('treats %s as public', (ip) => {
    expect(isPrivateIPv6(ip)).toBe(false);
  });

  it('treats IPv4-mapped public addresses as public', () => {
    expect(isPrivateIPv6('::ffff:8.8.8.8')).toBe(false);
  });
});

describe('parseAuditUrl accepts legitimate targets', () => {
  it.each([
    ['example.com', 'https://example.com/'],
    ['https://example.com/page?x=1', 'https://example.com/page?x=1'],
    ['http://example.com', 'http://example.com/'],
    ['  example.com  ', 'https://example.com/'],
    ['https://example.com:443/', 'https://example.com/'],
  ])('%j -> %s', (input, expected) => {
    const result = parseAuditUrl(input);
    expect(result.ok).toBe(true);
    if (result.ok) expect(result.url.toString()).toBe(expected);
  });
});

describe('parseAuditUrl rejects unsafe or invalid targets', () => {
  it.each([
    'http://localhost:3000',
    'http://127.0.0.1',
    'http://169.254.169.254/latest/meta-data/',
    'http://[::1]/',
    'http://2130706433/', // 127.0.0.1 written as a decimal integer
    'http://0x7f.0.0.1/', // hex-encoded loopback
    'http://10.0.0.5/admin',
    'http://user:pass@example.com',
    'https://example.com:8443',
    'ftp://example.com',
    'file:///etc/passwd',
    'intranet',
    'api.internal',
    'printer.local',
    'metadata.google.internal',
    'exa mple.com',
    '',
    '   ',
  ])('rejects %j', (input) => {
    expect(parseAuditUrl(input).ok).toBe(false);
  });

  it('rejects non-string input', () => {
    expect(parseAuditUrl(123).ok).toBe(false);
    expect(parseAuditUrl(null).ok).toBe(false);
    expect(parseAuditUrl({ url: 'example.com' }).ok).toBe(false);
  });

  it('rejects overly long input', () => {
    expect(parseAuditUrl(`https://example.com/${'a'.repeat(3000)}`).ok).toBe(false);
  });

  it.each(['file:///etc/passwd', 'gopher://127.0.0.1:6379/_INFO', 'ftp://example.com'])(
    'explains that %s uses an unsupported scheme',
    (input) => {
      const result = parseAuditUrl(input);
      expect(result.ok).toBe(false);
      if (!result.ok) expect(result.reason).toBe('Only http and https URLs can be audited.');
    },
  );

  it('rejects control characters', () => {
    expect(parseAuditUrl('example.com\u0000.evil').ok).toBe(false);
  });
});
