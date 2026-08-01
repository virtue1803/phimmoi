import { renderHook, waitFor } from "@testing-library/react";
import { createQueryWrapper } from "@/test-utils/queryWrapper";
import { useTopRated, useTrending } from "@/hooks/useHomeData";
import { useMediaDetail } from "@/hooks/useMediaDetail";
import { useVideos } from "@/hooks/useVideos";
import { useInfiniteMedia } from "@/hooks/useInfiniteMedia";
import * as tmdb from "@/lib/tmdb";

jest.mock("@/lib/tmdb");

const mocked = tmdb as jest.Mocked<typeof tmdb>;

function listPage(page: number, totalPages = 3) {
  return {
    page,
    results: [{ id: page }],
    total_pages: totalPages,
    total_results: totalPages,
  } as never;
}

beforeEach(() => {
  jest.clearAllMocks();
});

describe("useTrending / useTopRated", () => {
  it("fetches trending data for the given media type", async () => {
    mocked.getTrending.mockResolvedValue(listPage(1));
    const { Wrapper } = createQueryWrapper();

    const { result } = renderHook(() => useTrending("tv"), { wrapper: Wrapper });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(mocked.getTrending).toHaveBeenCalledWith("tv");
    expect(result.current.data?.page).toBe(1);
  });

  it("surfaces errors from the top rated endpoint", async () => {
    mocked.getTopRated.mockRejectedValue(new Error("boom"));
    const { Wrapper } = createQueryWrapper();

    const { result } = renderHook(() => useTopRated("movie"), { wrapper: Wrapper });

    await waitFor(() => expect(result.current.isError).toBe(true));
    expect(mocked.getTopRated).toHaveBeenCalledWith("movie");
  });
});

describe("useMediaDetail", () => {
  it("fetches the detail for a given id", async () => {
    mocked.getMediaDetail.mockResolvedValue({ id: 7 } as never);
    const { Wrapper } = createQueryWrapper();

    const { result } = renderHook(() => useMediaDetail("movie", "7"), { wrapper: Wrapper });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(mocked.getMediaDetail).toHaveBeenCalledWith("movie", "7");
  });

  it("stays disabled without an id", () => {
    const { Wrapper } = createQueryWrapper();
    const { result } = renderHook(() => useMediaDetail("movie", ""), { wrapper: Wrapper });

    expect(result.current.fetchStatus).toBe("idle");
    expect(mocked.getMediaDetail).not.toHaveBeenCalled();
  });
});

describe("useVideos", () => {
  it("fetches videos when enabled", async () => {
    mocked.getVideos.mockResolvedValue({ results: [] } as never);
    const { Wrapper } = createQueryWrapper();

    const { result } = renderHook(() => useVideos("tv", 12), { wrapper: Wrapper });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(mocked.getVideos).toHaveBeenCalledWith("tv", 12);
  });

  it("does not fetch when explicitly disabled", () => {
    const { Wrapper } = createQueryWrapper();
    renderHook(() => useVideos("tv", 12, false), { wrapper: Wrapper });
    expect(mocked.getVideos).not.toHaveBeenCalled();
  });
});

describe("useInfiniteMedia", () => {
  it("uses the popular endpoint when there is no query or genre", async () => {
    mocked.getPopular.mockResolvedValue(listPage(1));
    const { Wrapper } = createQueryWrapper();

    const { result } = renderHook(() => useInfiniteMedia({ mediaType: "movie" }), {
      wrapper: Wrapper,
    });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(mocked.getPopular).toHaveBeenCalledWith("movie", 1);
  });

  it("uses the search endpoint with a trimmed query", async () => {
    mocked.searchMedia.mockResolvedValue(listPage(1));
    const { Wrapper } = createQueryWrapper();

    const { result } = renderHook(
      () => useInfiniteMedia({ mediaType: "movie", query: "  dune  ", genre: "28" }),
      { wrapper: Wrapper }
    );

    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(mocked.searchMedia).toHaveBeenCalledWith("movie", "dune", 1);
    expect(mocked.discoverMedia).not.toHaveBeenCalled();
  });

  it("uses discover when only a genre is set", async () => {
    mocked.discoverMedia.mockResolvedValue(listPage(1));
    const { Wrapper } = createQueryWrapper();

    const { result } = renderHook(
      () => useInfiniteMedia({ mediaType: "tv", query: "   ", genre: "35" }),
      { wrapper: Wrapper }
    );

    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(mocked.discoverMedia).toHaveBeenCalledWith("tv", 1, "35");
  });

  it("paginates until the last page", async () => {
    mocked.getPopular.mockImplementation(async (_type, page = 1) => listPage(page, 2));
    const { Wrapper } = createQueryWrapper();

    const { result } = renderHook(() => useInfiniteMedia({ mediaType: "movie" }), {
      wrapper: Wrapper,
    });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(result.current.hasNextPage).toBe(true);

    result.current.fetchNextPage();

    await waitFor(() => expect(result.current.data?.pages).toHaveLength(2));
    expect(mocked.getPopular).toHaveBeenLastCalledWith("movie", 2);
    await waitFor(() => expect(result.current.hasNextPage).toBe(false));
  });
});
