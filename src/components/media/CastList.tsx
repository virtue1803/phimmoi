import { getImageUrl } from "@/lib/tmdb";
import { CastMember } from "@/types/tmdb";
import { User } from "lucide-react";
import Image from "next/image";

interface CastListProps {
  cast: CastMember[];
}

export default function CastList({ cast }: CastListProps) {
  if (cast.length === 0) {
    return <p className="text-sm text-muted">Chưa có thông tin diễn viên.</p>;
  }

  const displayedCast = cast.slice(0, 5);

  return (
    <div className="flex gap-4 overflow-x-auto pb-2 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
      {displayedCast.map((member) => {
        const photoUrl = getImageUrl(member.profile_path, "w200");
        return (
          <div key={member.id} className="w-24 flex-shrink-0">
            <div className="relative mb-2 aspect-square w-24 overflow-hidden rounded-lg bg-surfaceLight">
              {photoUrl ? (
                <Image src={photoUrl} alt={member.name} fill className="object-cover" />
              ) : (
                <div className="flex h-full w-full items-center justify-center text-muted">
                  <User className="h-8 w-8" />
                </div>
              )}
            </div>
            <p className="line-clamp-2 text-sm font-medium text-white">{member.name}</p>
          </div>
        );
      })}
    </div>
  );
}
