"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";

export default function ProgressBar() {
  const pathname = usePathname();
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    setProgress(10);

    const timer = setInterval(() => {
      setProgress((p) => {
        if (p >= 90) return p;
        return p + 10;
      });
    }, 150);

    return () => {
      clearInterval(timer);
      setProgress(100);
      setTimeout(() => setProgress(0), 300);
    };
  }, [pathname]);

  return (
    <div
      style={{ width: `${progress}%` }}
      className="fixed top-0 left-0 h-[3px] bg-lime-400 z-[99999] transition-all"
    />
  );
}
