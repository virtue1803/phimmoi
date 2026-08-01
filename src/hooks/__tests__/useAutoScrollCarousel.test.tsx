import { fireEvent, render, screen } from "@testing-library/react";
import { act } from "react";
import { useAutoScrollCarousel } from "@/hooks/useAutoScrollCarousel";

function Carousel({ speed, enabled }: { speed?: number; enabled?: boolean }) {
  const { scrollRef, dragHandlers } = useAutoScrollCarousel({ speed, enabled });
  return (
    <div data-testid="track" ref={scrollRef} {...dragHandlers}>
      <button onClick={onItemClick}>item</button>
    </div>
  );
}

const onItemClick = jest.fn();

let frameCallbacks: FrameRequestCallback[] = [];

function flushFrames(count: number) {
  for (let i = 0; i < count; i += 1) {
    const cb = frameCallbacks.shift();
    if (!cb) return;
    act(() => {
      cb(performance.now());
    });
  }
}

/** jsdom has no PointerEvent, so build one from MouseEvent to keep clientX/pointerId. */
function firePointer(node: HTMLElement, type: string, clientX: number) {
  const event = new MouseEvent(type, { bubbles: true, cancelable: true, clientX });
  Object.defineProperty(event, "pointerId", { value: 1 });
  fireEvent(node, event);
}

/** Give the node a scrollable width, since jsdom reports 0 for layout metrics. */
function makeScrollable(node: HTMLElement, scrollWidth = 500, clientWidth = 100) {
  Object.defineProperty(node, "scrollWidth", { value: scrollWidth, configurable: true });
  Object.defineProperty(node, "clientWidth", { value: clientWidth, configurable: true });
  node.setPointerCapture = jest.fn();
  node.releasePointerCapture = jest.fn();
}

beforeEach(() => {
  onItemClick.mockClear();
  frameCallbacks = [];
  jest.spyOn(window, "requestAnimationFrame").mockImplementation((cb) => {
    frameCallbacks.push(cb);
    return frameCallbacks.length;
  });
  jest.spyOn(window, "cancelAnimationFrame").mockImplementation(() => {});
});

afterEach(() => {
  jest.restoreAllMocks();
});

describe("useAutoScrollCarousel", () => {
  it("advances scrollLeft by the given speed on each frame", () => {
    render(<Carousel speed={10} />);
    const track = screen.getByTestId("track");
    makeScrollable(track);

    flushFrames(2);
    expect(track.scrollLeft).toBe(20);
  });

  it("wraps back to the start when reaching the end", () => {
    render(<Carousel speed={10} />);
    const track = screen.getByTestId("track");
    makeScrollable(track);
    track.scrollLeft = 400;

    flushFrames(1);
    expect(track.scrollLeft).toBe(0);
  });

  it("does not schedule frames when disabled", () => {
    render(<Carousel enabled={false} />);
    expect(window.requestAnimationFrame).not.toHaveBeenCalled();
  });

  it("pauses auto scroll while dragging and follows the pointer", () => {
    render(<Carousel speed={10} />);
    const track = screen.getByTestId("track");
    makeScrollable(track);
    track.scrollLeft = 100;

    firePointer(track, "pointerdown", 200);
    flushFrames(1);
    expect(track.scrollLeft).toBe(100);

    firePointer(track, "pointermove", 160);
    expect(track.scrollLeft).toBe(140);

    firePointer(track, "pointerup", 160);
    flushFrames(1);
    expect(track.scrollLeft).toBe(150);
  });

  it("swallows the click that follows a drag, but keeps plain clicks", () => {
    render(<Carousel speed={10} />);
    const track = screen.getByTestId("track");
    makeScrollable(track);

    fireEvent.click(screen.getByRole("button", { name: "item" }));
    expect(onItemClick).toHaveBeenCalledTimes(1);

    firePointer(track, "pointerdown", 200);
    firePointer(track, "pointermove", 100);
    firePointer(track, "pointerup", 100);
    fireEvent.click(screen.getByRole("button", { name: "item" }));
    expect(onItemClick).toHaveBeenCalledTimes(1);
  });
});
