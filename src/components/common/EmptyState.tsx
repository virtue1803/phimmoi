import { SearchX } from "lucide-react";

interface EmptyStateProps {
  title?: string;
  description?: string;
}

export default function EmptyState({
  title = "Không tìm thấy kết quả",
  description = "Hãy thử tìm kiếm với từ khóa khác.",
}: EmptyStateProps) {
  return (
    <div className="flex min-h-[40vh] flex-col items-center justify-center gap-3 rounded-xl bg-surface px-6 py-10 text-center">
      <SearchX className="h-10 w-10 text-muted" />
      <p className="text-base font-semibold text-white">{title}</p>
      <p className="max-w-md text-sm text-muted">{description}</p>
    </div>
  );
}
