'use client';

import { useSyncExternalStore } from 'react';

export const ACTIVE_DOMAIN_KEY = 'active_domain';

function subscribe(onChange: () => void) {
  window.addEventListener('storage', onChange);
  return () => window.removeEventListener('storage', onChange);
}

function readStoredDomain(): string | null {
  try {
    return window.localStorage.getItem(ACTIVE_DOMAIN_KEY);
  } catch {
    return null; // storage blocked (private mode, disabled site data)
  }
}

function readServerSnapshot(): undefined {
  return undefined;
}

/**
 * Reads the active domain from localStorage as an external store, so pages do
 * not need to copy it into state from inside an effect.
 *
 * Returns `undefined` during server render and hydration (not known yet),
 * then the stored value or `null` when nothing is stored.
 */
export function useStoredDomain(): string | null | undefined {
  return useSyncExternalStore(subscribe, readStoredDomain, readServerSnapshot);
}
