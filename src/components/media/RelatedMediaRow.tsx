"use client";

import { useCarousel } from "@/hooks/useCarousel";
import { MediaBase, MediaType } from "@/types/tmdb";
import { DRAGGABLE_TRACK, SECTION_HEADING } from "@/utils/styles";
import MediaCard from "./MediaCard";

interface RelatedMediaRowProps {
  title: string;
  items: MediaBase[];
  mediaType: MediaType;
}

const AUTO_SCROLL_INTERVAL = 3000;
const SCROLL_STEP = 220;

export default function RelatedMediaRow({
  title,
  items,
  mediaType,
}: RelatedMediaRowProps) {
  const { scrollRef, dragHandlers } = useCarousel({
    autoScrollInterval: AUTO_SCROLL_INTERVAL,
    scrollStep: SCROLL_STEP,
    dragSpeed: 1.5,
    enabled: items.length > 0,
  });

  // Nhân đôi mảng items để tạo cảm giác cuộn vô hạn dài hơn (seamless feel)
  const displayItems = items.slice(0, 12);
  const loopedItems = [...displayItems, ...displayItems];

  if (!items.length) return null;

  return (
    <section>
      <h2 className={`mb-4 ${SECTION_HEADING}`}>{title}</h2>

      <div ref={scrollRef} {...dragHandlers} className={`${DRAGGABLE_TRACK} scroll-smooth`}>
        {loopedItems.map((item, index) => (
          <div
            // Dùng index kết hợp ID vì mảng đã bị nhân đôi, tránh lỗi trùng key
            key={`${item.id}-${index}`}
            className="w-[150px] flex-shrink-0 sm:w-[180px]"
          >
            <MediaCard item={item} mediaType={mediaType} />
          </div>
        ))}
      </div>
    </section>
  );
}
