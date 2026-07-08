"use client";

import { useEffect, useRef } from "react";
import { MediaBase, MediaType } from "@/types/tmdb";
import MediaCard from "./MediaCard";

interface RelatedMediaRowProps {
  title: string;
  items: MediaBase[];
  mediaType: MediaType;
}

export default function RelatedMediaRow({
  title,
  items,
  mediaType,
}: RelatedMediaRowProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;

    if (!container) return;

    const interval = setInterval(() => {
      const maxScroll =
        container.scrollWidth - container.clientWidth;

      if (container.scrollLeft >= maxScroll - 10) {
        container.scrollTo({
          left: 0,
          behavior: "smooth",
        });
      } else {
        container.scrollBy({
          left: 220,
          behavior: "smooth",
        });
      }
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  if (!items.length) return null;

  return (
    <section>
      <h2 className="mb-4 text-lg font-bold text-white sm:text-xl">
        {title}
      </h2>

      <div
        ref={containerRef}
        className="flex gap-4 overflow-x-auto pb-2 scroll-smooth [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
      >
        {items.slice(0, 12).map((item) => (
          <div
            key={item.id}
            className="w-[150px] flex-shrink-0 sm:w-[180px]"
          >
            <MediaCard item={item} mediaType={mediaType} />
          </div>
        ))}
      </div>
    </section>
  );
}