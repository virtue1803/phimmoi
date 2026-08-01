import { render } from "@testing-library/react";
import { useIntersectionObserver } from "@/hooks/useIntersectionObserver";

type ObserverCallback = (entries: Array<{ isIntersecting: boolean }>) => void;

const observe = jest.fn();
const disconnect = jest.fn();
let lastCallback: ObserverCallback | undefined;
let lastOptions: IntersectionObserverInit | undefined;

beforeEach(() => {
  observe.mockClear();
  disconnect.mockClear();
  lastCallback = undefined;
  lastOptions = undefined;

  global.IntersectionObserver = jest
    .fn()
    .mockImplementation((cb: ObserverCallback, options: IntersectionObserverInit) => {
      lastCallback = cb;
      lastOptions = options;
      return { observe, disconnect, unobserve: jest.fn(), takeRecords: jest.fn() };
    }) as unknown as typeof IntersectionObserver;
});

function Sentinel({
  onIntersect,
  enabled,
  rootMargin,
}: {
  onIntersect: () => void;
  enabled?: boolean;
  rootMargin?: string;
}) {
  const ref = useIntersectionObserver({ onIntersect, enabled, rootMargin });
  return <div data-testid="sentinel" ref={ref} />;
}

describe("useIntersectionObserver", () => {
  it("observes the target and uses the default root margin", () => {
    render(<Sentinel onIntersect={jest.fn()} />);
    expect(observe).toHaveBeenCalledTimes(1);
    expect(lastOptions).toEqual({ rootMargin: "300px" });
  });

  it("calls onIntersect only for intersecting entries", () => {
    const onIntersect = jest.fn();
    render(<Sentinel onIntersect={onIntersect} />);

    lastCallback?.([{ isIntersecting: false }]);
    expect(onIntersect).not.toHaveBeenCalled();

    lastCallback?.([{ isIntersecting: true }, { isIntersecting: true }]);
    expect(onIntersect).toHaveBeenCalledTimes(2);
  });

  it("does not observe when disabled", () => {
    render(<Sentinel onIntersect={jest.fn()} enabled={false} />);
    expect(global.IntersectionObserver).not.toHaveBeenCalled();
  });

  it("accepts a custom root margin", () => {
    render(<Sentinel onIntersect={jest.fn()} rootMargin="10px" />);
    expect(lastOptions).toEqual({ rootMargin: "10px" });
  });

  it("disconnects on unmount", () => {
    const { unmount } = render(<Sentinel onIntersect={jest.fn()} />);
    unmount();
    expect(disconnect).toHaveBeenCalledTimes(1);
  });
});
