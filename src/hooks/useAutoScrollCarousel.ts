import {
  useEffect,
  useRef,
  type MouseEvent as ReactMouseEvent,
  type PointerEvent as ReactPointerEvent,
} from "react";

interface UseAutoScrollCarouselOptions {
  /** Tốc độ tự trượt, px/frame (mặc định 0.6) */
  speed?: number;
  /** Có bật tự động trượt hay không (vd: tắt khi đang loading) */
  enabled?: boolean;
}

/**
 * Hook tạo hiệu ứng carousel tự động trượt từ phải sang trái (tăng dần scrollLeft),
 * đồng thời cho phép người dùng giữ chuột kéo qua lại để tự tương tác.
 * Khi đang kéo (mousedown/pointerdown) thì tạm dừng auto-play, thả chuột ra thì chạy tiếp.
 */
export function useAutoScrollCarousel({
  speed = 0.6,
  enabled = true,
}: UseAutoScrollCarouselOptions = {}) {
  const scrollRef = useRef<HTMLDivElement | null>(null);
  const isDragging = useRef(false);
  const dragStartX = useRef(0);
  const dragStartScrollLeft = useRef(0);
  const dragDistance = useRef(0);
  const rafId = useRef<number | null>(null);

  // Vòng lặp tự trượt
  useEffect(() => {
    if (!enabled) return;
    const el = scrollRef.current;
    if (!el) return;

    function step() {
      const node = scrollRef.current;
      if (node && !isDragging.current) {
        const maxScroll = node.scrollWidth - node.clientWidth;
        if (maxScroll > 0) {
          if (node.scrollLeft >= maxScroll - 1) {
            node.scrollLeft = 0;
          } else {
            node.scrollLeft += speed;
          }
        }
      }
      rafId.current = requestAnimationFrame(step);
    }

    rafId.current = requestAnimationFrame(step);
    return () => {
      if (rafId.current) cancelAnimationFrame(rafId.current);
    };
  }, [enabled, speed]);

  function handlePointerDown(e: ReactPointerEvent<HTMLDivElement>) {
    const node = scrollRef.current;
    if (!node) return;
    isDragging.current = true;
    dragDistance.current = 0;
    dragStartX.current = e.clientX;
    dragStartScrollLeft.current = node.scrollLeft;
    node.setPointerCapture(e.pointerId);
    node.style.cursor = "grabbing";
  }

  function handlePointerMove(e: ReactPointerEvent<HTMLDivElement>) {
    const node = scrollRef.current;
    if (!node || !isDragging.current) return;
    const delta = e.clientX - dragStartX.current;
    dragDistance.current = Math.abs(delta);
    node.scrollLeft = dragStartScrollLeft.current - delta;
  }

  function endDrag(e: ReactPointerEvent<HTMLDivElement>) {
    const node = scrollRef.current;
    if (!node) return;
    isDragging.current = false;
    node.style.cursor = "grab";
    try {
      node.releasePointerCapture(e.pointerId);
    } catch {
      // ignore
    }
  }

  /** Chặn click phát sinh ngay sau khi kéo (tránh vô tình bấm vào phim) */
  function handleClickCapture(e: ReactMouseEvent<HTMLDivElement>) {
    if (dragDistance.current > 5) {
      e.preventDefault();
      e.stopPropagation();
    }
  }

  return {
    scrollRef,
    dragHandlers: {
      onPointerDown: handlePointerDown,
      onPointerMove: handlePointerMove,
      onPointerUp: endDrag,
      onPointerLeave: endDrag,
      onPointerCancel: endDrag,
      onClickCapture: handleClickCapture,
    },
  };
}
