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
      className="rounded-full border border-copper-500/30 px-5 py-2 text-sm text-copper-400
                 hover:border-copper-500/60 hover:bg-copper-500/8 transition-[border-color,background] duration-200
                 active:scale-[0.97]"
    >
      {copied ? "✓ Link copied" : `Share ${name ? `${name}'s` : "your"} passport ↗`}
    </button>
  );
}
