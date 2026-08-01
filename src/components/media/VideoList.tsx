import { getYoutubeEmbedUrl } from "@/utils/youtube";
import { VideoItem } from "@/types/tmdb";

interface VideoListProps {
  videos: VideoItem[];
}

export default function VideoList({ videos }: VideoListProps) {
  const youtubeVideos = videos
    .filter((v) => v.site === "YouTube")
    .map((v) => ({ video: v, embedUrl: getYoutubeEmbedUrl(v.key) }))
    .filter((item): item is { video: VideoItem; embedUrl: string } => item.embedUrl !== null);

  if (youtubeVideos.length === 0) {
    return <p className="text-sm text-muted">Chưa có video/trailer nào.</p>;
  }

  return (
    <div className="flex flex-col gap-8">
      {youtubeVideos.map(({ video, embedUrl }) => (
        <div key={video.id}>
          <h3 className="mb-3 text-base font-semibold text-white">{video.name}</h3>
          <div className="aspect-video w-full overflow-hidden rounded-lg bg-surfaceLight">
            <iframe
              className="h-full w-full"
              src={embedUrl}
              title={video.name}
              sandbox="allow-scripts allow-same-origin allow-presentation"
              referrerPolicy="strict-origin-when-cross-origin"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          </div>
        </div>
      ))}
    </div>
  );
}
