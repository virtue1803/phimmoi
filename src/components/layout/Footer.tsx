const FOOTER_COLUMNS = [
  {
    heading: null,
    links: ["Home", "Contact us", "Term of services", "About us"],
  },
  {
    heading: null,
    links: ["Live", "FAQ", "Premium"],
  },
  {
    heading: null,
    links: ["You must watch", "Recent release", "Top IMDB", "Privacy policy"],
  },
];

export default function Footer() {
  return (
    <footer className="relative mt-16 overflow-hidden border-t border-white/5 bg-surface">
      <div className="relative z-10 mx-auto flex max-w-4xl flex-col items-center gap-8 px-4 py-14 text-center sm:px-6">
        <div className="flex items-center gap-2">
          <span className="h-3 w-3 rounded-full bg-accent" />
          <span className="text-lg font-bold text-white">
            the<span className="font-extrabold">Movies</span>
          </span>
        </div>

        <div className="grid w-full grid-cols-2 gap-8 sm:grid-cols-3">
          {FOOTER_COLUMNS.map((column, idx) => (
            <ul key={idx} className="flex flex-col gap-2">
              {column.links.map((link) => (
                <li key={link}>
                  <span className="cursor-default text-sm text-muted transition hover:text-white">
                    {link}
                  </span>
                </li>
              ))}
            </ul>
          ))}
        </div>

        <p className="text-xs text-muted/70">
          © {new Date().getFullYear()} theMovies. Dữ liệu phim được cung cấp bởi{" "}
          <a
            href="https://www.themoviedb.org/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-primary hover:underline"
          >
            TMDB
          </a>
          . Dự án chỉ mang tính chất học tập.
        </p>
      </div>
    </footer>
  );
}
