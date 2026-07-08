import { MediaBase, MediaType } from "@/types/tmdb";
import MediaCard from "./MediaCard";

interface RelatedMediaRowProps {
  title: string;
  items: MediaBase[];
  mediaType: MediaType;
}

export default function RelatedMediaRow({ title, items, mediaType }: RelatedMediaRowProps) {
  if (items.length === 0) return null;

  return (
    <section>
      <h2 className="mb-4 text-lg font-bold text-white sm:text-xl">{title}</h2>
      <div className="flex gap-4 overflow-x-auto pb-2 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        {items.slice(0, 12).map((item) => (
          <div key={item.id} className="w-[150px] flex-shrink-0 sm:w-[180px]">
            <MediaCard item={item} mediaType={mediaType} />
          </div>
        ))}
      </div>
    </section>
  );
}
