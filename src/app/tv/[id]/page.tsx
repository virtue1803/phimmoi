import MediaDetailView from "@/components/media/MediaDetailView";

interface TVPageProps {
  params: { id: string };
}

export default function TVDetailPage({ params }: TVPageProps) {
  return <MediaDetailView mediaType="tv" id={params.id} />;
}
