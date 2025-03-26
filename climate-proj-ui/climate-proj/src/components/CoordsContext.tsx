import { createContext, useContext, useState, ReactNode } from "react";

type Coords = { lat: number; long: number } | null;

const CoordsContext = createContext<{
  coords: Coords;
  setCoords: (coords: Coords) => void;
} | null>(null);

export const CoordsProvider = ({ children }: { children: ReactNode }) => {
  const [coords, setCoords] = useState<Coords>(null);

  return (
    <CoordsContext.Provider value={{ coords, setCoords }}>
      {children}
    </CoordsContext.Provider>
  );
};

export const useCoords = () => {
  const context = useContext(CoordsContext);
  if (!context) {
    throw new Error("useCoords must be used within a CoordsProvider");
  }
  return context;
};
