"use client";

import { TmdbError } from "@/lib/tmdb";
import { QueryCache, QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { useState } from "react";

export default function Providers({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        // Log tập trung mọi lỗi query, kể cả query mà UI không hiển thị error state
        queryCache: new QueryCache({
          onError: (error, query) => {
            console.error(`[query error] ${JSON.stringify(query.queryKey)}`, error);
          },
        }),
        defaultOptions: {
          queries: {
            staleTime: 1000 * 60 * 5, // 5 phút
            refetchOnWindowFocus: false,
            // Không thử lại với lỗi client (sai key, không tìm thấy...) vì sẽ luôn thất bại
            retry: (failureCount, error) => {
              const status = error instanceof TmdbError ? error.status : undefined;
              if (status !== undefined && status >= 400 && status < 500) return false;
              return failureCount < 1;
            },
          },
        },
      })
  );

  return (
    <QueryClientProvider client={queryClient}>
      {children}
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  );
}
