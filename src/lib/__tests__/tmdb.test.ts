type TmdbModule = typeof import("@/lib/tmdb");

const ORIGINAL_KEY = process.env.NEXT_PUBLIC_TMDB_API_KEY;

function loadTmdb(apiKey?: string): TmdbModule {
  let mod: TmdbModule = {} as TmdbModule;
  jest.isolateModules(() => {
    if (apiKey === undefined) {
      delete process.env.NEXT_PUBLIC_TMDB_API_KEY;
    } else {
      process.env.NEXT_PUBLIC_TMDB_API_KEY = apiKey;
    }
    mod = require("@/lib/tmdb") as TmdbModule;
  });
  return mod;
}

function mockFetchOk(payload: unknown = { page: 1, results: [] }) {
  const fetchMock = jest.fn().mockResolvedValue({
    ok: true,
    status: 200,
    statusText: "OK",
    json: async () => payload,
  });
  global.fetch = fetchMock as unknown as typeof fetch;
  return fetchMock;
}

/** URL of the (single) fetch call made by the module under test */
function calledUrl(fetchMock: jest.Mock): URL {
  return new URL(fetchMock.mock.calls[0][0] as string);
}

afterEach(() => {
  jest.restoreAllMocks();
  if (ORIGINAL_KEY === undefined) {
    delete process.env.NEXT_PUBLIC_TMDB_API_KEY;
  } else {
    process.env.NEXT_PUBLIC_TMDB_API_KEY = ORIGINAL_KEY;
  }
});

describe("getImageUrl", () => {
  const { getImageUrl, IMAGE_BASE_URL } = loadTmdb("key");

  it("builds a URL with the default size", () => {
    expect(getImageUrl("/poster.jpg")).toBe(`${IMAGE_BASE_URL}/w500/poster.jpg`);
  });

  it("honours an explicit size", () => {
    expect(getImageUrl("/poster.jpg", "original")).toBe(`${IMAGE_BASE_URL}/original/poster.jpg`);
  });

  it("returns null when there is no path", () => {
    expect(getImageUrl(null)).toBeNull();
    expect(getImageUrl(undefined)).toBeNull();
    expect(getImageUrl("")).toBeNull();
  });
});

describe("tmdbFetch behaviour", () => {
  it("throws a descriptive error when the API key is missing", async () => {
    const tmdb = loadTmdb(undefined);
    mockFetchOk();
    await expect(tmdb.getTrending("movie")).rejects.toThrow(/NEXT_PUBLIC_TMDB_API_KEY/);
    expect(global.fetch).not.toHaveBeenCalled();
  });

  it("always sends the api key and vi-VN language", async () => {
    const tmdb = loadTmdb("secret-key");
    const fetchMock = mockFetchOk();
    await tmdb.getTrending("movie");
    const url = calledUrl(fetchMock);
    expect(url.searchParams.get("api_key")).toBe("secret-key");
    expect(url.searchParams.get("language")).toBe("vi-VN");
  });

  it("omits undefined and empty params", async () => {
    const tmdb = loadTmdb("secret-key");
    const fetchMock = mockFetchOk();
    await tmdb.discoverMedia("movie", 2, undefined);
    const url = calledUrl(fetchMock);
    expect(url.searchParams.has("with_genres")).toBe(false);
    expect(url.searchParams.get("page")).toBe("2");
  });

  it("throws with the HTTP status when the response is not ok", async () => {
    const tmdb = loadTmdb("secret-key");
    global.fetch = jest.fn().mockResolvedValue({
      ok: false,
      status: 401,
      statusText: "Unauthorized",
      json: async () => ({}),
    }) as unknown as typeof fetch;

    await expect(tmdb.getTrending("movie")).rejects.toMatchObject({
      name: "TmdbError",
      status: 401,
      message: expect.stringContaining("Unauthorized"),
    });
  });

  it("resolves with the parsed JSON body", async () => {
    const tmdb = loadTmdb("secret-key");
    const payload = { page: 1, results: [{ id: 1 }], total_pages: 1, total_results: 1 };
    mockFetchOk(payload);
    await expect(tmdb.getTrending("movie")).resolves.toEqual(payload);
  });
});

describe("endpoint builders", () => {
  const cases: Array<{
    name: string;
    call: (tmdb: TmdbModule) => Promise<unknown>;
    pathname: string;
    params?: Record<string, string>;
  }> = [
    {
      name: "getTrending",
      call: (t) => t.getTrending("tv", 3),
      pathname: "/3/trending/tv/week",
      params: { page: "3" },
    },
    {
      name: "getTopRated",
      call: (t) => t.getTopRated("movie"),
      pathname: "/3/movie/top_rated",
      params: { page: "1" },
    },
    {
      name: "getPopular",
      call: (t) => t.getPopular("tv", 5),
      pathname: "/3/tv/popular",
      params: { page: "5" },
    },
    {
      name: "discoverMedia with genre",
      call: (t) => t.discoverMedia("movie", 2, "28"),
      pathname: "/3/discover/movie",
      params: { page: "2", sort_by: "popularity.desc", with_genres: "28" },
    },
    {
      name: "searchMedia",
      call: (t) => t.searchMedia("movie", "dune", 4),
      pathname: "/3/search/movie",
      params: { query: "dune", page: "4" },
    },
    {
      name: "getMediaDetail",
      call: (t) => t.getMediaDetail("tv", 42),
      pathname: "/3/tv/42",
      params: { append_to_response: "credits,videos,similar,recommendations" },
    },
    {
      name: "getCredits",
      call: (t) => t.getCredits("movie", 42),
      pathname: "/3/movie/42/credits",
    },
    {
      name: "getVideos",
      call: (t) => t.getVideos("movie", "42"),
      pathname: "/3/movie/42/videos",
    },
  ];

  it.each(cases)("$name hits the right endpoint", async ({ call, pathname, params }) => {
    const tmdb = loadTmdb("secret-key");
    const fetchMock = mockFetchOk();
    await call(tmdb);
    const url = calledUrl(fetchMock);
    expect(url.origin + url.pathname).toBe(`https://api.themoviedb.org${pathname}`);
    Object.entries(params ?? {}).forEach(([key, value]) => {
      expect(url.searchParams.get(key)).toBe(value);
    });
  });
});
