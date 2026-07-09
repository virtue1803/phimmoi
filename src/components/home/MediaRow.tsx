"use client";

import ErrorState from "@/components/common/ErrorState";
import LoadingSpinner from "@/components/common/LoadingSpinner";
import MediaCard from "@/components/media/MediaCard";
import { MediaBase, MediaType } from "@/types/tmdb";
import { ChevronRight } from "lucide-react";
import Link from "next/link";
import { MouseEvent as ReactMouseEvent, useEffect, useRef, useState } from "react";

interface MediaRowProps {
  title: string;
  mediaType: MediaType;
  items?: MediaBase[];
  isLoading: boolean;
  isError: boolean;
  onRetry?: () => void;
  viewAllHref?: string;
}

// Khoảng thời gian (ms) giữa mỗi lần tự động trượt sang thẻ tiếp theo
const AUTO_SCROLL_INTERVAL = 3500;

export default function MediaRow({
  title,
  mediaType,
  items,
  isLoading,
  isError,
  onRetry,
  viewAllHref,
}: MediaRowProps) {
  const scrollRef = useRef<HTMLDivElement | null>(null);
  const isDragging = useRef(false);
  const hasDragged = useRef(false);
  const dragStartX = useRef(0);
  const dragStartScrollLeft = useRef(0);
  const [isPaused, setIsPaused] = useState(false);

  /** Chiều rộng của 1 thẻ + khoảng cách (gap) giữa các thẻ */
  function getCardStep(): number {
    const track = scrollRef.current;
    if (!track) return 0;
    const firstCard = track.firstElementChild as HTMLElement | null;
    if (!firstCard) return 0;
    const gap = parseFloat(getComputedStyle(track).columnGap || "16");
    return firstCard.offsetWidth + gap;
  }

  function scrollByCards(cards: number) {
    scrollRef.current?.scrollBy({ left: getCardStep() * cards, behavior: "smooth" });
  }

  // Tự động trượt slide từ phải sang trái, quay lại đầu khi đến cuối
  useEffect(() => {
    if (!items || items.length === 0 || isPaused) return;

    const timer = setInterval(() => {
      const track = scrollRef.current;
      if (!track) return;

      const maxScrollLeft = track.scrollWidth - track.clientWidth;
      if (track.scrollLeft >= maxScrollLeft - 2) {
        track.scrollTo({ left: 0, behavior: "smooth" });
      } else {
        track.scrollBy({ left: getCardStep(), behavior: "smooth" });
      }
    }, AUTO_SCROLL_INTERVAL);

    return () => clearInterval(timer);
  }, [items, isPaused]);

  // Kéo chuột để cuộn ngang (drag to scroll)
  function handleMouseDown(e: ReactMouseEvent<HTMLDivElement>) {
    const track = scrollRef.current;
    if (!track) return;
    isDragging.current = true;
    hasDragged.current = false;
    dragStartX.current = e.pageX;
    dragStartScrollLeft.current = track.scrollLeft;
    setIsPaused(true);
  }

  function handleMouseMove(e: ReactMouseEvent<HTMLDivElement>) {
    if (!isDragging.current) return;
    const track = scrollRef.current;
    if (!track) return;
    e.preventDefault();
    const delta = e.pageX - dragStartX.current;
    if (Math.abs(delta) > 5) hasDragged.current = true;
    track.scrollLeft = dragStartScrollLeft.current - delta;
  }

  function endDrag() {
    isDragging.current = false;
    setIsPaused(false);
  }

  // Chặn click mở trang phim ngay sau khi vừa kéo chuột
  function handleClickCapture(e: ReactMouseEvent<HTMLDivElement>) {
    if (hasDragged.current) {
      e.preventDefault();
      e.stopPropagation();
      hasDragged.current = false;
    }
  }

  return (
    <section
      className="mx-auto max-w-8xl px-4 py-6 sm:px-6 lg:px-8"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => {
        endDrag();
        setIsPaused(false);
      }}
    >
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-lg font-bold text-white sm:text-xl">{title}</h2>
        {viewAllHref && (
          <Link
            href={viewAllHref}
            className="rounded-full border border-white/25 px-4 py-1.5 text-xs font-medium text-white transition hover:bg-white hover:text-background"
          >
            View more
          </Link>
        )}
      </div>

      {isLoading && <LoadingSpinner label={`Đang tải ${title.toLowerCase()}...`} />}

      {isError && !isLoading && <ErrorState onRetry={onRetry} />}

      {!isLoading && !isError && items && items.length > 0 && (
        <div className="group/row relative">
          <button
            onClick={() => scrollByCards(-2)}
            className="absolute left-0 top-1/2 z-10 hidden -translate-y-1/2 rounded-full bg-black/50 p-2 text-white opacity-0 transition hover:bg-black/80 group-hover/row:opacity-100 sm:block"
            aria-label="Cuộn trái"
          >
            <ChevronRight className="h-5 w-5 rotate-180" />
          </button>

          <div
            ref={scrollRef}
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={endDrag}
            onMouseLeave={endDrag}
            onClickCapture={handleClickCapture}
            className="flex cursor-grab select-none gap-4 overflow-x-auto scroll-smooth pb-2 active:cursor-grabbing [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
          >
            {items.map((item) => (
              <div
                key={item.id}
                className="w-[calc((100%_-_16px)/2)] flex-shrink-0 sm:w-[calc((100%_-_32px)/3)] md:w-[calc((100%_-_48px)/4)] lg:w-[calc((100%_-_80px)/6)]"
              >
                <MediaCard item={item} mediaType={mediaType} />
              </div>
            ))}
          </div>

          <button
            onClick={() => scrollByCards(2)}
            className="absolute right-0 top-1/2 z-10 hidden -translate-y-1/2 rounded-full bg-black/50 p-2 text-white opacity-0 transition hover:bg-black/80 group-hover/row:opacity-100 sm:block"
            aria-label="Cuộn phải"
          >
            <ChevronRight className="h-5 w-5" />
          </button>
        </div>
      )}

      {!isLoading && !isError && (!items || items.length === 0) && (
        <p className="text-sm text-muted">Chưa có dữ liệu để hiển thị.</p>
      )}
    </section>
  );
}
