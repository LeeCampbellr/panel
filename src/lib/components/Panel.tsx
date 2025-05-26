import { useEffect, useState } from "react";

import { useDrag } from "../hooks/useDrag";
import { DragContext } from "./context";
import { Drawer } from "./drawer/drawer";
import { Trigger } from "./trigger/trigger";

export function Panel({ children }: { children?: React.ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);
  const dragState = useDrag();

  useEffect(() => {
    dragState.setPanelCloseCallback(() => {
      setIsOpen(false);
    });
  }, [dragState]);

  return (
    <DragContext.Provider value={dragState}>
      <Trigger isOpen={isOpen} setIsOpen={setIsOpen} />
      <Drawer
        animationDirection={dragState.getAnimationDirection()}
        isOpen={isOpen}
      >
        {children}
      </Drawer>
    </DragContext.Provider>
  );
}
