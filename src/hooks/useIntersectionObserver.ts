import { useEffect, useRef } from "react";

interface Options {
  onIntersect: () => void;
  enabled?: boolean;
  rootMargin?: string;
}

/**
 * Trả về 1 ref để gắn vào element "sentinel" ở cuối danh sách.
 * Khi element đó lọt vào viewport, gọi callback `onIntersect` (dùng để load thêm dữ liệu).
 */
export function useIntersectionObserver({
  onIntersect,
  enabled = true,
  rootMargin = "300px",
}: Options) {
  const targetRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const target = targetRef.current;
    if (!target || !enabled) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            onIntersect();
          }
        });
      },
      { rootMargin }
    );

    observer.observe(target);

    return () => {
      observer.disconnect();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [enabled, onIntersect, rootMargin]);

  return targetRef;
}
