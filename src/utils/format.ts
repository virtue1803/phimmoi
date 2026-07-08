import { MediaBase, MediaType } from "@/types/tmdb";

/** Chuyển media_type ("movie" | "tv") thành đường dẫn route tương ứng */
export function getMediaPath(mediaType: MediaType): string {
  return mediaType === "movie" ? "movies" : "tv";
}

export function getTitle(item: MediaBase): string {
  return item.title ?? item.name ?? "Không rõ tên";
}

export function getReleaseDate(item: MediaBase): string | undefined {
  return item.release_date ?? item.first_air_date;
}

export function formatYear(dateStr?: string): string {
  if (!dateStr) return "N/A";
  const year = new Date(dateStr).getFullYear();
  return Number.isNaN(year) ? "N/A" : String(year);
}

export function formatFullDate(dateStr?: string): string {
  if (!dateStr) return "Chưa cập nhật";
  const date = new Date(dateStr);
  if (Number.isNaN(date.getTime())) return "Chưa cập nhật";
  return date.toLocaleDateString("vi-VN", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
}

export function formatRuntime(minutes?: number | null): string {
  if (!minutes || minutes <= 0) return "Đang cập nhật";
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  if (h === 0) return `${m} phút`;
  return `${h}h ${m}p`;
}

export function formatVote(vote: number): string {
  return vote ? vote.toFixed(1) : "N/A";
}
