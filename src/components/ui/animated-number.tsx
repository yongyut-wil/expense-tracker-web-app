"use client";

import { useEffect, useRef } from "react";
import { useMotionValue, useTransform, animate } from "framer-motion";

interface AnimatedNumberProps {
  value: number;
  className?: string;
  suffix?: string;
  prefix?: string;
  decimals?: number;
}

export function AnimatedNumber({
  value,
  className,
  suffix = "",
  prefix = "",
  decimals = 0,
}: AnimatedNumberProps) {
  const count = useMotionValue(0);
  const rounded = useTransform(count, (latest: number) => {
    return latest.toLocaleString(undefined, {
      minimumFractionDigits: decimals,
      maximumFractionDigits: decimals,
    });
  });
  

  useEffect(() => {
    const animation = animate(count, value, {
      duration: 2,
      ease: "easeOut",
    });
    return animation.stop;
  }, [value, count]);

  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    return rounded.on("change", (latest) => {
      if (ref.current) {
        ref.current.textContent = `${prefix}${latest}${suffix}`;
      }
    });
  }, [rounded, prefix, suffix]);

  return (
    <span ref={ref} className={className}>
      {prefix}
      {rounded.get()}
      {suffix}
    </span>
  );
}
