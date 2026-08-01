import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import TrailerModal from "@/components/media/TrailerModal";

describe("TrailerModal", () => {
  it("closes on backdrop click but not on content click", async () => {
    const user = userEvent.setup();
    const onClose = jest.fn();
    render(<TrailerModal videoKey="k" title="Dune" onClose={onClose} />);

    await user.click(screen.getByTitle("Dune"));
    expect(onClose).not.toHaveBeenCalled();

    await user.click(screen.getByRole("dialog"));
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it("closes via the close button and the Escape key", async () => {
    const user = userEvent.setup();
    const onClose = jest.fn();
    render(<TrailerModal videoKey="k" title="Dune" onClose={onClose} />);

    await user.click(screen.getByRole("button", { name: "Đóng" }));
    await user.keyboard("{Escape}");
    expect(onClose).toHaveBeenCalledTimes(2);
  });

  it("locks background scroll while mounted and restores it on unmount", () => {
    const { unmount } = render(<TrailerModal videoKey="k" title="Dune" onClose={jest.fn()} />);
    expect(document.body.style.overflow).toBe("hidden");
    unmount();
    expect(document.body.style.overflow).toBe("");
  });
});
