import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import EmptyState from "@/components/common/EmptyState";
import ErrorState from "@/components/common/ErrorState";
import LoadingSpinner from "@/components/common/LoadingSpinner";
import RatingBadge from "@/components/media/RatingBadge";
import VideoList from "@/components/media/VideoList";
import { VideoItem } from "@/types/tmdb";

describe("EmptyState", () => {
  it("renders default copy", () => {
    render(<EmptyState />);
    expect(screen.getByText("Không tìm thấy kết quả")).toBeInTheDocument();
    expect(screen.getByText("Hãy thử tìm kiếm với từ khóa khác.")).toBeInTheDocument();
  });

  it("renders custom copy", () => {
    render(<EmptyState title="Trống" description="Không có gì" />);
    expect(screen.getByText("Trống")).toBeInTheDocument();
    expect(screen.getByText("Không có gì")).toBeInTheDocument();
  });
});

describe("ErrorState", () => {
  it("shows the default message and no retry button", () => {
    render(<ErrorState />);
    expect(screen.getByText("Đã có lỗi xảy ra. Vui lòng thử lại.")).toBeInTheDocument();
    expect(screen.queryByRole("button")).not.toBeInTheDocument();
  });

  it("calls onRetry when the retry button is pressed", async () => {
    const user = userEvent.setup();
    const onRetry = jest.fn();
    render(<ErrorState message="Hỏng rồi" onRetry={onRetry} />);

    expect(screen.getByText("Hỏng rồi")).toBeInTheDocument();
    await user.click(screen.getByRole("button", { name: /Thử lại/ }));
    expect(onRetry).toHaveBeenCalledTimes(1);
  });
});

describe("LoadingSpinner", () => {
  it("renders the default label", () => {
    render(<LoadingSpinner />);
    expect(screen.getByText("Đang tải dữ liệu...")).toBeInTheDocument();
  });

  it("supports a custom label and full screen height", () => {
    const { container } = render(<LoadingSpinner label="Đang tải phim" fullScreen />);
    expect(screen.getByText("Đang tải phim")).toBeInTheDocument();
    expect(container.firstChild).toHaveClass("min-h-[60vh]");
  });
});

describe("RatingBadge", () => {
  it.each([
    [8.2, "text-green-400"],
    [6, "text-yellow-400"],
    [3.4, "text-red-400"],
  ])("colours %s according to the score", (vote, expectedClass) => {
    const { container } = render(<RatingBadge vote={vote} />);
    expect(container.firstChild).toHaveClass(expectedClass);
  });

  it("formats the score and supports the md size", () => {
    const { container } = render(<RatingBadge vote={7.45} size="md" />);
    expect(screen.getByText("7.5")).toBeInTheDocument();
    expect(container.firstChild).toHaveClass("h-14");
  });
});

describe("VideoList", () => {
  const youtube: VideoItem = {
    id: "1",
    key: "abc",
    name: "Official Trailer",
    site: "YouTube",
    type: "Trailer",
    official: true,
  };

  it("renders a placeholder when there is no YouTube video", () => {
    render(<VideoList videos={[{ ...youtube, site: "Vimeo" }]} />);
    expect(screen.getByText("Chưa có video/trailer nào.")).toBeInTheDocument();
  });

  it("embeds each YouTube video", () => {
    render(<VideoList videos={[youtube, { ...youtube, id: "2", site: "Vimeo" }]} />);
    const frames = screen.getAllByTitle("Official Trailer");
    expect(frames).toHaveLength(1);
    expect(frames[0]).toHaveAttribute("src", "https://www.youtube.com/embed/abc");
  });
});
