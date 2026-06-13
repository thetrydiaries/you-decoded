"use client";

import { useState } from "react";

interface Props {
  slug: string;
  name: string | null;
}

export function ShareButton({ slug, name }: Props) {
  const [copied, setCopied] = useState(false);

  async function handleCopy() {
    const url = `${window.location.origin}/p/${slug}`;
    await navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <button
      onClick={handleCopy}
      className="rounded-full border border-gold-500/40 px-5 py-2 text-sm text-gold-400
                 hover:border-gold-500 hover:bg-gold-500/10 transition-all duration-200"
    >
      {copied ? "✓ Link copied" : `Share ${name ? `${name}'s` : "your"} passport ↗`}
    </button>
  );
}
