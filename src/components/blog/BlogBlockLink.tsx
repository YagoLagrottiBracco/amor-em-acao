"use client";

import React, { useState } from "react";

export function BlogBlockLink({
  id,
  pageUrl,
}: {
  id: string;
  pageUrl: string;
}) {
  const [copied, setCopied] = useState(false);
  const [manual, setManual] = useState(false);
  const href = pageUrl.split("#")[0] + "#" + id;

  return (
    <div className="mb-4 flex flex-wrap items-center gap-3 text-xs text-stone-400 opacity-80 group-hover:opacity-100 transition">
      <a
        href={href}
        className="inline-flex min-h-6 items-center text-orange-700 hover:text-orange-800 underline underline-offset-4 font-medium"
        aria-label="Link permanente para este trecho"
      >
        Link deste trecho
      </a>
      <button
        type="button"
        className="min-h-6 underline underline-offset-4 hover:text-stone-700"
        onClick={async () => {
          try {
            await navigator.clipboard.writeText(href);
            setCopied(true);
            setManual(false);
            window.setTimeout(() => setCopied(false), 2000);
          } catch {
            setManual(true);
          }
        }}
      >
        Copiar link
      </button>
      <span role="status" className="text-emerald-700 font-semibold">
        {copied ? "Copiado." : ""}
      </span>
      {manual && (
        <label className="block w-full text-stone-600">
          Copie o endereço:
          <input
            readOnly
            value={href}
            onFocus={(event) => event.target.select()}
            className="mt-1 min-h-8 w-full rounded border border-stone-200 bg-white px-2 text-xs"
          />
        </label>
      )}
    </div>
  );
}
