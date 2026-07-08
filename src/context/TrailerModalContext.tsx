"use client";

import TrailerModal from "@/components/media/TrailerModal";
import { createContext, useCallback, useContext, useMemo, useState } from "react";

interface TrailerState {
  videoKey: string;
  title: string;
}

interface TrailerModalContextValue {
  openTrailer: (videoKey: string, title: string) => void;
  closeTrailer: () => void;
}

const TrailerModalContext = createContext<TrailerModalContextValue | null>(null);

export function TrailerModalProvider({ children }: { children: React.ReactNode }) {
  const [trailer, setTrailer] = useState<TrailerState | null>(null);

  const openTrailer = useCallback((videoKey: string, title: string) => {
    setTrailer({ videoKey, title });
  }, []);

  const closeTrailer = useCallback(() => setTrailer(null), []);

  const value = useMemo(() => ({ openTrailer, closeTrailer }), [openTrailer, closeTrailer]);

  return (
    <TrailerModalContext.Provider value={value}>
      {children}
      {trailer && (
        <TrailerModal
          videoKey={trailer.videoKey}
          title={trailer.title}
          onClose={closeTrailer}
        />
      )}
    </TrailerModalContext.Provider>
  );
}

export function useTrailerModal() {
  const ctx = useContext(TrailerModalContext);
  if (!ctx) {
    throw new Error("useTrailerModal phải được dùng bên trong TrailerModalProvider");
  }
  return ctx;
}
