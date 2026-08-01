"use client";

import { getYoutubeEmbedUrl } from "@/utils/youtube";
import { X } from "lucide-react";
import { useEffect } from "react";

interface TrailerModalProps {
  videoKey: string;
  title: string;
  onClose: () => void;
}

export default function TrailerModal({ videoKey, title, onClose }: TrailerModalProps) {
  // Khóa scroll nền + đóng modal bằng phím Esc
  useEffect(() => {
    document.body.style.overflow = "hidden";
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [onClose]);

  const embedUrl = getYoutubeEmbedUrl(videoKey, true);

  return (
    <div
      className="fixed inset-0 z-[100] flex animate-fade-in items-center justify-center bg-black/80 p-4"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label={`Trailer: ${title}`}
    >
      <div
        className="relative w-full max-w-4xl overflow-hidden rounded-xl bg-black shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute right-3 top-3 z-10 rounded-full bg-black/60 p-2 text-white transition hover:bg-primary"
          aria-label="Đóng"
        >
          <X className="h-5 w-5" />
        </button>

        <div className="aspect-video w-full">
          {embedUrl ? (
            <iframe
              className="h-full w-full"
              src={embedUrl}
              title={title}
              sandbox="allow-scripts allow-same-origin allow-presentation"
              referrerPolicy="strict-origin-when-cross-origin"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center text-sm text-muted">
              Video không hợp lệ.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
