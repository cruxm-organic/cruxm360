import { describe, expect, it } from 'vitest';
import { isValidDomain } from '@/lib/security/domain';

describe('isValidDomain', () => {
  it.each(['example.com', 'sub.example.co.uk', 'my-site.io', 'x1.org'])('accepts %s', (d) => {
    expect(isValidDomain(d)).toBe(true);
  });

  it.each([
    null,
    '',
    'localhost',
    'exa mple.com',
    'example.com&x=1',
    '../etc/passwd',
    'example.com/evil',
    '-bad.example.com',
    'bad-.example.com',
    'a'.repeat(300) + '.com',
    'example..com',
  ])('rejects %j', (d) => {
    expect(isValidDomain(d as string | null)).toBe(false);
  });
});
