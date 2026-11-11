"use client";

import React, { useState } from "react";

export function BlogCopyCode({ code }: { code: string }) {
  const [copied, setCopied] = useState(false);

  async function copy() {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
    } catch {
      setCopied(false);
    }
  }

  return (
    <button
      type="button"
      onClick={copy}
      className="rounded-md border border-stone-200 bg-white px-2.5 py-1 text-xs font-medium text-stone-700 hover:bg-orange-50 print:hidden"
      aria-label="Copiar código"
    >
      {copied ? "Copiado" : "Copiar código"}
    </button>
  );
}
