"use client";

import EmptyState from "@/components/common/EmptyState";
import ErrorState from "@/components/common/ErrorState";
import LoadingSpinner from "@/components/common/LoadingSpinner";
import { useInfiniteMedia } from "@/hooks/useInfiniteMedia";
import { MediaType } from "@/types/tmdb";
import { Loader2 } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { FormEvent, useEffect, useState } from "react";
import MediaGrid from "./MediaGrid";

interface MediaListPageProps {
  mediaType: MediaType;
  title: string;
}

// Danh sách ID thể loại chuẩn của TMDB
const MOVIE_GENRES = [
  { id: "28", name: "Hành động" },
  { id: "35", name: "Hài hước" },
  { id: "16", name: "Hoạt hình" },
  { id: "27", name: "Kinh dị" },
  { id: "10749", name: "Tình cảm" },
  { id: "878", name: "Viễn tưởng" },
];

const TV_GENRES = [
  { id: "10759", name: "Hành động & Phiêu lưu" },
  { id: "35", name: "Hài hước" },
  { id: "16", name: "Hoạt hình" },
  { id: "18", name: "Tâm lý - Tình cảm" },
  { id: "10765", name: "Viễn tưởng & Fantasy" },
];

export default function MediaListPage({ mediaType, title }: MediaListPageProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  
  // Lấy params từ URL
  const queryFromUrl = searchParams.get("q") ?? "";
  const genreFromUrl = searchParams.get("genre") ?? "";

  const [searchInput, setSearchInput] = useState(queryFromUrl);

  useEffect(() => {
    setSearchInput(queryFromUrl);
  }, [queryFromUrl]);

  // Truyền thêm genre vào hook
  const {
    data,
    isLoading,
    isError,
    error,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    refetch,
  } = useInfiniteMedia({ mediaType, query: queryFromUrl, genre: genreFromUrl });

  // Xử lý khi Submit form tìm kiếm chữ
  function handleSearchSubmit(e: FormEvent) {
    e.preventDefault();
    const trimmed = searchInput.trim();
    const params = new URLSearchParams(searchParams.toString());
    
    if (trimmed) {
      params.set("q", trimmed);
      params.delete("genre"); // Đã tìm chữ thì xóa lọc thể loại
    } else {
      params.delete("q");
    }
    
    router.push(`?${params.toString()}`);
  }

  // Xử lý khi Chọn dropdown thể loại
  function handleGenreChange(e: React.ChangeEvent<HTMLSelectElement>) {
    const selectedGenre = e.target.value;
    const params = new URLSearchParams(searchParams.toString());
    
    if (selectedGenre) {
      params.set("genre", selectedGenre);
      params.delete("q"); // Đã lọc thể loại thì xóa tìm chữ
      setSearchInput(""); 
    } else {
      params.delete("genre");
    }
    
    router.push(`?${params.toString()}`);
  }

  const items = data?.pages.flatMap((page) => page.results) ?? [];
  const genres = mediaType === "movie" ? MOVIE_GENRES : TV_GENRES;

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <h1 className="text-center text-2xl font-bold text-white sm:text-3xl">{title}</h1>

      {/* Thanh công cụ: Search + Lọc */}
      <div className="mt-8 flex flex-col items-start gap-4 sm:flex-row sm:justify-start">
        {/* Form tìm kiếm */}
        <form onSubmit={handleSearchSubmit} className="flex w-full max-w-md items-center gap-2">
          <input
            type="text"
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            placeholder="Tìm kiếm phim..."
            className="w-full rounded-full bg-white px-4 py-2.5 text-sm text-background placeholder:text-muted/70 focus:outline-none focus:ring-2 focus:ring-green-500"
          />
          <button
            type="submit"
            className="shrink-0 rounded-full bg-green-500 px-6 py-2.5 text-sm font-semibold text-white transition hover:bg-green-600"
          >
            Tìm
          </button>
        </form>

        {/* Dropdown chọn thể loại */}
        <select
          value={genreFromUrl}
          onChange={handleGenreChange}
          className="w-full max-w-[200px] rounded-full bg-surface px-4 py-2.5 text-sm text-white focus:outline-none focus:ring-2 focus:ring-green-500 sm:w-auto"
        >
          <option value="">Tất cả thể loại</option>
          {genres.map((g) => (
            <option key={g.id} value={g.id}>
              {g.name}
            </option>
          ))}
        </select>
      </div>

      <div className="mt-10">
        {isLoading && <LoadingSpinner fullScreen label={`Đang tải ${title.toLowerCase()}...`} />}

        {isError && !isLoading && (
          <ErrorState
            message={error instanceof Error ? error.message : undefined}
            onRetry={() => refetch()}
          />
        )}

        {!isLoading && !isError && items.length === 0 && (
          <EmptyState
            title="Không tìm thấy kết quả"
            description="Không có bộ phim nào phù hợp với tìm kiếm của bạn. Hãy thử lại."
          />
        )}

        {!isLoading && !isError && items.length > 0 && (
          <>
            <MediaGrid items={items} mediaType={mediaType} />

            <div className="mt-8 flex justify-center">
              {hasNextPage ? (
                <button
                  onClick={() => fetchNextPage()}
                  disabled={isFetchingNextPage}
                  className="flex items-center gap-2 rounded-full border border-white bg-transparent px-6 py-2.5 text-sm font-semibold text-white transition hover:bg-white hover:text-black disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {isFetchingNextPage && <Loader2 className="h-4 w-4 animate-spin" />}
                  {isFetchingNextPage ? "Đang tải..." : "Xem thêm"}
                </button>
              ) : (
                <p className="py-2 text-center text-sm text-muted">
                  Đã hiển thị tất cả kết quả.
                </p>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
