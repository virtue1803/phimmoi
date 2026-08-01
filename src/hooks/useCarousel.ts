import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type MouseEvent as ReactMouseEvent,
} from "react";

interface UseCarouselOptions {
  /** Chu kỳ tự động cuộn (ms). Truyền 0 để tắt tự động cuộn. */
  autoScrollInterval?: number;
  /**
   * Quãng đường mỗi lần cuộn: số px cố định, hoặc "card" để tính theo
   * chiều rộng thẻ đầu tiên cộng khoảng cách giữa các thẻ.
   */
  scrollStep?: number | "card";
  /** Hệ số nhân quãng đường khi kéo chuột */
  dragSpeed?: number;
  /** Tắt toàn bộ tự động cuộn (vd: khi đang loading) */
  enabled?: boolean;
}

/**
 * Hook dùng chung cho các hàng phim cuộn ngang:
 * - tự động cuộn theo chu kỳ, chạm cuối thì quay về đầu
 * - kéo chuột để cuộn, tự chặn click phát sinh sau khi kéo
 * - tạm dừng tự động cuộn khi đang kéo hoặc khi gọi `pause()`
 */
export function useCarousel({
  autoScrollInterval = 3500,
  scrollStep = "card",
  dragSpeed = 1,
  enabled = true,
}: UseCarouselOptions = {}) {
  const scrollRef = useRef<HTMLDivElement | null>(null);
  const isDragging = useRef(false);
  const hasDragged = useRef(false);
  const dragStartX = useRef(0);
  const dragStartScrollLeft = useRef(0);
  const [isPaused, setIsPaused] = useState(false);

  const getStep = useCallback(() => {
    const track = scrollRef.current;
    if (!track) return 0;
    if (typeof scrollStep === "number") return scrollStep;
    const firstCard = track.firstElementChild as HTMLElement | null;
    if (!firstCard) return 0;
    const gap = parseFloat(getComputedStyle(track).columnGap || "16");
    return firstCard.offsetWidth + gap;
  }, [scrollStep]);

  const scrollByCards = useCallback(
    (cards: number) => {
      scrollRef.current?.scrollBy({ left: getStep() * cards, behavior: "smooth" });
    },
    [getStep]
  );

  useEffect(() => {
    if (!enabled || !autoScrollInterval || isPaused) return;

    const timer = setInterval(() => {
      const track = scrollRef.current;
      if (!track || isDragging.current) return;

      const maxScrollLeft = track.scrollWidth - track.clientWidth;
      if (maxScrollLeft <= 0) return;

      if (track.scrollLeft >= maxScrollLeft - 2) {
        track.scrollTo({ left: 0, behavior: "smooth" });
      } else {
        track.scrollBy({ left: getStep(), behavior: "smooth" });
      }
    }, autoScrollInterval);

    return () => clearInterval(timer);
  }, [enabled, autoScrollInterval, isPaused, getStep]);

  function handleMouseDown(e: ReactMouseEvent<HTMLDivElement>) {
    const track = scrollRef.current;
    if (!track) return;
    isDragging.current = true;
    hasDragged.current = false;
    dragStartX.current = e.pageX;
    dragStartScrollLeft.current = track.scrollLeft;
    track.style.scrollBehavior = "auto";
  }

  function handleMouseMove(e: ReactMouseEvent<HTMLDivElement>) {
    const track = scrollRef.current;
    if (!isDragging.current || !track) return;
    e.preventDefault();
    const delta = (e.pageX - dragStartX.current) * dragSpeed;
    if (Math.abs(delta) > 5) hasDragged.current = true;
    track.scrollLeft = dragStartScrollLeft.current - delta;
  }

  function endDrag() {
    const track = scrollRef.current;
    isDragging.current = false;
    if (track) track.style.scrollBehavior = "";
  }

  /** Chặn click phát sinh ngay sau khi kéo (tránh vô tình bấm vào phim) */
  function handleClickCapture(e: ReactMouseEvent<HTMLDivElement>) {
    if (hasDragged.current) {
      e.preventDefault();
      e.stopPropagation();
      hasDragged.current = false;
    }
  }

  return {
    scrollRef,
    scrollByCards,
    pause: useCallback(() => setIsPaused(true), []),
    resume: useCallback(() => setIsPaused(false), []),
    dragHandlers: {
      onMouseDown: handleMouseDown,
      onMouseMove: handleMouseMove,
      onMouseUp: endDrag,
      onMouseLeave: endDrag,
      onClickCapture: handleClickCapture,
    },
  };
}
