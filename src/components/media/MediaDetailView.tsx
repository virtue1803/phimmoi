"use client";

import ErrorState from "@/components/common/ErrorState";
import LoadingSpinner from "@/components/common/LoadingSpinner";
import { useTrailerModal } from "@/context/TrailerModalContext";
import { useMediaDetail } from "@/hooks/useMediaDetail";
import { pickBestTrailer } from "@/hooks/useVideos";
import { getImageUrl } from "@/lib/tmdb";
import { MediaType, MovieDetail, TVDetail } from "@/types/tmdb";
import {
  formatFullDate,
  formatRuntime,
  getReleaseDate,
  getTitle,
} from "@/utils/format";
import { Calendar, Clock, PlayCircle, Star } from "lucide-react";
import Image from "next/image";
import CastList from "./CastList";
import RatingBadge from "./RatingBadge";
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
  const runtime =
    mediaType === "movie"
      ? (data as MovieDetail).runtime
      : (data as TVDetail).episode_run_time?.[0];

  const trailer = pickBestTrailer(data.videos?.results);

  function handleWatchTrailer() {
    if (trailer) openTrailer(trailer.key, title);
  }

  return (
    <div>
      {/* Hero backdrop */}
      <div className="relative h-[45vh] min-h-[320px] w-full sm:h-[55vh]">
        {backdropUrl && (
          <Image src={backdropUrl} alt={title} fill priority className="object-cover object-top" />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/70 to-background/20" />
      </div>

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-20">
        {/* Poster + info */}
        <div className="-mt-32 flex flex-col gap-6 sm:-mt-40 sm:flex-row sm:items-end">
          <div className="relative mx-auto h-56 w-40 flex-shrink-0 overflow-hidden rounded-xl shadow-2xl sm:mx-0 sm:h-72 sm:w-48">
            {posterUrl ? (
              <Image src={posterUrl} alt={title} fill className="object-cover" />
            ) : (
              <div className="flex h-full w-full items-center justify-center bg-surfaceLight text-muted">
                Không có ảnh
              </div>
            )}
          </div>

          <div className="flex-1 pb-2 text-center sm:text-left">
            <h1 className="text-2xl font-extrabold text-white sm:text-4xl">{title}</h1>
            {data.tagline && (
              <p className="mt-1 italic text-muted">{data.tagline}</p>
            )}

            <div className="mt-4 flex flex-wrap items-center justify-center gap-4 sm:justify-start">
              <RatingBadge vote={data.vote_average} size="md" />

              <div className="flex items-center gap-1 text-sm text-gray-200">
                <Calendar className="h-4 w-4 text-muted" />
                {formatFullDate(getReleaseDate(data))}
              </div>

              <div className="flex items-center gap-1 text-sm text-gray-200">
                <Clock className="h-4 w-4 text-muted" />
                {formatRuntime(runtime)}
              </div>

              <div className="flex items-center gap-1 text-sm text-gray-200">
                <Star className="h-4 w-4 text-yellow-400" />
                {data.vote_count.toLocaleString("vi-VN")} lượt đánh giá
              </div>
            </div>

            <div className="mt-4 flex flex-wrap justify-center gap-2 sm:justify-start">
              {data.genres.map((genre) => (
                <span
                  key={genre.id}
                  className="rounded-full bg-surfaceLight px-3 py-1 text-xs text-gray-200"
                >
                  {genre.name}
                </span>
              ))}
            </div>

            {trailer && (
              <button
                onClick={handleWatchTrailer}
                className="mt-5 flex items-center gap-2 rounded-full bg-primary px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-primaryDark"
              >
                <PlayCircle className="h-5 w-5" />
                Xem trailer
              </button>
            )}
          </div>
        </div>

        {/* Overview */}
        <section className="mt-10">
          <h2 className="mb-3 text-lg font-bold text-white sm:text-xl">Nội dung phim</h2>
          <p className="max-w-3xl leading-relaxed text-gray-300">
            {data.overview || "Chưa có mô tả cho phim này."}
          </p>
        </section>

        {/* Cast */}
        <section className="mt-10">
          <h2 className="mb-4 text-lg font-bold text-white sm:text-xl">Diễn viên</h2>
          <CastList cast={data.credits?.cast ?? []} />
        </section>

        {/* Videos */}
        <section className="mt-10">
          <h2 className="mb-4 text-lg font-bold text-white sm:text-xl">Video & Trailer</h2>
          <VideoList videos={data.videos?.results ?? []} title={title} />
        </section>

        {/* Recommendations */}
        <div className="mt-10 flex flex-col gap-10 pb-16">
          <RelatedMediaRow
            title="Phim đề xuất"
            items={data.recommendations?.results ?? []}
            mediaType={mediaType}
          />
          <RelatedMediaRow
            title="Phim liên quan"
            items={data.similar?.results ?? []}
            mediaType={mediaType}
          />
        </div>
      </div>
    </div>
  );
}
