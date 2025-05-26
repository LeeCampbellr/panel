import { createContext, useContext } from "react";

import { useDrag } from "../hooks/useDrag";

export const DragContext = createContext<ReturnType<typeof useDrag> | null>(
  null
);

export function useDragContext() {
  const context = useContext(DragContext);
  if (!context) {
    throw new Error("useDragContext must be used within a Panel component");
  }
  return context;
}
