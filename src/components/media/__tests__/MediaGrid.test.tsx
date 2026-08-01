import { render, screen } from "@testing-library/react";
import MediaGrid from "@/components/media/MediaGrid";
import CastList from "@/components/media/CastList";
import { CastMember, MediaBase } from "@/types/tmdb";

function item(overrides: Partial<MediaBase> & { id: number }): MediaBase {
  return {
    overview: "",
    poster_path: null,
    backdrop_path: null,
    vote_average: 0,
    vote_count: 0,
    ...overrides,
  };
}

function member(overrides: Partial<CastMember> & { id: number }): CastMember {
  return {
    name: `Actor ${overrides.id}`,
    character: "Someone",
    profile_path: null,
    order: overrides.id,
    ...overrides,
  };
}

describe("MediaGrid", () => {
  it("renders an empty state when there are no items", () => {
    render(<MediaGrid items={[]} mediaType="movie" />);
    expect(screen.getByText("Không tìm thấy kết quả")).toBeInTheDocument();
  });

  it("renders a card per item, linking to the media route", () => {
    render(
      <MediaGrid
        items={[
          item({ id: 1, title: "Dune", release_date: "2021-10-22", poster_path: "/p.jpg" }),
          item({ id: 2, name: "Loki", first_air_date: "2021-06-09" }),
        ]}
        mediaType="movie"
      />
    );

    expect(screen.getByRole("link", { name: /Dune/ })).toHaveAttribute("href", "/movies/1");
    expect(screen.getAllByText("2021")).toHaveLength(2);
    expect(screen.getByText("Loki")).toBeInTheDocument();
    expect(screen.getByText("Không có ảnh")).toBeInTheDocument();
  });
});

describe("CastList", () => {
  it("renders a placeholder when the cast is empty", () => {
    render(<CastList cast={[]} />);
    expect(screen.getByText("Chưa có thông tin diễn viên.")).toBeInTheDocument();
  });

  it("shows at most five cast members", () => {
    const cast = Array.from({ length: 7 }, (_, i) => member({ id: i + 1 }));
    render(<CastList cast={cast} />);
    expect(screen.getByText("Actor 1")).toBeInTheDocument();
    expect(screen.getByText("Actor 5")).toBeInTheDocument();
    expect(screen.queryByText("Actor 6")).not.toBeInTheDocument();
  });
});
