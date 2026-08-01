import { useTrailerModal } from "@/context/TrailerModalContext";
import { getVideos } from "@/lib/tmdb";
import { MediaType, VideoItem } from "@/types/tmdb";
import { useQuery } from "@tanstack/react-query";
import { useCallback } from "react";

export function useVideos(mediaType: MediaType, id: number | string, enabled = true) {
  return useQuery({
    queryKey: ["videos", mediaType, id],
    queryFn: () => getVideos(mediaType, id),
    enabled: Boolean(id) && enabled,
  });
}

/** Chọn trailer chính thức (ưu tiên type Trailer, official, YouTube) */
export function pickBestTrailer(videos: VideoItem[] | undefined): VideoItem | undefined {
  if (!videos || videos.length === 0) return undefined;
  const youtubeVideos = videos.filter((v) => v.site === "YouTube");

  return (
    youtubeVideos.find((v) => v.type === "Trailer" && v.official) ??
    youtubeVideos.find((v) => v.type === "Trailer") ??
    youtubeVideos.find((v) => v.type === "Teaser") ??
    youtubeVideos[0]
  );
}

/** Chọn trailer tốt nhất trong danh sách video và mở modal xem trailer */
export function useTrailerLauncher(videos: VideoItem[] | undefined, title: string) {
  const { openTrailer } = useTrailerModal();
  const trailer = pickBestTrailer(videos);

  const playTrailer = useCallback(() => {
    if (trailer) openTrailer(trailer.key, title);
  }, [trailer, title, openTrailer]);

  return { trailer, playTrailer };
}
