import { MediaBase, MediaType } from "@/types/tmdb";
import EmptyState from "../common/EmptyState";
import MediaCard from "./MediaCard";

interface MediaGridProps {
  items: MediaBase[];
  mediaType: MediaType;
}

export default function MediaGrid({ items, mediaType }: MediaGridProps) {
  if (items.length === 0) {
    return <EmptyState />;
  }

  return (
    <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
      {items.map((item) => (
        <MediaCard key={item.id} item={item} mediaType={mediaType} />
      ))}
    </div>
  );
}
