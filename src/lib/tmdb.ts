import {
  CreditsResponse,
  MediaListResponse,
  MediaType,
  MovieDetail,
  TVDetail,
  VideosResponse,
} from "@/types/tmdb";

/** Gọi qua route proxy phía server để không lộ API key ra trình duyệt */
const TMDB_PROXY_URL = "/api/tmdb";

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

/** Chỉ chấp nhận id dạng số của TMDB, tránh chèn ký tự lạ vào đường dẫn */
function assertValidId(id: string | number): string {
  const value = String(id);
  if (!/^\d{1,12}$/.test(value)) {
    throw new TmdbError(`Id không hợp lệ: ${value}`, 400);
  }
  return value;
}

function assertValidMediaType(mediaType: MediaType): MediaType {
  if (mediaType !== "movie" && mediaType !== "tv") {
    throw new TmdbError(`Loại nội dung không hợp lệ: ${mediaType}`, 400);
  }
  return mediaType;
}

async function tmdbFetch<T>(
  endpoint: string,
  params: Record<string, string | number | undefined> = {}
): Promise<T> {
  const search = new URLSearchParams();

  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== "") {
      search.set(key, String(value));
    }
  });

  const queryString = search.toString();
  const res = await fetch(
    `${TMDB_PROXY_URL}${endpoint}${queryString ? `?${queryString}` : ""}`
  );

  if (!res.ok) {
    throw new TmdbError(`Lỗi khi gọi TMDB API: ${res.statusText}`, res.status);
  }

  return res.json() as Promise<T>;
}

/* ---------------------------- Danh sách phim ---------------------------- */

export function getTrending(mediaType: MediaType, page = 1) {
  return tmdbFetch<MediaListResponse>(
    `/trending/${assertValidMediaType(mediaType)}/week`,
    { page }
  );
}

export function getTopRated(mediaType: MediaType, page = 1) {
  return tmdbFetch<MediaListResponse>(
    `/${assertValidMediaType(mediaType)}/top_rated`,
    { page }
  );
}

export function getPopular(mediaType: MediaType, page = 1) {
  return tmdbFetch<MediaListResponse>(
    `/${assertValidMediaType(mediaType)}/popular`,
    { page }
  );
}

// export function discoverMedia(mediaType: MediaType, page = 1) {
//   return tmdbFetch<MediaListResponse>(`/discover/${mediaType}`, {
//     page,
//     sort_by: "popularity.desc",
//   });
// }

export function discoverMedia(mediaType: MediaType, page = 1, genreId?: string) {
  return tmdbFetch<MediaListResponse>(`/discover/${assertValidMediaType(mediaType)}`, {
    page,
    sort_by: "popularity.desc",
    with_genres: genreId,
  });
}

export function searchMedia(mediaType: MediaType, query: string, page = 1) {
  return tmdbFetch<MediaListResponse>(`/search/${assertValidMediaType(mediaType)}`, {
    query,
    page,
  });
}

/* ------------------------------ Chi tiết -------------------------------- */

export function getMediaDetail(mediaType: MediaType, id: string | number) {
  return tmdbFetch<MovieDetail | TVDetail>(
    `/${assertValidMediaType(mediaType)}/${assertValidId(id)}`,
    {
      append_to_response: "credits,videos,similar,recommendations",
    }
  );
}

export function getCredits(mediaType: MediaType, id: string | number) {
  return tmdbFetch<CreditsResponse>(
    `/${assertValidMediaType(mediaType)}/${assertValidId(id)}/credits`
  );
}

export function getVideos(mediaType: MediaType, id: string | number) {
  return tmdbFetch<VideosResponse>(
    `/${assertValidMediaType(mediaType)}/${assertValidId(id)}/videos`
  );
}
