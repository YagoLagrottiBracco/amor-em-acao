"use client";

import React, { useEffect, useState } from "react";

interface ReadingProgressProps {
  targetId: string;
  minutes: number;
}

export function ReadingProgress({ targetId, minutes }: ReadingProgressProps) {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const target = document.getElementById(targetId);
    if (!target) return;
    let frame = 0;

    const measure = () => {
      frame = 0;
      const { top, height } = target.getBoundingClientRect();
      const scrollable = height - window.innerHeight;
      const read = scrollable > 0 ? -top / scrollable : top < 0 ? 1 : 0;
      setProgress(Math.min(1, Math.max(0, read)));
    };
    const schedule = () => {
      if (!frame) frame = requestAnimationFrame(measure);
    };

    measure();
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule);
    return () => {
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
      if (frame) cancelAnimationFrame(frame);
    };
  }, [targetId]);

  const remaining = Math.ceil(minutes * (1 - progress));
  const showChip = progress > 0.02 && progress < 0.98 && minutes > 1;

  return (
    <div aria-hidden="true" className="print:hidden">
      <div className="pointer-events-none fixed inset-x-0 top-0 z-[60] h-1 bg-orange-100/50">
        <div
          className="h-full origin-left gradient-brand transition-transform duration-75"
          style={{ transform: `scaleX(${progress})` }}
        />
      </div>
      {showChip && (
        <div className="pointer-events-none fixed bottom-4 right-4 z-40 rounded-full border border-orange-200 bg-white/95 px-3.5 py-1.5 text-xs font-bold text-orange-900 shadow-md backdrop-blur">
          {remaining <= 1 ? "1 min restante" : `${remaining} min restantes`}
        </div>
      )}
    </div>
  );
}
