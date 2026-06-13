"use client";

import { useEffect, useRef } from "react";

interface Props {
  slug: string;
}

export function DecodingPoller({ slug }: Props) {
  const isFetchingRef = useRef(false);

  useEffect(() => {
    async function checkDecode() {
      // Don't fire a new request while one is already running
      if (isFetchingRef.current) return;
      isFetchingRef.current = true;
      try {
        const res = await fetch(`/api/decode/${slug}`);
        const data = await res.json();
        if (data.status === "complete") {
          // Hard reload — guaranteed to get fresh data from Supabase
          window.location.reload();
          return;
        }
      } catch {
        // network error — retry on next tick
      } finally {
        isFetchingRef.current = false;
      }
    }

    checkDecode(); // kick off immediately
    const interval = setInterval(checkDecode, 4000);
    return () => clearInterval(interval);
  }, [slug]);

  return null;
}
