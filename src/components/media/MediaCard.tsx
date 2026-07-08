import { getImageUrl } from "@/lib/tmdb";
import { MediaBase, MediaType } from "@/types/tmdb";
import { getReleaseDate, getTitle, formatYear, getMediaPath } from "@/utils/format";
import { Film } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

interface MediaCardProps {
  item: MediaBase;
  mediaType: MediaType;
}

export default function MediaCard({ item, mediaType }: MediaCardProps) {
  const title = getTitle(item);
  const year = formatYear(getReleaseDate(item));
  const posterUrl = getImageUrl(item.poster_path, "w342");

  return (
    <Link href={`/${getMediaPath(mediaType)}/${item.id}`} className="group flex flex-col gap-2">
      <div className="relative aspect-[2/3] w-full overflow-hidden rounded-xl bg-surfaceLight ring-1 ring-white/5 transition duration-200 group-hover:-translate-y-1 group-hover:ring-primary/60">
        {posterUrl ? (
          <Image
            src={posterUrl}
            alt={title}
            fill
            sizes="(max-width: 768px) 45vw, (max-width: 1200px) 20vw, 200px"
            className="object-cover transition duration-300 group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full w-full flex-col items-center justify-center gap-2 text-muted">
            <Film className="h-10 w-10" />
            <span className="text-xs">Không có ảnh</span>
          </div>
        )}
      </div>

      <div>
        <h3 className="line-clamp-1 text-sm font-semibold text-white group-hover:text-primary">
          {title}
        </h3>
        <span className="text-xs text-muted">{year}</span>
      </div>
    </Link>
  );
}
