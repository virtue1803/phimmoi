import { STATE_PANEL } from "@/utils/styles";
import { AlertTriangle, RefreshCcw } from "lucide-react";

interface ErrorStateProps {
  message?: string;
  onRetry?: () => void;
}

export default function ErrorState({
  message = "Đã có lỗi xảy ra. Vui lòng thử lại.",
  onRetry,
}: ErrorStateProps) {
  return (
    <div className={STATE_PANEL}>
      <AlertTriangle className="h-10 w-10 text-primary" />
      <p className="max-w-md text-sm text-muted">{message}</p>
      {onRetry && (
        <button
          onClick={onRetry}
          className="mt-2 flex items-center gap-2 rounded-full bg-primary px-4 py-2 text-sm font-medium text-white transition hover:bg-primaryDark"
        >
          <RefreshCcw className="h-4 w-4" />
          Thử lại
        </button>
      )}
    </div>
  );
}
