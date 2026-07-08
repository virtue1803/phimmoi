import Footer from "@/components/layout/Footer";
import Header from "@/components/layout/Header";
import { TrailerModalProvider } from "@/context/TrailerModalContext";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import Providers from "./providers";
import "./globals.css";

const inter = Inter({ subsets: ["latin", "vietnamese"], variable: "--font-inter" });

export const metadata: Metadata = {
  title: "Phimmoi - Xem thông tin phim & TV Series",
  description:
    "Khám phá phim lẻ, phim bộ thịnh hành, đánh giá cao nhất và xem trailer mới nhất. Dữ liệu từ TMDB.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="vi">
      <body className={`${inter.variable} min-h-screen bg-background font-sans antialiased`}>
        <Providers>
          <TrailerModalProvider>
            <Header />
            <main className="min-h-[70vh]">{children}</main>
            <Footer />
          </TrailerModalProvider>
        </Providers>
      </body>
    </html>
  );
}
