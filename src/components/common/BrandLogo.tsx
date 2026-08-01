import Link from "next/link";

interface BrandLogoProps {
  /** Phóng to icon khi hover (dùng ở Footer) */
  animated?: boolean;
}

export default function BrandLogo({ animated = false }: BrandLogoProps) {
  return (
    <Link href="/" className="group flex items-center gap-2">
      <div
        className={`flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-green-500 ${
          animated ? "transition-transform group-hover:scale-110" : ""
        }`}
      >
        <div className="flex h-5 w-5 items-center justify-center rounded-full bg-white text-green-500">
          <svg className="ml-[2px] h-3 w-3" fill="currentColor" viewBox="0 0 24 24">
            <path d="M8 5v14l11-7z" />
          </svg>
        </div>
      </div>

      <span className="text-3xl font-bold tracking-tight text-white transition hover:text-red-500">
        the<span className="font-extrabold">Movies</span>
      </span>
    </Link>
  );
}
