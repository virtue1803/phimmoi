import { VideoItem } from "@/types/tmdb";

interface VideoListProps {
  videos: VideoItem[];
}

export default function VideoList({ videos }: VideoListProps) {
  const youtubeVideos = videos.filter((v) => v.site === "YouTube");

  if (youtubeVideos.length === 0) {
    return <p className="text-sm text-muted">Chưa có video/trailer nào.</p>;
  }

  return (
    <div className="flex flex-col gap-8">
      {youtubeVideos.map((video) => (
        <div key={video.id}>
          <h3 className="mb-3 text-base font-semibold text-white">{video.name}</h3>
          <div className="aspect-video w-full overflow-hidden rounded-lg bg-surfaceLight">
            <iframe
              className="h-full w-full"
              src={`https://www.youtube.com/embed/${video.key}`}
              title={video.name}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          </div>
        </div>
      ))}
    </div>
  );
}
