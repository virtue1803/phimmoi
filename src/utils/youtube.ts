/** Tạo URL nhúng YouTube, chỉ nhận key hợp lệ để không cho URL lạ vào iframe */
export function getYoutubeEmbedUrl(videoKey: string, autoplay = false): string | null {
  if (!/^[A-Za-z0-9_-]{5,20}$/.test(videoKey)) return null;
  return `https://www.youtube-nocookie.com/embed/${videoKey}${autoplay ? "?autoplay=1" : ""}`;
}
