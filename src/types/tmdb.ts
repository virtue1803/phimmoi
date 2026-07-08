// Các type dùng chung cho dữ liệu trả về từ TMDB API

export type MediaType = "movie" | "tv";

export interface Genre {
  id: number;
  name: string;
}

/** Cấu trúc rút gọn dùng cho card, banner, list... */
export interface MediaBase {
  id: number;
  media_type?: MediaType;
  title?: string; // movie
  name?: string; // tv
  original_title?: string;
  original_name?: string;
  overview: string;
  poster_path: string | null;
  backdrop_path: string | null;
  release_date?: string; // movie
  first_air_date?: string; // tv
  vote_average: number;
  vote_count: number;
  genre_ids?: number[];
  popularity?: number;
}

export interface MediaListResponse<T = MediaBase> {
  page: number;
  results: T[];
  total_pages: number;
  total_results: number;
}

export interface CastMember {
  id: number;
  name: string;
  character: string;
  profile_path: string | null;
  order: number;
}

export interface CrewMember {
  id: number;
  name: string;
  job: string;
  profile_path: string | null;
}

export interface CreditsResponse {
  cast: CastMember[];
  crew: CrewMember[];
}

export interface VideoItem {
  id: string;
  key: string;
  name: string;
  site: string; // "YouTube"
  type: string; // "Trailer" | "Teaser" | ...
  official: boolean;
}

export interface VideosResponse {
  results: VideoItem[];
}

export interface MovieDetail extends MediaBase {
  media_type?: "movie";
  runtime: number | null;
  genres: Genre[];
  tagline: string | null;
  status: string;
}

export interface TVDetail extends MediaBase {
  media_type?: "tv";
  episode_run_time: number[];
  genres: Genre[];
  number_of_seasons: number;
  number_of_episodes: number;
  tagline: string | null;
  status: string;
}

export type MediaDetail = (MovieDetail | TVDetail) & {
  credits?: CreditsResponse;
  videos?: VideosResponse;
  similar?: MediaListResponse;
  recommendations?: MediaListResponse;
};
