import LoadingSpinner from "@/components/common/LoadingSpinner";
import MediaListPage from "@/components/media/MediaListPage";
import { Suspense } from "react";

export const metadata = {
  title: "Phim lẻ - Phimmoi",
};

export default function MoviesPage() {
  return (
    <Suspense fallback={<LoadingSpinner fullScreen />}>
      <MediaListPage mediaType="movie" title="Phim lẻ" />
    </Suspense>
  );
}
