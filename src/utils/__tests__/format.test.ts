import {
  formatFullDate,
  formatRuntime,
  formatVote,
  formatYear,
  getMediaPath,
  getReleaseDate,
  getTitle,
} from "@/utils/format";
import { MediaBase } from "@/types/tmdb";

function makeItem(overrides: Partial<MediaBase> = {}): MediaBase {
  return {
    id: 1,
    overview: "",
    poster_path: null,
    backdrop_path: null,
    vote_average: 0,
    vote_count: 0,
    ...overrides,
  };
}

describe("getMediaPath", () => {
  it("maps movie to movies and tv to tv", () => {
    expect(getMediaPath("movie")).toBe("movies");
    expect(getMediaPath("tv")).toBe("tv");
  });
});

describe("getTitle", () => {
  it("prefers title, falls back to name then placeholder", () => {
    expect(getTitle(makeItem({ title: "Dune", name: "Dune TV" }))).toBe("Dune");
    expect(getTitle(makeItem({ name: "Dune TV" }))).toBe("Dune TV");
    expect(getTitle(makeItem())).toBe("Không rõ tên");
  });
});

describe("getReleaseDate", () => {
  it("prefers release_date, falls back to first_air_date", () => {
    expect(getReleaseDate(makeItem({ release_date: "2021-10-22", first_air_date: "2020-01-01" }))).toBe(
      "2021-10-22"
    );
    expect(getReleaseDate(makeItem({ first_air_date: "2020-01-01" }))).toBe("2020-01-01");
    expect(getReleaseDate(makeItem())).toBeUndefined();
  });
});

describe("formatYear", () => {
  it("extracts the year from a valid date", () => {
    expect(formatYear("2021-10-22")).toBe("2021");
  });

  it("returns N/A for missing or invalid dates", () => {
    expect(formatYear()).toBe("N/A");
    expect(formatYear("")).toBe("N/A");
    expect(formatYear("không-phải-ngày")).toBe("N/A");
  });
});

describe("formatFullDate", () => {
  it("formats a valid date in vi-VN day/month/year order", () => {
    expect(formatFullDate("2021-10-22")).toBe("22/10/2021");
  });

  it("returns a placeholder for missing or invalid dates", () => {
    expect(formatFullDate()).toBe("Chưa cập nhật");
    expect(formatFullDate("")).toBe("Chưa cập nhật");
    expect(formatFullDate("abc")).toBe("Chưa cập nhật");
  });
});

describe("formatRuntime", () => {
  it("formats runtimes under an hour in minutes", () => {
    expect(formatRuntime(45)).toBe("45 phút");
  });

  it("formats runtimes of an hour or more as hours and minutes", () => {
    expect(formatRuntime(155)).toBe("2h 35p");
    expect(formatRuntime(120)).toBe("2h 0p");
  });

  it("returns a placeholder for missing or non-positive runtimes", () => {
    expect(formatRuntime()).toBe("Đang cập nhật");
    expect(formatRuntime(null)).toBe("Đang cập nhật");
    expect(formatRuntime(0)).toBe("Đang cập nhật");
    expect(formatRuntime(-10)).toBe("Đang cập nhật");
  });
});

describe("formatVote", () => {
  it("renders one decimal place", () => {
    expect(formatVote(7.456)).toBe("7.5");
    expect(formatVote(8)).toBe("8.0");
  });

  it("returns N/A when there is no vote", () => {
    expect(formatVote(0)).toBe("N/A");
  });
});
