import { Film } from "lucide-react";
import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center gap-4 px-4 text-center">
      <Film className="h-16 w-16 text-primary" />
      <h1 className="text-3xl font-bold text-white">404 - Không tìm thấy trang</h1>
      <p className="max-w-md text-muted">
        Trang bạn tìm kiếm không tồn tại hoặc đã bị xoá. Hãy quay lại trang chủ để tiếp tục
        khám phá phim.
      </p>
      <Link
        href="/"
        className="mt-2 rounded-full bg-primary px-6 py-2.5 text-sm font-semibold text-white transition hover:bg-primaryDark"
      >
        Về trang chủ
      </Link>
    </div>
  );
}
