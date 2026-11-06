const DOMAIN_PATTERN = /^(?=.{1,253}$)(?:[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?\.)+[a-z]{2,63}$/;

/** Accepts a bare registrable-style hostname such as "example.com". Rejects anything else. */
export function isValidDomain(value: string | null): value is string {
  return typeof value === 'string' && DOMAIN_PATTERN.test(value.toLowerCase());
}
