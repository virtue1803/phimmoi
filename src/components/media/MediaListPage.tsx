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

export default function MediaListPage({ mediaType, title }: MediaListPageProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const queryFromUrl = searchParams.get("q") ?? "";

  const [searchInput, setSearchInput] = useState(queryFromUrl);

  useEffect(() => {
    setSearchInput(queryFromUrl);
  }, [queryFromUrl]);

  const {
    data,
    isLoading,
    isError,
    error,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    refetch,
  } = useInfiniteMedia({ mediaType, query: queryFromUrl });

  function handleSearchSubmit(e: FormEvent) {
    e.preventDefault();
    const trimmed = searchInput.trim();
    const params = new URLSearchParams(searchParams.toString());
    if (trimmed) {
      params.set("q", trimmed);
    } else {
      params.delete("q");
    }
    router.push(`?${params.toString()}`);
  }

  const items = data?.pages.flatMap((page) => page.results) ?? [];

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <h1 className="text-center text-2xl font-bold text-white sm:text-3xl">{title}</h1>

      <form
        onSubmit={handleSearchSubmit}
        className="mt-8 flex w-full max-w-md items-center gap-2"
      >
        <input
          type="text"
          value={searchInput}
          onChange={(e) => setSearchInput(e.target.value)}
          placeholder="Enter keyword"
          className="w-full rounded-full bg-white px-4 py-2.5 text-sm text-background placeholder:text-muted/70 focus:outline-none focus:ring-2 focus:ring-primary"
        />
        <button
          type="submit"
          className="shrink-0 rounded-full bg-primary px-6 py-2.5 text-sm font-semibold text-white transition hover:bg-primaryDark"
        >
          Search
        </button>
      </form>

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
            description={
              queryFromUrl
                ? `Không có kết quả nào khớp với "${queryFromUrl}". Hãy thử từ khóa khác.`
                : "Hiện chưa có dữ liệu để hiển thị."
            }
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
                  className="flex items-center gap-2 rounded-full border border-white bg-transparent px-6 py-2.5 text-sm font-semibold text-white transition hover:bg-white hover:text-background disabled:cursor-not-allowed disabled:opacity-60"
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
