"use client";

import { useTrailerModal } from "@/context/TrailerModalContext";
import { VideoItem } from "@/types/tmdb";
import { PlayCircle } from "lucide-react";
import Image from "next/image";

interface VideoListProps {
  videos: VideoItem[];
  title: string;
}

export default function VideoList({ videos, title }: VideoListProps) {
  const { openTrailer } = useTrailerModal();
  const youtubeVideos = videos.filter((v) => v.site === "YouTube").slice(0, 8);

  if (youtubeVideos.length === 0) {
    return <p className="text-sm text-muted">Chưa có video/trailer nào.</p>;
  }

  return (
    <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4">
      {youtubeVideos.map((video) => (
        <button
          key={video.id}
          onClick={() => openTrailer(video.key, title)}
          className="group relative overflow-hidden rounded-lg bg-surfaceLight text-left"
        >
          <div className="relative aspect-video w-full">
            <Image
              src={`https://img.youtube.com/vi/${video.key}/hqdefault.jpg`}
              alt={video.name}
              fill
              className="object-cover transition group-hover:brightness-75"
            />
            <div className="absolute inset-0 flex items-center justify-center">
              <PlayCircle className="h-10 w-10 text-white drop-shadow-lg transition group-hover:scale-110" />
            </div>
          </div>
          <p className="line-clamp-2 p-2 text-xs text-white">{video.name}</p>
        </button>
      ))}
    </div>
  );
}
