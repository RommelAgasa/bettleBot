import React, { createContext, ReactNode, useContext, useState } from "react";

type ControlType = "joystick" | "steering-wheel";

interface ControlContextType {
  controlType: ControlType;
  setControlType: (type: ControlType) => void;
}

const ControlContext = createContext<ControlContextType | undefined>(undefined);

export function ControlProvider({ children }: { children: ReactNode }) {
  const [controlType, setControlType] = useState<ControlType>("joystick");

  return (
    <ControlContext.Provider value={{ controlType, setControlType }}>
      {children}
    </ControlContext.Provider>
  );
}

export function useControl() {
  const context = useContext(ControlContext);
  if (context === undefined) {
    throw new Error("useControl must be used within a ControlProvider");
  }
  return context;
}
