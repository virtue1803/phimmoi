"use client";

import ErrorState from "@/components/common/ErrorState";
import LoadingSpinner from "@/components/common/LoadingSpinner";
import { useTrailerModal } from "@/context/TrailerModalContext";
import { useMediaDetail } from "@/hooks/useMediaDetail";
import { pickBestTrailer } from "@/hooks/useVideos";
import { getImageUrl } from "@/lib/tmdb";
import { MediaType } from "@/types/tmdb";
import { getTitle } from "@/utils/format";
import { PlayCircle } from "lucide-react";
import Image from "next/image";
import CastList from "./CastList";
import RelatedMediaRow from "./RelatedMediaRow";
import VideoList from "./VideoList";

interface MediaDetailViewProps {
  mediaType: MediaType;
  id: string;
}

export default function MediaDetailView({ mediaType, id }: MediaDetailViewProps) {
  const { data, isLoading, isError, error, refetch } = useMediaDetail(mediaType, id);
  const { openTrailer } = useTrailerModal();

  if (isLoading) {
    return <LoadingSpinner fullScreen label="Đang tải thông tin phim..." />;
  }

  if (isError || !data) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-16">
        <ErrorState
          message={error instanceof Error ? error.message : "Không thể tải thông tin phim."}
          onRetry={() => refetch()}
        />
      </div>
    );
  }

  const title = getTitle(data);
  const backdropUrl = getImageUrl(data.backdrop_path, "original");
  const posterUrl = getImageUrl(data.poster_path, "w500");
  const trailer = pickBestTrailer(data.videos?.results);

  function handleWatchTrailer() {
    if (trailer) openTrailer(trailer.key, title);
  }

  return (
    <div className="relative w-full min-h-screen">
      
      <div className="absolute top-0 left-0 right-0 h-[60vh] sm:h-[75vh] w-full z-0 pointer-events-none">
        {backdropUrl && (
          <Image
            src={backdropUrl}
            alt={title}
            fill
            priority
            // Tăng opacity lên 70 để ảnh sáng và rõ hơn
            className="object-cover object-top opacity-70"
          />
        )}
      
        {/* <div className="absolute inset-0 bg-gradient-to-r from-background via-background/60 to-transparent" /> */}
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/30 to-transparent" />
      </div>

      
      <div className="relative z-10 mx-auto max-w-9xl px-4 sm:px-6 lg:px-8 pt-24 sm:pt-28">
        
        <div className="flex flex-col gap-6 sm:flex-row sm:items-start sm:gap-10">
          {/* Poster */}
          <div className="relative mx-auto h-72 w-48 flex-shrink-0 overflow-hidden rounded-xl shadow-2xl ring-1 ring-white/10 sm:mx-0 sm:h-[420px] sm:w-[280px]">
            {posterUrl ? (
              <Image src={posterUrl} alt={title} fill className="object-cover" />
            ) : (
              <div className="flex h-full w-full items-center justify-center bg-surfaceLight text-muted">
                Không có ảnh
              </div>
            )}
          </div>

          {/* Info - Header */}
          <div className="relative flex-1 pb-2 text-center sm:pt-4 sm:text-left">
            <h1 className="text-3xl font-extrabold text-white sm:text-5xl lg:text-6xl drop-shadow-lg">
              {title}
            </h1>
            
            <div className="mt-4 flex flex-wrap justify-center gap-2 sm:justify-start">
              {data.genres.map((genre) => (
                <span
                  key={genre.id}
                  className="rounded-full border border-white/30 bg-black/40 px-3 py-1 text-xs text-gray-200 backdrop-blur-sm"
                >
                  {genre.name}
                </span>
              ))}
            </div>

            <p className="mx-auto mt-6 max-w-3xl leading-relaxed text-gray-200 sm:mx-0 text-sm sm:text-base drop-shadow-md">
              {data.overview || "Chưa có mô tả cho phim này."}
            </p>

            {trailer && (
              <button
                onClick={handleWatchTrailer}
                className="mt-6 inline-flex items-center gap-2 rounded-full bg-white px-6 py-2.5 text-sm font-bold text-black transition hover:bg-gray-200"
              >
                <PlayCircle className="h-5 w-5" />
                Xem trailer
              </button>
            )}
          </div>
        </div>

        {/* Cast - Dựa theo ảnh, phần CastList có thể bám ngay sát phần Info */}
        <section className="mt-12 sm:mt-16">
          <h2 className="mb-4 text-lg font-bold text-white sm:text-xl">Diễn viên</h2>
          <CastList cast={data.credits?.cast ?? []} />
        </section>

        {/* Videos */}
        <section className="mt-10">
          <VideoList videos={data.videos?.results ?? []} />
        </section>

        {/* Phim tương tự */}
        <div className="mt-10 pb-16">
          <RelatedMediaRow
            title="Phim tương tự"
            items={
              (data.recommendations?.results?.length
                ? data.recommendations.results
                : data.similar?.results) ?? []
            }
            mediaType={mediaType}
          />
        </div>
      </div>
    </div>
  );
}