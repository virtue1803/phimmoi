import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { TrailerModalProvider, useTrailerModal } from "@/context/TrailerModalContext";

function Consumer() {
  const { openTrailer, closeTrailer } = useTrailerModal();
  return (
    <div>
      <button onClick={() => openTrailer("abc123", "Dune")}>open</button>
      <button onClick={closeTrailer}>close</button>
    </div>
  );
}

describe("TrailerModalProvider", () => {
  it("renders no modal until a trailer is opened", () => {
    render(
      <TrailerModalProvider>
        <Consumer />
      </TrailerModalProvider>
    );
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
  });

  it("opens and closes the trailer modal", async () => {
    const user = userEvent.setup();
    render(
      <TrailerModalProvider>
        <Consumer />
      </TrailerModalProvider>
    );

    await user.click(screen.getByRole("button", { name: "open" }));
    const dialog = screen.getByRole("dialog");
    expect(dialog).toHaveAttribute("aria-label", "Trailer: Dune");
    expect(document.querySelector("iframe")).toHaveAttribute(
      "src",
      "https://www.youtube.com/embed/abc123?autoplay=1"
    );

    await user.click(screen.getByRole("button", { name: "close" }));
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
  });

  it("throws when used outside the provider", () => {
    const spy = jest.spyOn(console, "error").mockImplementation(() => {});
    expect(() => render(<Consumer />)).toThrow(/TrailerModalProvider/);
    spy.mockRestore();
  });
});
