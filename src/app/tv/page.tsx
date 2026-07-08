import LoadingSpinner from "@/components/common/LoadingSpinner";
import MediaListPage from "@/components/media/MediaListPage";
import { Suspense } from "react";

export const metadata = {
  title: "Phim bộ - Phimmoi",
};

export default function TVPage() {
  return (
    <Suspense fallback={<LoadingSpinner fullScreen />}>
      <MediaListPage mediaType="tv" title="Phim bộ" />
    </Suspense>
  );
}
