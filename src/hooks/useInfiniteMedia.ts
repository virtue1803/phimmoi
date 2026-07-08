import { getPopular, searchMedia } from "@/lib/tmdb";
import { MediaListResponse, MediaType } from "@/types/tmdb";
import { useInfiniteQuery } from "@tanstack/react-query";

interface UseInfiniteMediaParams {
  mediaType: MediaType;
  query?: string;
}

/**
 * Hook dùng chung cho trang Movies / TV Series.
 * - Nếu có `query` -> gọi API search
 * - Nếu không -> gọi API popular (danh sách phổ biến, giống trang mẫu)
 * Hỗ trợ infinite loading thông qua useInfiniteQuery của TanStack Query.
 */
export function useInfiniteMedia({ mediaType, query }: UseInfiniteMediaParams) {
  const trimmedQuery = query?.trim() ?? "";

  return useInfiniteQuery({
    queryKey: ["media-list", mediaType, trimmedQuery],
    queryFn: ({ pageParam }) =>
      trimmedQuery
        ? searchMedia(mediaType, trimmedQuery, pageParam)
        : getPopular(mediaType, pageParam),
    initialPageParam: 1,
    getNextPageParam: (lastPage: MediaListResponse) => {
      if (lastPage.page < lastPage.total_pages) {
        return lastPage.page + 1;
      }
      return undefined;
    },
  });
}
