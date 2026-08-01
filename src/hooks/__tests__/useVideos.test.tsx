import { VideoItem } from "@/types/tmdb";
import { pickBestTrailer } from "@/hooks/useVideos";

function video(overrides: Partial<VideoItem> & { id: string }): VideoItem {
  return {
    key: `key-${overrides.id}`,
    name: `video-${overrides.id}`,
    site: "YouTube",
    type: "Trailer",
    official: false,
    ...overrides,
  };
}

describe("pickBestTrailer", () => {
  it("returns undefined for missing or empty lists", () => {
    expect(pickBestTrailer(undefined)).toBeUndefined();
    expect(pickBestTrailer([])).toBeUndefined();
  });

  it("prefers an official YouTube trailer", () => {
    const official = video({ id: "2", official: true });
    expect(pickBestTrailer([video({ id: "1" }), official])).toBe(official);
  });

  it("falls back to any YouTube trailer", () => {
    const trailer = video({ id: "2" });
    expect(pickBestTrailer([video({ id: "1", type: "Teaser" }), trailer])).toBe(trailer);
  });

  it("falls back to a teaser, then to the first YouTube video", () => {
    const teaser = video({ id: "2", type: "Teaser" });
    expect(pickBestTrailer([video({ id: "1", type: "Clip" }), teaser])).toBe(teaser);

    const clip = video({ id: "1", type: "Clip" });
    expect(pickBestTrailer([clip, video({ id: "3", type: "Featurette" })])).toBe(clip);
  });

  it("ignores videos hosted outside YouTube", () => {
    expect(pickBestTrailer([video({ id: "1", site: "Vimeo", official: true })])).toBeUndefined();
  });
});
