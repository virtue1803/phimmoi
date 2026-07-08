import { getTopRated, getTrending } from "@/lib/tmdb";
import { MediaType } from "@/types/tmdb";
import { useQuery } from "@tanstack/react-query";

/** Lấy danh sách trending theo tuần cho 1 loại media */
export function useTrending(mediaType: MediaType) {
  return useQuery({
    queryKey: ["trending", mediaType],
    queryFn: () => getTrending(mediaType),
  });
}

/** Lấy danh sách top rated cho 1 loại media */
export function useTopRated(mediaType: MediaType) {
  return useQuery({
    queryKey: ["top_rated", mediaType],
    queryFn: () => getTopRated(mediaType),
  });
}
