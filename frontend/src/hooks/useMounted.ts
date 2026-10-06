'use client';

import { useState, useEffect } from 'react';

/**
 * useMounted hook ensures client-only code/persisted state only executes
 * after initial DOM hydration to eliminate React SSR Hydration mismatches.
 */
export function useMounted(): boolean {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return mounted;
}
