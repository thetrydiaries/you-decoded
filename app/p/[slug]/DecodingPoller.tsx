"use client";

import { useEffect } from "react";

interface Props {
  slug: string;
}

export function DecodingPoller({ slug }: Props) {
  useEffect(() => {
    // Fire the decode (POST) once — don't await it.
    // The POST runs the full ~40s decode on the server independently.
    // keepalive lets it survive a page unload if the browser navigates away first.
    fetch(`/api/decode/${slug}`, { method: "POST", keepalive: true }).catch(() => {});

    // Poll the status (GET) every 4s — this is just a fast DB read
    let active = true;

    async function poll() {
      while (active) {
        await new Promise((r) => setTimeout(r, 4000));
        if (!active) break;
        try {
          const res = await fetch(`/api/decode/${slug}`);
          const data = await res.json();
          if (data.status === "complete" || data.status === "error") {
            window.location.reload();
            return;
          }
        } catch {
          // network hiccup — retry next tick
        }
      }
    }

    poll();
    return () => {
      active = false;
    };
  }, [slug]);

  return null;
}
