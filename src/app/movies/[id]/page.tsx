import MediaDetailView from "@/components/media/MediaDetailView";

interface MoviePageProps {
  params: { id: string };
}

export default function MovieDetailPage({ params }: MoviePageProps) {
  return <MediaDetailView mediaType="movie" id={params.id} />;
}
