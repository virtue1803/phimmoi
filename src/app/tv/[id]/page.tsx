import MediaDetailView from "@/components/media/MediaDetailView";
import { notFound } from "next/navigation";

interface TVPageProps {
  params: { id: string };
}

export default function TVDetailPage({ params }: TVPageProps) {
  if (!/^\d+$/.test(params.id)) notFound();

  return <MediaDetailView mediaType="tv" id={params.id} />;
}
