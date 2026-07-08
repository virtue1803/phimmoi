"use client";

import BannerSlider from "@/components/home/BannerSlider";
import MediaRow from "@/components/home/MediaRow";
import LoadingSpinner from "@/components/common/LoadingSpinner";
import { useTopRated, useTrending } from "@/hooks/useHomeData";

export default function HomePage() {
  const trendingMovies = useTrending("movie");
  const topRatedMovies = useTopRated("movie");
  const trendingTV = useTrending("tv");
  const topRatedTV = useTopRated("tv");

  // Banner dùng danh sách trending movies làm phim nổi bật
  if (trendingMovies.isLoading) {
    return <LoadingSpinner fullScreen label="Đang tải trang chủ..." />;
  }

  return (
    <div>
      {trendingMovies.data && trendingMovies.data.results.length > 0 && (
        <BannerSlider items={trendingMovies.data.results} />
      )}

      <MediaRow
        title="Phim lẻ thịnh hành"
        mediaType="movie"
        items={trendingMovies.data?.results}
        isLoading={trendingMovies.isLoading}
        isError={trendingMovies.isError}
        onRetry={() => trendingMovies.refetch()}
        viewAllHref="/movies"
      />

      <MediaRow
        title="Phim lẻ đánh giá cao nhất"
        mediaType="movie"
        items={topRatedMovies.data?.results}
        isLoading={topRatedMovies.isLoading}
        isError={topRatedMovies.isError}
        onRetry={() => topRatedMovies.refetch()}
        viewAllHref="/movies"
      />

      <MediaRow
        title="Phim bộ thịnh hành"
        mediaType="tv"
        items={trendingTV.data?.results}
        isLoading={trendingTV.isLoading}
        isError={trendingTV.isError}
        onRetry={() => trendingTV.refetch()}
        viewAllHref="/tv"
      />

      <MediaRow
        title="Phim bộ đánh giá cao nhất"
        mediaType="tv"
        items={topRatedTV.data?.results}
        isLoading={topRatedTV.isLoading}
        isError={topRatedTV.isError}
        onRetry={() => topRatedTV.refetch()}
        viewAllHref="/tv"
      />
    </div>
  );
}
