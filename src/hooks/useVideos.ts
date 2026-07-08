import { getVideos } from "@/lib/tmdb";
import { MediaType, VideoItem } from "@/types/tmdb";
import { useQuery } from "@tanstack/react-query";

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
