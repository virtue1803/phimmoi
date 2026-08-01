interface YouTubeEmbedProps {
  videoKey: string;
  title: string;
  autoplay?: boolean;
}

export default function YouTubeEmbed({ videoKey, title, autoplay = false }: YouTubeEmbedProps) {
  return (
    <iframe
      className="h-full w-full"
      src={`https://www.youtube.com/embed/${videoKey}${autoplay ? "?autoplay=1" : ""}`}
      title={title}
      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
      allowFullScreen
    />
  );
}
