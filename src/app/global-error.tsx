"use client";

import { useEffect } from "react";

/** Bắt lỗi xảy ra ngay trong root layout (error.tsx không xử lý được các lỗi này) */
export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <html lang="vi">
      <body className="flex min-h-screen flex-col items-center justify-center gap-4 bg-black px-4 text-center text-white">
        <h1 className="text-2xl font-bold">Đã có lỗi nghiêm trọng xảy ra</h1>
        <p className="max-w-md text-sm text-gray-400">
          {error.message || "Vui lòng tải lại trang để tiếp tục."}
        </p>
        <button
          onClick={reset}
          className="rounded-full bg-green-500 px-6 py-2.5 text-sm font-semibold text-white transition hover:bg-green-600"
        >
          Thử lại
        </button>
      </body>
    </html>
  );
}
