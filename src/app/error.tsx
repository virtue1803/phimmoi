"use client";

import ErrorState from "@/components/common/ErrorState";
import { useEffect } from "react";

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
    <div className="mx-auto max-w-3xl px-4 py-24">
      <ErrorState
        message={error.message || "Đã có lỗi không mong muốn xảy ra."}
        onRetry={reset}
      />
    </div>
  );
}
