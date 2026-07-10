"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
// Import các hàm bạn vừa cung cấp từ file api của bạn (điều chỉnh lại đường dẫn cho đúng)
import { getTopRated, getImageUrl } from "@/lib/tmdb"; 

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
        
        <Link href="/" className="group flex items-center gap-2">
          <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-green-500 transition-transform group-hover:scale-110">
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

// "use client";

// import Link from "next/link";
// import { useEffect, useState } from "react";
// import { getTopRated, getImageUrl } from "@/lib/tmdb"; 

// const FOOTER_COLUMNS = [
//   {
//     heading: null,
//     links: ["Home", "Contact us", "Term of services", "About us"],
//   },
//   {
//     heading: null,
//     links: ["Live", "FAQ", "Premium"],
//   },
//   {
//     heading: null,
//     links: ["You must watch", "Recent release", "Top IMDB", "Privacy policy"],
//   },
// ];

// export default function Footer() {
//   const [marqueePosters, setMarqueePosters] = useState<string[]>([]);

//   useEffect(() => {
//     async function fetchFooterPosters() {
//       try {
//         const data = await getTopRated("tv", 1);
        
//         if (data && data.results) {
//           // Lấy và lọc các URL ảnh hợp lệ
//           const validPosters = data.results
//             .map((item) => getImageUrl(item.poster_path, "w200"))
//             .filter((url) => url !== null) as string[];

//           // Nhân đôi mảng ảnh để tạo hiệu ứng vòng lặp vô tận (seamless loop)
//           // 20 ảnh thật x 2 = 40 ảnh lặp lại, đủ dài để cuộn mượt mà
//           setMarqueePosters([...validPosters, ...validPosters]);
//         }
//       } catch (error) {
//         console.error("Lỗi khi tải ảnh nền Footer:", error);
//       }
//     }

//     fetchFooterPosters();
//   }, []);

//   return (
//     <footer className="relative mt-16 overflow-hidden border-t border-white/10 bg-black">
      
//       {/* --- ĐỊNH NGHĨA CSS ANIMATION --- */}
//       <style dangerouslySetInnerHTML={{
//         __html: `
//           @keyframes scroll-left {
//             0% { transform: translateX(0); }
//             100% { transform: translateX(-50%); } 
//           }
//           @keyframes scroll-right {
//             0% { transform: translateX(-50%); }
//             100% { transform: translateX(0); }
//           }
//           .animate-scroll-left {
//             animation: scroll-left 60s linear infinite;
//           }
//           .animate-scroll-right {
//             animation: scroll-right 60s linear infinite;
//           }
//         `
//       }} />

//       {/* --- PHẦN BACKGROUND POSTER ANIMATION TỪ API --- */}
//       <div className="absolute inset-0 z-0 flex flex-col gap-2 opacity-40 rotate-[-4deg] scale-110 top-[-20%]">
        
//         {marqueePosters.length > 0 ? (
//           <>
//             {/* Hàng 1: Cuộn qua trái */}
//             <div className="flex w-max animate-scroll-left gap-2">
//               {marqueePosters.map((src, idx) => (
//                 <div key={`r1-${idx}`} className="h-[200px] w-[135px] flex-shrink-0 overflow-hidden rounded-md opacity-70 bg-surfaceLight">
//                   {/* eslint-disable-next-line @next/next/no-img-element */}
//                   <img src={src} alt="poster" className="h-full w-full object-cover" loading="lazy" />
//                 </div>
//               ))}
//             </div>

//             {/* Hàng 2: Cuộn qua phải */}
//             <div className="flex w-max animate-scroll-right gap-2">
//               {marqueePosters.map((src, idx) => (
//                 <div key={`r2-${idx}`} className="h-[200px] w-[135px] flex-shrink-0 overflow-hidden rounded-md opacity-70 bg-surfaceLight">
//                   {/* eslint-disable-next-line @next/next/no-img-element */}
//                   <img src={src} alt="poster" className="h-full w-full object-cover" loading="lazy" />
//                 </div>
//               ))}
//             </div>

//             {/* Hàng 3: Cuộn qua trái */}
//             <div className="flex w-max animate-scroll-left gap-2">
//               {marqueePosters.map((src, idx) => (
//                 <div key={`r3-${idx}`} className="h-[200px] w-[135px] flex-shrink-0 overflow-hidden rounded-md opacity-70 bg-surfaceLight">
//                   {/* eslint-disable-next-line @next/next/no-img-element */}
//                   <img src={src} alt="poster" className="h-full w-full object-cover" loading="lazy" />
//                 </div>
//               ))}
//             </div>
//           </>
//         ) : (
//           <div className="h-full w-full bg-surface" />
//         )}
//       </div>

//       {/* Lớp phủ (Overlay) để làm tối background, giúp chữ Footer nổi bật lên */}
//       <div className="absolute inset-0 z-10 bg-gradient-to-t from-black via-black/90 to-black/10 backdrop-blur-[1px]" />

//       {/* --- NỘI DUNG FOOTER CHÍNH --- */}
//       <div className="relative z-20 mx-auto flex max-w-4xl flex-col items-center gap-8 px-4 py-14 text-center sm:px-6">
//         <div className="flex items-center gap-2">
//           <Link href="/" className="flex items-center gap-2 group">
            
//             {/* LOGO NÚT PLAY */}
//             <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-green-500 transition-transform group-hover:scale-110">
//               <div className="flex h-5 w-5 items-center justify-center rounded-full bg-white text-green-500">
//                 <svg className="ml-[2px] h-3 w-3" fill="currentColor" viewBox="0 0 24 24">
//                   <path d="M8 5v14l11-7z" />
//                 </svg>
//               </div>
//             </div>

//             <span className="text-2xl font-bold tracking-tight text-white transition hover:text-green-500">
//               the<span className="font-extrabold">Movies</span>
//             </span>
//           </Link>
//         </div>

//         <div className="grid w-full grid-cols-2 gap-8 sm:grid-cols-3">
//           {FOOTER_COLUMNS.map((column, idx) => (
//             <ul key={idx} className="flex flex-col gap-2">
//               {column.links.map((link) => (
//                 <li key={link}>
//                   <span className="cursor-pointer text-sm text-gray-400 transition hover:text-white">
//                     {link}
//                   </span>
//                 </li>
//               ))}
//             </ul>
//           ))}
//         </div>

//         <p className="text-xs text-gray-500 mt-4">
//           © {new Date().getFullYear()} theMovies. Dữ liệu phim được cung cấp bởi{" "}
//           <a
//             href="https://www.themoviedb.org/"
//             target="_blank"
//             rel="noopener noreferrer"
//             className="text-green-500 hover:underline"
//           >
//             TMDB
//           </a>
//         </p>
//       </div>
//     </footer>
//   );
// }


// 
// "use client";

// import Link from "next/link";
// import Image from "next/image"; // Đừng quên import Image nếu bạn dùng next/image cho poster thật

// const FOOTER_COLUMNS = [
//   {
//     heading: null,
//     links: ["Home", "Contact us", "Term of services", "About us"],
//   },
//   {
//     heading: null,
//     links: ["Live", "FAQ", "Premium"],
//   },
//   {
//     heading: null,
//     links: ["You must watch", "Recent release", "Top IMDB", "Privacy policy"],
//   },
// ];

// // Mảng ảnh giả lập (10 ảnh). Để cuộn mượt mà không bị gián đoạn, 
// // chúng ta sẽ nhân đôi mảng này ở vòng lặp bên dưới.
// const DUMMY_POSTERS = Array.from({ length: 10 }).map(
//   (_, i) => `https://picsum.photos/seed/${i + 15}/150/225`
// );
// // Nhân đôi mảng để tạo hiệu ứng vòng lặp vô tận (seamless loop)
// const MARQUEE_ITEMS = [...DUMMY_POSTERS, ...DUMMY_POSTERS];

// export default function Footer() {
//   return (
//     <footer className="relative mt-16 overflow-hidden border-t border-white/10 bg-black">
//       {/* --- ĐỊNH NGHĨA CSS ANIMATION --- */}
//       <style dangerouslySetInnerHTML={{
//         __html: `
//           @keyframes scroll-left {
//             0% { transform: translateX(0); }
//             100% { transform: translateX(-50%); } /* Cuộn đúng 1 nửa chiều dài (do mảng bị nhân đôi) */
//           }
//           @keyframes scroll-right {
//             0% { transform: translateX(-50%); }
//             100% { transform: translateX(0); }
//           }
//           .animate-scroll-left {
//             animation: scroll-left 60s linear infinite;
//           }
//           .animate-scroll-right {
//             animation: scroll-right 60s linear infinite;
//           }
//         `
//       }} />

//       {/* --- PHẦN BACKGROUND POSTER ANIMATION --- */}
//       <div className="absolute inset-0 z-0 flex flex-col gap-2 opacity-40 rotate-[-4deg] scale-110 top-[-20%]">
//         {/* Hàng 1: Cuộn qua trái */}
//         <div className="flex w-max animate-scroll-left gap-2">
//           {MARQUEE_ITEMS.map((src, idx) => (
//             <div key={`r1-${idx}`} className="h-[200px] w-[135px] flex-shrink-0 overflow-hidden rounded-md opacity-70">
//               <img src={src} alt="" className="h-full w-full object-cover" loading="lazy" />
//             </div>
//           ))}
//         </div>

//         {/* Hàng 2: Cuộn qua phải */}
//         <div className="flex w-max animate-scroll-right gap-2">
//           {MARQUEE_ITEMS.map((src, idx) => (
//             <div key={`r2-${idx}`} className="h-[200px] w-[135px] flex-shrink-0 overflow-hidden rounded-md opacity-70">
//               <img src={src} alt="" className="h-full w-full object-cover" loading="lazy" />
//             </div>
//           ))}
//         </div>

//         {/* Hàng 3: Cuộn qua trái */}
//         <div className="flex w-max animate-scroll-left gap-2">
//           {MARQUEE_ITEMS.map((src, idx) => (
//             <div key={`r3-${idx}`} className="h-[200px] w-[135px] flex-shrink-0 overflow-hidden rounded-md opacity-70">
//               <img src={src} alt="" className="h-full w-full object-cover" loading="lazy" />
//             </div>
//           ))}
//         </div>
//       </div>

//       {/* Lớp phủ (Overlay) để làm tối background, giúp chữ Footer nổi bật lên */}
//       <div className="absolute inset-0 z-10 bg-gradient-to-t from-black via-black/90 to-black/50 backdrop-blur-[2px]" />

//       {/* --- NỘI DUNG FOOTER CHÍNH --- */}
//       <div className="relative z-20 mx-auto flex max-w-4xl flex-col items-center gap-8 px-4 py-14 text-center sm:px-6">
//         <div className="flex items-center gap-2">
//           <Link href="/" className="flex items-center gap-2 group">
//             {/* LOGO NÚT PLAY THEO YÊU CẦU */}
//             <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-green-500 transition-transform group-hover:scale-110">
//               <div className="flex h-5 w-5 items-center justify-center rounded-full bg-white text-green-500">
//                 <svg className="ml-[2px] h-3 w-3" fill="currentColor" viewBox="0 0 24 24">
//                   <path d="M8 5v14l11-7z" />
//                 </svg>
//               </div>
//             </div>

//             <span className="text-2xl font-bold tracking-tight text-white transition hover:text-green-500">
//               the<span className="font-extrabold">Movies</span>
//             </span>
//           </Link>
//         </div>

//         <div className="grid w-full grid-cols-2 gap-8 sm:grid-cols-3">
//           {FOOTER_COLUMNS.map((column, idx) => (
//             <ul key={idx} className="flex flex-col gap-2">
//               {column.links.map((link) => (
//                 <li key={link}>
//                   <span className="cursor-pointer text-sm text-gray-400 transition hover:text-white">
//                     {link}
//                   </span>
//                 </li>
//               ))}
//             </ul>
//           ))}
//         </div>

//         <p className="text-xs text-gray-500">
//           © {new Date().getFullYear()} theMovies. Dữ liệu phim được cung cấp bởi{" "}
//           <a
//             href="https://www.themoviedb.org/"
//             target="_blank"
//             rel="noopener noreferrer"
//             className="text-green-500 hover:underline"
//           >
//             TMDB
//           </a>
//           . Dự án chỉ mang tính chất học tập.
//         </p>
//       </div>
//     </footer>
//   );
// }
