"use client";

import { useTrailerModal } from "@/context/TrailerModalContext";
import { pickBestTrailer, useVideos } from "@/hooks/useVideos";
import { getImageUrl } from "@/lib/tmdb";
import { MediaBase } from "@/types/tmdb";
import { getTitle } from "@/utils/format";
import { PlayCircle } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";

interface BannerSliderProps {
  items: MediaBase[];
}

const AUTO_PLAY_INTERVAL = 7000;

export default function BannerSlider({ items }: BannerSliderProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const slides = items.slice(0, 6);
  const active = slides[activeIndex];

  const { openTrailer } = useTrailerModal();
  const { data: videos, isLoading: isVideoLoading } = useVideos(
    "movie",
    active?.id,
    Boolean(active)
  );

  useEffect(() => {
    if (slides.length <= 1) return;
    const timer = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % slides.length);
    }, AUTO_PLAY_INTERVAL);
    return () => clearInterval(timer);
  }, [slides.length]);

  if (!active) return null;

  const backdropUrl = getImageUrl(active.backdrop_path, "original");
  const posterUrl = getImageUrl(active.poster_path, "w500");
  const title = getTitle(active);

  function goTo(index: number) {
    setActiveIndex((index + slides.length) % slides.length);
  }

  function handleWatchTrailer() {
    const trailer = pickBestTrailer(videos?.results);
    if (trailer) {
      openTrailer(trailer.key, title);
    }
  }

  return (
    <section className="relative w-full overflow-hidden bg-background">
      {backdropUrl && (
        <div className="absolute inset-0">
          <Image
            key={active.id}
            src={backdropUrl}
            alt={title}
            fill
            priority
            className="animate-fade-in object-cover object-top opacity-40"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-background via-background/95 to-background/40" />
          <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-background/60" />
        </div>
      )}

      <div className="relative z-10 mx-auto flex max-w-7xl flex-col items-center gap-8 px-4 py-14 sm:px-6 lg:flex-row lg:py-24 lg:px-8">
        {/* Text bên trái */}
        <div className="w-full text-center lg:w-3/5 lg:text-left">
          <h1 className="text-3xl font-extrabold leading-tight text-white sm:text-4xl lg:text-6xl">
            {title}
          </h1>

          <p className="mx-auto mt-5 line-clamp-4 max-w-xl text-sm text-gray-300 sm:text-base lg:mx-0">
            {active.overview || "Chưa có mô tả cho phim này."}
          </p>

          <div className="mt-7 flex flex-wrap items-center justify-center gap-3 lg:justify-start">
            <Link
              href={`/movies/${active.id}`}
              className="rounded-full bg-primary px-6 py-2.5 text-sm font-semibold text-white transition hover:bg-primaryDark"
            >
              Watch now
            </Link>

            <button
              onClick={handleWatchTrailer}
              disabled={isVideoLoading}
              className="flex items-center gap-2 rounded-full border border-white/40 px-6 py-2.5 text-sm font-semibold text-white transition hover:bg-white hover:text-background disabled:opacity-60"
            >
              <PlayCircle className="h-4 w-4" />
              {isVideoLoading ? "Đang tải..." : "Watch trailer"}
            </button>
          </div>
        </div>

        {/* Poster nổi bên phải */}
        <div className="hidden w-full justify-center lg:flex lg:w-2/5">
          {posterUrl && (
            <div className="relative aspect-[2/3] w-56 rotate-2 overflow-hidden rounded-2xl shadow-2xl ring-1 ring-white/10 transition duration-500 hover:rotate-0 xl:w-64">
              <Image src={posterUrl} alt={title} fill className="object-cover" />
            </div>
          )}
        </div>
      </div>

      {slides.length > 1 && (
        <div className="relative z-10 mb-8 flex justify-center gap-2 lg:absolute lg:bottom-6 lg:left-1/2 lg:mb-0 lg:-translate-x-1/2">
          {slides.map((slide, index) => (
            <button
              key={slide.id}
              onClick={() => goTo(index)}
              aria-label={`Chuyển tới slide ${index + 1}`}
              className={`h-1.5 rounded-full transition-all ${
                index === activeIndex ? "w-6 bg-primary" : "w-1.5 bg-white/30"
              }`}
            />
          ))}
        </div>
      )}
    </section>
  );
}
