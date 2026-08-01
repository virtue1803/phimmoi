"use client";

import ErrorState from "@/components/common/ErrorState";
import LoadingSpinner from "@/components/common/LoadingSpinner";
import MediaCard from "@/components/media/MediaCard";
import { useCarousel } from "@/hooks/useCarousel";
import { MediaBase, MediaType } from "@/types/tmdb";
import { DRAGGABLE_TRACK, SECTION_HEADING } from "@/utils/styles";
import { ChevronRight } from "lucide-react";
import Link from "next/link";

interface MediaRowProps {
  title: string;
  mediaType: MediaType;
  items?: MediaBase[];
  isLoading: boolean;
  isError: boolean;
  onRetry?: () => void;
  viewAllHref?: string;
}

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
  const { scrollRef, scrollByCards, dragHandlers, pause, resume } = useCarousel({
    autoScrollInterval: AUTO_SCROLL_INTERVAL,
    enabled: Boolean(items && items.length > 0),
  });

  return (
    <section
      className="mx-auto max-w-8xl px-4 py-6 sm:px-6 lg:px-8"
      onMouseEnter={pause}
      onMouseLeave={resume}
    >
      <div className="mb-4 flex items-center justify-between">
        <h2 className={SECTION_HEADING}>{title}</h2>
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

          <div ref={scrollRef} {...dragHandlers} className={`${DRAGGABLE_TRACK} scroll-smooth`}>
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
