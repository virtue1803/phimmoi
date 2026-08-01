"use client";

import BrandLogo from "@/components/common/BrandLogo";
import { getImageUrl, getTopRated } from "@/lib/tmdb";
import { useEffect, useState } from "react";

const FOOTER_COLUMNS = [
  {
    links: ["Home", "Contact us", "Term of services", "About us"],
  },
  {
    links: ["Live", "FAQ", "Premium"],
  },
  {
    links: ["You must watch", "Recent release", "Top IMDB", "Privacy policy"],
  },
];

export default function Footer() {
  const [backgroundPosters, setBackgroundPosters] = useState<string[]>([]);

  useEffect(() => {
    async function fetchFooterPosters() {
      try {
        const data = await getTopRated("tv", 1);

        if (data && data.results) {
          const validPosters = data.results
            .map((item) => getImageUrl(item.poster_path, "w200"))
            .filter((url) => url !== null) as string[];

          const filledPosters = Array(3)
            .fill(validPosters)
            .flat()
            .slice(0, 48);

          setBackgroundPosters(filledPosters);
        }
      } catch (error) {
        console.error("Lỗi khi tải ảnh nền Footer:", error);
      }
    }

    fetchFooterPosters();
  }, []);

  return (
    <footer className="relative mt-16 overflow-hidden bg-black py-16">
      <div className="absolute inset-0 z-0 grid grid-cols-4 gap-0 opacity-30 sm:grid-cols-8 md:grid-cols-12 lg:grid-cols-16">
        {backgroundPosters.length > 0 ? (
          backgroundPosters.map((src, idx) => (
            <div key={idx} className="relative aspect-[2/3] w-full bg-surfaceLight">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={src}
                alt="poster-background"
                className="h-full w-full object-cover"
                loading="lazy"
              />
            </div>
          ))
        ) : (
          <div className="col-span-full h-full w-full bg-surface" />
        )}
      </div>

      <div className="absolute inset-0 z-10 bg-black/50" />

      <div className="relative z-20 mx-auto flex max-w-5xl flex-col items-center gap-12 px-4 sm:px-6">
        <BrandLogo animated />

        <div className="flex w-full flex-wrap justify-center gap-12 sm:gap-24 md:gap-32">
          {FOOTER_COLUMNS.map((column, idx) => (
            <ul key={idx} className="flex flex-col gap-5 text-left">
              {column.links.map((link) => (
                <li key={link}>
                  <span className="cursor-pointer text-base font-bold text-white transition hover:text-green-500 drop-shadow-md">
                    {link}
                  </span>
                </li>
              ))}
            </ul>
          ))}
        </div>
      </div>
    </footer>
  );
}
