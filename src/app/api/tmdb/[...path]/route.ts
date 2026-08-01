import { NextRequest, NextResponse } from "next/server";

const TMDB_BASE_URL = "https://api.themoviedb.org/3";
const API_KEY = process.env.TMDB_API_KEY;

/** Các endpoint TMDB được phép proxy */
const ALLOWED_PATHS: RegExp[] = [
  /^trending\/(movie|tv)\/(day|week)$/,
  /^(movie|tv)\/(popular|top_rated)$/,
  /^discover\/(movie|tv)$/,
  /^search\/(movie|tv)$/,
  /^(movie|tv)\/\d{1,12}$/,
  /^(movie|tv)\/\d{1,12}\/(credits|videos)$/,
];

const ALLOWED_APPEND = new Set(["credits", "videos", "similar", "recommendations"]);
const ALLOWED_SORT_BY = new Set([
  "popularity.desc",
  "popularity.asc",
  "vote_average.desc",
  "primary_release_date.desc",
]);

/** Lọc query param của client, chỉ giữ lại giá trị hợp lệ */
function sanitizeParams(search: URLSearchParams): URLSearchParams {
  const params = new URLSearchParams();

  const page = Number(search.get("page") ?? "1");
  if (Number.isInteger(page) && page >= 1 && page <= 500) {
    params.set("page", String(page));
  }

  const query = search.get("query");
  if (query) params.set("query", query.slice(0, 200));

  const sortBy = search.get("sort_by");
  if (sortBy && ALLOWED_SORT_BY.has(sortBy)) params.set("sort_by", sortBy);

  const withGenres = search.get("with_genres");
  if (withGenres && /^\d{1,7}(,\d{1,7})*$/.test(withGenres)) {
    params.set("with_genres", withGenres);
  }

  const append = search.get("append_to_response");
  if (append) {
    const parts = append.split(",").filter((part) => ALLOWED_APPEND.has(part));
    if (parts.length > 0) params.set("append_to_response", parts.join(","));
  }

  return params;
}

export async function GET(
  request: NextRequest,
  { params }: { params: { path: string[] } }
) {
  if (!API_KEY) {
    return NextResponse.json(
      { error: "Thiếu TMDB_API_KEY trên server. Vui lòng khai báo trong file .env.local" },
      { status: 500 }
    );
  }

  const endpoint = params.path.join("/");
  if (!ALLOWED_PATHS.some((pattern) => pattern.test(endpoint))) {
    return NextResponse.json({ error: "Endpoint không được hỗ trợ" }, { status: 400 });
  }

  const url = new URL(`${TMDB_BASE_URL}/${endpoint}`);
  sanitizeParams(request.nextUrl.searchParams).forEach((value, key) => {
    url.searchParams.set(key, value);
  });
  url.searchParams.set("language", "vi-VN");
  url.searchParams.set("api_key", API_KEY);

  const res = await fetch(url, { next: { revalidate: 300 } });

  if (!res.ok) {
    return NextResponse.json(
      { error: `Lỗi khi gọi TMDB API: ${res.statusText}` },
      { status: res.status }
    );
  }

  return NextResponse.json(await res.json(), {
    headers: { "Cache-Control": "public, max-age=0, s-maxage=300" },
  });
}
