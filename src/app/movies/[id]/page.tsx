import MediaDetailView from "@/components/media/MediaDetailView";
import { notFound } from "next/navigation";

interface MoviePageProps {
  params: { id: string };
}

export default function MovieDetailPage({ params }: MoviePageProps) {
  if (!/^\d+$/.test(params.id)) notFound();

  return <MediaDetailView mediaType="movie" id={params.id} />;
}
