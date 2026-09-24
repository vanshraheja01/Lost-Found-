"use client";

import { useEffect, useRef, useState, type CSSProperties, type ElementType, type ReactNode } from "react";
import styles from "./ScrollReveal.module.css";

interface ScrollRevealProps {
  children: ReactNode;
  index?: number;
  className?: string;
  as?: ElementType;
}

export default function ScrollReveal({ children, index = 0, className, as: Tag = "div" }: ScrollRevealProps) {
  const ref = useRef<HTMLElement | null>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;

    if (typeof IntersectionObserver === "undefined") {
      const raf = requestAnimationFrame(() => setVisible(true));
      return () => cancelAnimationFrame(raf);
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.15, rootMargin: "0px 0px -10% 0px" }
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  return (
    <Tag
      ref={ref}
      className={`${styles.reveal}${visible ? ` ${styles.show}` : ""}${className ? ` ${className}` : ""}`}
      style={{ "--reveal-delay": `${Math.min(index, 8) * 0.08}s` } as CSSProperties}
    >
      {children}
    </Tag>
  );
}
