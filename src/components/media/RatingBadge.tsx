import { formatVote } from "@/utils/format";

interface RatingBadgeProps {
  vote: number;
  size?: "sm" | "md";
}

function getColor(vote: number): string {
  if (vote >= 7) return "text-green-400 border-green-400";
  if (vote >= 5) return "text-yellow-400 border-yellow-400";
  return "text-red-400 border-red-400";
}

export default function RatingBadge({ vote, size = "sm" }: RatingBadgeProps) {
  const dimension = size === "sm" ? "h-9 w-9 text-xs" : "h-14 w-14 text-base";

  return (
    <div
      className={`flex ${dimension} shrink-0 items-center justify-center rounded-full border-2 bg-background/80 font-bold ${getColor(
        vote
      )}`}
    >
      {formatVote(vote)}
    </div>
  );
}
