# Phimmoi 🎬

Website tra cứu phim & TV Series xây dựng với **Next.js App Router + TypeScript + TailwindCSS**, dữ liệu lấy từ **TMDB API**, quản lý data fetching / cache / loading / error / infinite scroll bằng **TanStack Query**.

## Tính năng

- **Trang chủ**: Banner slider phim nổi bật (tự động chuyển + xem trailer ngay trên banner), các hàng danh sách Trending Movies / Top Rated Movies / Trending TV / Top Rated TV.
- **Trang Movies / TV Series**: danh sách phim, tìm kiếm theo tên, **infinite scroll** (tự động tải thêm khi cuộn tới cuối trang).
- **Trang chi tiết Movie / TV**: poster, backdrop, mô tả, ngày phát hành, điểm đánh giá, thể loại, thời lượng, danh sách diễn viên, danh sách trailer/video (mở modal xem ngay), danh sách phim đề xuất / liên quan.
- Xử lý đầy đủ **loading / empty / error state** ở mọi nơi có gọi API.
- Giao diện **responsive** cho mobile / tablet / desktop.

## Công nghệ sử dụng

- [Next.js 14](https://nextjs.org/) (App Router)
- TypeScript
- TailwindCSS
- [TanStack Query](https://tanstack.com/query) (`useQuery`, `useInfiniteQuery`)
- [TMDB API](https://www.themoviedb.org/documentation/api)
- lucide-react (icon)

## Cấu trúc thư mục

```
src/
  app/                     # Route (App Router)
    page.tsx               # Trang chủ
    movies/page.tsx         # Danh sách Movies
    movies/[id]/page.tsx    # Chi tiết Movie
    tv/page.tsx              # Danh sách TV Series
    tv/[id]/page.tsx          # Chi tiết TV Series
    layout.tsx, providers.tsx, globals.css
  components/
    layout/                # Header, Footer, SearchBar
    home/                   # BannerSlider, MediaRow
    media/                  # MediaCard, MediaGrid, MediaListPage,
                            # MediaDetailView, CastList, VideoList, TrailerModal...
    common/                 # LoadingSpinner, ErrorState, EmptyState
  context/                  # TrailerModalContext (quản lý modal trailer toàn cục)
  hooks/                    # useHomeData, useInfiniteMedia, useMediaDetail, useVideos...
  app/api/tmdb/[...path]/route.ts  # Proxy TMDB phía server (giữ API key bí mật)
  lib/tmdb.ts               # Client gọi TMDB API qua proxy
  types/tmdb.ts             # Type định nghĩa dữ liệu TMDB
  utils/format.ts           # Helper format ngày, thời lượng, điểm số...
```

## Cài đặt & chạy dự án

### 1. Cài dependencies

```bash
npm install
```

### 2. Lấy TMDB API Key

1. Tạo tài khoản tại https://www.themoviedb.org/
2. Vào **Settings → API** để lấy **API Key (v3 auth)**
3. Copy file môi trường mẫu:

```bash
cp .env.local.example .env.local
```

4. Mở `.env.local` và dán API key vào:

```
TMDB_API_KEY=<api key của bạn>
```

> API key chỉ được dùng ở phía server trong route `/api/tmdb`. Không đặt tiền tố `NEXT_PUBLIC_`
> vì biến đó sẽ bị nhúng vào bundle và lộ ra trình duyệt.

### 3. Chạy dự án

```bash
npm run dev
```

Mở http://localhost:3000 để xem kết quả.

## Ghi chú kỹ thuật

- **Infinite loading** dùng `useInfiniteQuery` của TanStack Query kết hợp `IntersectionObserver` (hook `useIntersectionObserver`) để tự động load trang tiếp theo khi phần tử "sentinel" ở cuối danh sách lọt vào viewport.
- **Tìm kiếm**: từ khóa được lưu trên URL (`?q=...`) làm nguồn dữ liệu (source of truth) cho cả ô search trên Header lẫn ô search trong trang danh sách, đảm bảo đồng bộ và có thể chia sẻ link tìm kiếm.
- **Modal trailer** dùng chung một `TrailerModalContext` ở root layout, có thể mở từ Banner, từ danh sách video trong trang chi tiết.
- Toàn bộ ảnh dùng `next/image` với domain `image.tmdb.org` được khai báo trong `next.config.js`.
- **Bảo mật**: mọi request TMDB đi qua route handler `/api/tmdb/[...path]` với danh sách endpoint và
  query param được allowlist; app còn gắn CSP và các security header trong `next.config.js`.
