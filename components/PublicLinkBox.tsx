"use client";

import { useState } from "react";

export default function PublicLinkBox({ path, label }: { path: string; label: string }) {
  const [copied, setCopied] = useState(false);
  const url = typeof window !== "undefined" ? `${window.location.origin}${path}` : path;

  function copy() {
    navigator.clipboard.writeText(url).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  }

  return (
    <div className="card p-4 sm:p-5 bg-brand-purpleLight/40 border-brand-purple/20">
      <p className="text-xs font-medium text-brand-muted mb-2">🔗 {label}</p>
      <div className="flex flex-wrap items-center gap-2">
        <code className="flex-1 min-w-[200px] text-xs bg-white border border-brand-line rounded-lg px-3 py-2 truncate">
          {url}
        </code>
        <button
          onClick={copy}
          className="text-xs font-medium bg-brand-purple text-white px-3 py-2 rounded-lg shrink-0"
        >
          {copied ? "✓ Tersalin" : "Salin Link"}
        </button>
      </div>
    </div>
  );
}
