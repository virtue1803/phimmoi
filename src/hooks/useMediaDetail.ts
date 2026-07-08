import { getMediaDetail } from "@/lib/tmdb";
import { MediaDetail, MediaType } from "@/types/tmdb";
import { useQuery } from "@tanstack/react-query";

export function useMediaDetail(mediaType: MediaType, id: string) {
  return useQuery({
    queryKey: ["media-detail", mediaType, id],
    queryFn: () => getMediaDetail(mediaType, id) as Promise<MediaDetail>,
    enabled: Boolean(id),
  });
}
