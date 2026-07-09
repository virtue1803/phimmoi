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
  
  // Các Ref dùng cho tính năng dùng chuột kéo thả (Drag to scroll)
  const isDown = useRef(false);
  const startX = useRef(0);
  const scrollLeft = useRef(0);

  // Nhân đôi mảng items để tạo cảm giác cuộn vô hạn dài hơn (Seamless feel)
  const displayItems = items.slice(0, 12);
  const loopedItems = [...displayItems, ...displayItems]; 

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const interval = setInterval(() => {
      // Tạm dừng tự động cuộn nếu người dùng đang dùng chuột kéo
      if (isDown.current) return;

      const maxScroll = container.scrollWidth - container.clientWidth;

      // Khi chạm đến cuối, cuộn mượt mà về đầu
      if (container.scrollLeft >= maxScroll - 10) {
        container.scrollTo({ left: 0, behavior: "smooth" });
      } else {
        container.scrollBy({ left: 220, behavior: "smooth" });
      }
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  // --- CÁC HÀM XỬ LÝ KÉO THẢ BẰNG CHUỘT ---
  const handleMouseDown = (e: React.MouseEvent) => {
    isDown.current = true;
    if (!containerRef.current) return;
    
    // Tắt scroll-smooth khi đang kéo để chuột di chuyển không bị delay
    containerRef.current.style.scrollBehavior = "auto";
    startX.current = e.pageX - containerRef.current.offsetLeft;
    scrollLeft.current = containerRef.current.scrollLeft;
  };

  const handleMouseLeaveOrUp = () => {
    isDown.current = false;
    if (containerRef.current) {
      // Bật lại smooth scroll cho hiệu ứng tự động cuộn
      containerRef.current.style.scrollBehavior = "smooth";
    }
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDown.current || !containerRef.current) return;
    e.preventDefault(); // Ngăn hành vi bôi đen text/ảnh mặc định
    const x = e.pageX - containerRef.current.offsetLeft;
    const walk = (x - startX.current) * 1.5; // Nhân 1.5 để kéo nhanh hơn một chút
    containerRef.current.scrollLeft = scrollLeft.current - walk;
  };

  if (!items.length) return null;

  return (
    <section>
      <h2 className="mb-4 text-lg font-bold text-white sm:text-xl">
        {title}
      </h2>

      <div
        ref={containerRef}
        // Thêm con trỏ chuột dạng bàn tay (cursor-grab) và chống bôi đen (select-none)
        className="flex gap-4 overflow-x-auto pb-2 scroll-smooth [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden cursor-grab active:cursor-grabbing select-none"
        onMouseDown={handleMouseDown}
        onMouseLeave={handleMouseLeaveOrUp}
        onMouseUp={handleMouseLeaveOrUp}
        onMouseMove={handleMouseMove}
      >
        {loopedItems.map((item, index) => (
          <div
            // Dùng index kết hợp ID vì mảng đã bị nhân đôi, tránh lỗi trùng key
            key={`${item.id}-${index}`}
            className="w-[150px] flex-shrink-0 sm:w-[180px]"
          >
            {/* Chú ý: Bên trong MediaCard nếu có thẻ <img />, bạn nên thêm draggable={false} 
                để khi kéo chuột không bị dính cái bóng ảnh mặc định của trình duyệt nhé */}
            <MediaCard item={item} mediaType={mediaType} />
          </div>
        ))}
      </div>
    </section>
  );
}