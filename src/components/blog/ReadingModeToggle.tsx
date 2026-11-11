"use client";

import React, { useEffect, useState } from "react";

export function ReadingModeToggle() {
  const [active, setActive] = useState(false);

  useEffect(() => {
    setActive(document.body.classList.contains("reading-focus"));
  }, []);

  function toggle() {
    const next = !active;
    document.body.classList.toggle("reading-focus", next);
    setActive(next);
  }

  return (
    <button
      type="button"
      onClick={toggle}
      aria-pressed={active}
      className="inline-flex items-center gap-2 rounded-full border border-orange-200 bg-white px-3.5 py-1.5 text-xs font-bold text-stone-700 transition-colors hover:bg-orange-50 hover:text-orange-800 print:hidden"
    >
      <i className="fa-solid fa-book-open-reader text-orange-600" aria-hidden="true"></i>
      {active ? "Sair do modo leitura" : "Modo leitura focado"}
    </button>
  );
}
