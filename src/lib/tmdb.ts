import {
  CreditsResponse,
  MediaListResponse,
  MediaType,
  MovieDetail,
  TVDetail,
  VideosResponse,
} from "@/types/tmdb";

const TMDB_BASE_URL = "https://api.themoviedb.org/3";
const API_KEY = process.env.NEXT_PUBLIC_TMDB_API_KEY;

export const IMAGE_BASE_URL = "https://image.tmdb.org/t/p";

/** Tạo URL ảnh đầy đủ từ path trả về bởi TMDB */
export function getImageUrl(
  path: string | null | undefined,
  size: "w200" | "w300" | "w342" | "w500" | "w780" | "original" = "w500"
): string | null {
  if (!path) return null;
  return `${IMAGE_BASE_URL}/${size}${path}`;
}

class TmdbError extends Error {
  status?: number;
  constructor(message: string, status?: number) {
    super(message);
    this.name = "TmdbError";
    this.status = status;
  }
}

async function tmdbFetch<T>(
  endpoint: string,
  params: Record<string, string | number | undefined> = {}
): Promise<T> {
  if (!API_KEY) {
    throw new TmdbError(
      "Thiếu NEXT_PUBLIC_TMDB_API_KEY. Vui lòng khai báo trong file .env.local"
    );
  }

  const url = new URL(`${TMDB_BASE_URL}${endpoint}`);
  url.searchParams.set("api_key", API_KEY);
  url.searchParams.set("language", "vi-VN");

  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== "") {
      url.searchParams.set(key, String(value));
    }
  });

  const res = await fetch(url.toString());

  if (!res.ok) {
    throw new TmdbError(`Lỗi khi gọi TMDB API: ${res.statusText}`, res.status);
  }

  return res.json() as Promise<T>;
}

/* ---------------------------- Danh sách phim ---------------------------- */

export function getTrending(mediaType: MediaType, page = 1) {
  return tmdbFetch<MediaListResponse>(`/trending/${mediaType}/week`, { page });
}

export function getTopRated(mediaType: MediaType, page = 1) {
  return tmdbFetch<MediaListResponse>(`/${mediaType}/top_rated`, { page });
}

export function getPopular(mediaType: MediaType, page = 1) {
  return tmdbFetch<MediaListResponse>(`/${mediaType}/popular`, { page });
}

// export function discoverMedia(mediaType: MediaType, page = 1) {
//   return tmdbFetch<MediaListResponse>(`/discover/${mediaType}`, {
//     page,
//     sort_by: "popularity.desc",
//   });
// }

export function discoverMedia(mediaType: MediaType, page = 1, genreId?: string) {
  return tmdbFetch<MediaListResponse>(`/discover/${mediaType}`, {
    page,
    sort_by: "popularity.desc",
    with_genres: genreId,
  });
}

export function searchMedia(mediaType: MediaType, query: string, page = 1) {
  return tmdbFetch<MediaListResponse>(`/search/${mediaType}`, {
    query,
    page,
  });
}

/* ------------------------------ Chi tiết -------------------------------- */

export function getMediaDetail(mediaType: MediaType, id: string | number) {
  return tmdbFetch<MovieDetail | TVDetail>(`/${mediaType}/${id}`, {
    append_to_response: "credits,videos,similar,recommendations",
  });
}

export function getCredits(mediaType: MediaType, id: string | number) {
  return tmdbFetch<CreditsResponse>(`/${mediaType}/${id}/credits`);
}

export function getVideos(mediaType: MediaType, id: string | number) {
  return tmdbFetch<VideosResponse>(`/${mediaType}/${id}/videos`);
}
