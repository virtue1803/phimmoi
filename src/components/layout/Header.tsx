"use client";

import { Menu, X } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

const NAV_LINKS = [
  { href: "/", label: "Home" },
  { href: "/movies", label: "Movies" },
  { href: "/tv", label: "TV Series" },
];

export default function Header() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 bg-[#f4f3ef]">
      <div className="mx-auto flex max-w-7xl items-center gap-4 px-4 py-4 sm:px-6 lg:px-8">
        <Link href="/" className="flex items-center gap-2">
          <span className="h-3 w-3 rounded-full bg-accent" />
          <span className="text-lg font-bold tracking-tight text-[#161616]">
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
                className={`text-sm font-medium text-[#161616] transition hover:text-primary ${
                  isActive ? "border-b-2 border-[#161616] pb-1" : ""
                }`}
              >
                {link.label}
              </Link>
            );
          })}
        </nav>

        <button
          className="ml-auto text-[#161616] md:hidden"
          onClick={() => setOpen((prev) => !prev)}
          aria-label="Mở menu"
        >
          {open ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>

      {open && (
        <div className="border-t border-black/10 bg-[#f4f3ef] px-4 py-4 md:hidden">
          <nav className="flex flex-col gap-3">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setOpen(false)}
                className="text-sm font-medium text-[#161616] hover:text-primary"
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
