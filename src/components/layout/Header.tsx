"use client";

import { Menu, X } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

const NAV_LINKS = [
  { href: "/", label: "Home" },
  { href: "/movies", label: "Movies" },
  { href: "/tv", label: "TV Series" },
];

export default function Header() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  // Đổi nền header khi người dùng cuộn xuống
  useEffect(() => {
    function handleScroll() {
      setScrolled(window.scrollY > 8);
    }
    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const isSolid = scrolled || open;

  return (
    <header
      // Tích hợp chuỗi class của bạn và kết hợp logic isSolid để header co giãn mượt mà
      className={`fixed top-0 w-full z-50 flex justify-center px-4 sm:px-8 transition-all duration-300 ease-in-out ${
        isSolid
          ? "bg-black/95 py-4 shadow-md backdrop-blur-sm" // Khi cuộn: Nền đen, viền nhỏ lại (py-4)
          : "bg-transparent py-4 md:py-8"                 // Khi ở top: Nền trong suốt, viền rộng ra (md:py-8)
      }`}
    >
      {/* Container giới hạn độ rộng max-w */}
      <div className="flex w-full max-w-8xl px-5 items-center gap-4">
        
        <Link href="/" className="flex items-center gap-2">
          {/* LOGO NÚT PLAY THEO YÊU CẦU */}
          <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-green-500">
            <div className="flex h-5 w-5 items-center justify-center rounded-full bg-white text-green-500">
              {/* SVG Hình tam giác (Play) - ml-[2px] để tam giác trông cân đối ở giữa tâm tròn */}
              <svg className="ml-[2px] h-3 w-3" fill="currentColor" viewBox="0 0 24 24">
                <path d="M8 5v14l11-7z" />
              </svg>
            </div>
          </div>

          <span className="text-2xl font-bold tracking-tight text-white transition hover:text-red-500">
            the<span className="font-extrabold">Movies</span>
          </span>
        </Link>

        {/* Menu Desktop */}
        <nav className="ml-auto hidden items-center gap-8 md:flex">
          {NAV_LINKS.map((link) => {
            const isActive =
              link.href === "/" ? pathname === "/" : pathname?.startsWith(link.href);
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`text-xl font-medium text-white transition hover:text-red-500 ${
                  isActive ? "border-b-2 border-white pb-1" : ""
                }`}
              >
                {link.label}
              </Link>
            );
          })}
        </nav>

        {/* Nút bật tắt Menu Mobile */}
        <button
          className="ml-auto text-white md:hidden"
          onClick={() => setOpen((prev) => !prev)}
          aria-label="Mở menu"
        >
          {open ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>

      {/* Menu thả xuống trên Mobile */}
      {open && (
        <div className="absolute top-full left-0 w-full border-t border-white/10 bg-black/95 px-4 py-4 md:hidden">
          <nav className="flex flex-col gap-3">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setOpen(false)}
                className="text-sm font-medium text-white hover:text-green-500"
              >
                {link.label}
              </Link>
            ))}
          </nav>
        </div>
      )}
    </header>
  );
}