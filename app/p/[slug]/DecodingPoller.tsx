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

        if (data.status === "complete" || data.status === "error") {
          // Reload — the server component re-reads DB status fresh (noStore).
          // "complete" → shows PassportView. "error" → shows error UI.
          window.location.reload();
          return;
        }

        // "pending" = already decoding in another request, keep polling.
        // Any other response = keep polling.
      } catch {
        // network error — retry on next interval tick
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
