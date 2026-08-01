import { STATE_PANEL } from "@/utils/styles";
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
    <div className={STATE_PANEL}>
      <SearchX className="h-10 w-10 text-muted" />
      <p className="text-base font-semibold text-white">{title}</p>
      <p className="max-w-md text-sm text-muted">{description}</p>
    </div>
  );
}
