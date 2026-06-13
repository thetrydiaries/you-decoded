"use client";

import { useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";

interface Props {
  slug: string;
}

/**
 * Invisible client component that:
 * 1. Triggers the decode API immediately on mount
 * 2. Polls every 3 seconds until status = 'complete'
 * 3. Reloads the page to reveal results
 */
export function DecodingPoller({ slug }: Props) {
  const router = useRouter();

  const poll = useCallback(async () => {
    try {
      const res = await fetch(`/api/decode/${slug}`);
      const data = await res.json();
      if (data.status === "complete") {
        router.refresh();
      }
    } catch {
      // Retry on next interval
    }
  }, [slug, router]);

  useEffect(() => {
    // Kick off immediately
    poll();
    const interval = setInterval(poll, 3000);
    return () => clearInterval(interval);
  }, [poll]);

  return null;
}
