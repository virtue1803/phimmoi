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

  // Header trong suốt khi ở đầu trang, chuyển sang màu đen khi cuộn xuống
  useEffect(() => {
    function handleScroll() {
      setScrolled(window.scrollY > 20);
    }
    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-colors duration-300 ${
        scrolled || open ? "bg-black/95 backdrop-blur-sm shadow-lg shadow-black/30" : "bg-transparent"
      }`}
    >
      <div className="mx-auto flex max-w-7xl items-center gap-4 px-4 py-4 sm:px-6 lg:px-8">
        <Link href="/" className="flex items-center gap-2">
          <span className="h-3 w-3 rounded-full bg-accent" />
          <span className="text-lg font-bold tracking-tight text-white">
            the<span className="font-extrabold">Movies</span>
          </span>
        </Link>

        <nav className="ml-auto hidden items-center gap-8 md:flex">
          {NAV_LINKS.map((link) => {
            const isActive =
              link.href === "/" ? pathname === "/" : pathname?.startsWith(link.href);
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`text-sm font-medium text-white/90 transition hover:text-white ${
                  isActive ? "border-b-2 border-white pb-1 text-white" : ""
                }`}
              >
                {link.label}
              </Link>
            );
          })}
        </nav>

        <button
          className="ml-auto text-white md:hidden"
          onClick={() => setOpen((prev) => !prev)}
          aria-label="Mở menu"
        >
          {open ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>

      {open && (
        <div className="border-t border-white/10 bg-black/95 px-4 py-4 md:hidden">
          <nav className="flex flex-col gap-3">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setOpen(false)}
                className="text-sm font-medium text-white/90 hover:text-white"
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
