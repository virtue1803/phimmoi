"use client";

import BrandLogo from "@/components/common/BrandLogo";
import { Home, Clapperboard, Tv } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

const NAV_LINKS = [
  { href: "/", label: "Home", icon: Home },
  { href: "/movies", label: "Movies", icon: Clapperboard },
  { href: "/tv", label: "TV Series", icon: Tv },
];

export default function Header() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);


  useEffect(() => {
    function handleScroll() {
      setScrolled(window.scrollY > 8);
    }
    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const isSolid = scrolled;

  function isActiveLink(href: string) {
    return href === "/" ? pathname === "/" : pathname?.startsWith(href);
  }

  return (
    <>

      <header
        className={`fixed top-0 hidden w-full z-50 justify-center px-4 sm:px-8 transition-all duration-300 ease-in-out md:flex ${
          isSolid
            ? "bg-black/95 py-4 shadow-md backdrop-blur-sm"
            : "bg-transparent py-4 md:py-8"
        }`}
      >
        <div className="flex w-full max-w-8xl px-5 items-center gap-4">
          <BrandLogo />

          <nav className="ml-auto flex items-center gap-8">
            {NAV_LINKS.map((link) => {
              const isActive = isActiveLink(link.href);
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
        </div>
      </header>

      <nav className="fixed bottom-0 left-0 z-50 flex w-full items-center justify-around border-t border-white/10 bg-black/95 py-2 backdrop-blur-sm md:hidden">
        {NAV_LINKS.map((link) => {
          const isActive = isActiveLink(link.href);
          const Icon = link.icon;
          return (
            <Link
              key={link.href}
              href={link.href}
              className={`flex flex-col items-center gap-1 px-3 py-1 text-xs font-medium transition ${
                isActive ? "text-red-500" : "text-white hover:text-red-500"
              }`}
            >
              <Icon className="h-5 w-5" />
              {link.label}
            </Link>
          );
        })}
      </nav>
    </>
  );
}