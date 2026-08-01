import { getPopular, searchMedia, discoverMedia } from "@/lib/tmdb";
import { MediaListResponse, MediaType } from "@/types/tmdb";
import { useInfiniteQuery } from "@tanstack/react-query";

interface UseInfiniteMediaParams {
  mediaType: MediaType;
  query?: string;
  genre?: string; 
}

export function useInfiniteMedia({ mediaType, query, genre }: UseInfiniteMediaParams) {
  const trimmedQuery = query?.trim() ?? "";

  return useInfiniteQuery({
    queryKey: ["media-list", mediaType, trimmedQuery, genre],
    queryFn: ({ pageParam }) => {
      if (trimmedQuery) {
        return searchMedia(mediaType, trimmedQuery, pageParam);
      }
      if (genre) {
        return discoverMedia(mediaType, pageParam, genre);
      }
      return getPopular(mediaType, pageParam);
    },
    initialPageParam: 1,
    getNextPageParam: (lastPage: MediaListResponse) => {
      if (lastPage.page < lastPage.total_pages) {
        return lastPage.page + 1;
      }
      return undefined;
    },
  });
}