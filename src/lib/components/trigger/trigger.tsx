import { useEffect, useRef, useState } from "react";

import { useDragContext } from "../context";
import styles from "./trigger.module.css";

export function Trigger({
  isOpen,
  setIsOpen,
}: {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
}) {
  const { isDragging, isSnapping, position, dragRef, handlers } =
    useDragContext();
  const buttonRef = useRef<HTMLButtonElement>(null);
  const [dragOccurred, setDragOccurred] = useState(false);

  // Set the ref after the component mounts
  useEffect(() => {
    if (buttonRef.current) {
      dragRef.current = buttonRef.current;
    }
  }, [dragRef]);

  // Track when dragging occurs to prevent click
  useEffect(() => {
    if (isDragging) {
      setDragOccurred(true);
    }
  }, [isDragging]);

  // Handle click - only toggle if no drag occurred
  const handleClick = () => {
    if (!dragOccurred && !isSnapping) {
      setIsOpen(!isOpen);
    }
    // Reset drag flag after handling click
    setDragOccurred(false);
  };

  // Reset drag flag when mouse/touch is released without dragging
  const handleMouseUp = () => {
    if (!isDragging && !isSnapping) {
      setDragOccurred(false);
    }
  };

  return (
    <button
      ref={buttonRef}
      data-panel-toggle
      className={styles.Trigger}
      data-dragging={isDragging}
      data-snapping={isSnapping}
      style={{
        left: `${position.x}px`,
        top: `${position.y}px`,
      }}
      onClick={handleClick}
      onMouseUp={handleMouseUp}
      onTouchEnd={handleMouseUp}
      {...handlers}
    >
      {isOpen ? "Close" : "Open"} Panel
    </button>
  );
}
