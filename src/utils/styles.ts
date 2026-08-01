/** Class dùng chung cho các khối UI lặp lại nhiều nơi */

/** Ẩn thanh cuộn ngang trên mọi trình duyệt */
export const HIDE_SCROLLBAR =
  "[-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden";

/** Vùng cuộn ngang có thể kéo bằng chuột */
export const DRAGGABLE_TRACK = `flex gap-4 overflow-x-auto pb-2 cursor-grab select-none active:cursor-grabbing ${HIDE_SCROLLBAR}`;

/** Khối thông báo trạng thái (rỗng / lỗi) */
export const STATE_PANEL =
  "flex min-h-[40vh] flex-col items-center justify-center gap-3 rounded-xl bg-surface px-6 py-10 text-center";

/** Nút chính (nền đỏ primary) */
export const PRIMARY_BUTTON =
  "rounded-full bg-primary px-6 py-2.5 text-sm font-semibold text-white transition hover:bg-primaryDark";

/** Nút viền trắng trên nền tối */
export const OUTLINE_BUTTON =
  "rounded-full border border-white/40 px-6 py-2.5 text-sm font-semibold text-white transition hover:bg-white hover:text-background";

/** Tiêu đề của một hàng phim / section */
export const SECTION_HEADING = "text-lg font-bold text-white sm:text-xl";
