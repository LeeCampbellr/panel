import { useCallback, useEffect, useRef, useState } from "react";

import { throttle } from "../utils";

export type DropZone =
  | "top-left"
  | "top-center"
  | "top-right"
  | "center-left"
  | "center-right"
  | "bottom-left"
  | "bottom-center"
  | "bottom-right";

const triggerWidth = 40;
const DRAG_THRESHOLD = 5;
const GRAVITY_RADIUS = 150;
const MIN_SNAP_DURATION = 200;
const MAX_SNAP_DURATION = 800;
const SNAP_SPEED = 0.5;

export interface Position {
  x: number;
  y: number;
}

export interface DropZoneConfig {
  zone: DropZone;
  position: Position;
  animationDirection: "left" | "right" | "top" | "bottom";
}

const DROP_ZONE_CONFIGS: Record<DropZone, Omit<DropZoneConfig, "zone">> = {
  "top-left": { position: { x: 16, y: 16 }, animationDirection: "left" },
  "top-center": { position: { x: 0, y: 16 }, animationDirection: "bottom" },
  "top-right": { position: { x: -56, y: 16 }, animationDirection: "right" },
  "center-left": { position: { x: 16, y: 0 }, animationDirection: "left" },
  "center-right": { position: { x: -56, y: 0 }, animationDirection: "right" },
  "bottom-left": { position: { x: 16, y: -56 }, animationDirection: "left" },
  "bottom-center": { position: { x: 0, y: -56 }, animationDirection: "top" },
  "bottom-right": { position: { x: -56, y: -56 }, animationDirection: "right" },
};

export function useDrag() {
  const [isDragging, setIsDragging] = useState(false);
  const [isPotentialDrag, setIsPotentialDrag] = useState(false);
  const [isSnapping, setIsSnapping] = useState(false);
  const [currentZone, setCurrentZone] = useState<DropZone>("bottom-right");
  const [position, setPosition] = useState<Position>({ x: 0, y: 0 });
  const [dragOffset, setDragOffset] = useState<Position>({ x: 0, y: 0 });
  const [startPosition, setStartPosition] = useState<Position>({ x: 0, y: 0 });

  const dragRef = useRef<HTMLElement | null>(null);
  const onPanelCloseRef = useRef<(() => void) | null>(null);
  const snapAnimationRef = useRef<number | undefined>(undefined);

  // Calculate distance between two points
  const getDistance = useCallback((pos1: Position, pos2: Position): number => {
    const dx = pos2.x - pos1.x;
    const dy = pos2.y - pos1.y;
    return Math.sqrt(dx * dx + dy * dy);
  }, []);

  // Calculate which drop zone a position falls into
  const getDropZone = useCallback((x: number, y: number): DropZone => {
    const viewportWidth = window.innerWidth;
    const viewportHeight = window.innerHeight;

    const thirdWidth = viewportWidth / 3;
    const thirdHeight = viewportHeight / 3;

    let horizontal: "left" | "center" | "right";
    let vertical: "top" | "center" | "bottom";

    if (x < thirdWidth) horizontal = "left";
    else if (x < thirdWidth * 2) horizontal = "center";
    else horizontal = "right";

    if (y < thirdHeight) vertical = "top";
    else if (y < thirdHeight * 2) vertical = "center";
    else vertical = "bottom";

    // Handle the center-center case - we don't have this zone, so map to closest edge
    if (vertical === "center" && horizontal === "center") {
      // Determine which edge is closest
      const distanceToLeft = x;
      const distanceToRight = viewportWidth - x;
      const distanceToTop = y;
      const distanceToBottom = viewportHeight - y;

      const minDistance = Math.min(
        distanceToLeft,
        distanceToRight,
        distanceToTop,
        distanceToBottom
      );

      if (minDistance === distanceToLeft) return "center-left";
      if (minDistance === distanceToRight) return "center-right";
      if (minDistance === distanceToTop) return "top-center";
      return "bottom-center";
    }

    return `${vertical}-${horizontal}` as DropZone;
  }, []);

  // Get the final position for a drop zone
  const getZonePosition = useCallback((zone: DropZone): Position => {
    const config = DROP_ZONE_CONFIGS[zone];
    const viewportWidth = window.innerWidth;
    const viewportHeight = window.innerHeight;

    let x = config.position.x;
    let y = config.position.y;

    // Handle center positions
    if (zone.includes("center")) {
      if (zone.includes("top-center") || zone.includes("bottom-center")) {
        x = (viewportWidth - triggerWidth) / 2;
      }
      if (zone.includes("center-left") || zone.includes("center-right")) {
        y = (viewportHeight - triggerWidth) / 2;
      }
    }

    // Handle right positions (negative values mean from right edge)
    if (x < 0) {
      x = viewportWidth + x;
    }

    // Handle bottom positions (negative values mean from bottom edge)
    if (y < 0) {
      y = viewportHeight + y;
    }

    return { x, y };
  }, []);

  // Apply gravitational resistance around pin location (optimized)
  const applyGravitationalResistance = useCallback(
    (cursorPos: Position, currentPos: Position): Position => {
      const pinPosition = getZonePosition(currentZone);

      // Calculate distance using squared distance to avoid expensive sqrt
      const dx = currentPos.x - pinPosition.x;
      const dy = currentPos.y - pinPosition.y;
      const distanceSquared = dx * dx + dy * dy;
      const gravityRadiusSquared = GRAVITY_RADIUS * GRAVITY_RADIUS;

      // If we're outside the gravity radius, track cursor perfectly
      if (distanceSquared >= gravityRadiusSquared) {
        return cursorPos;
      }

      // Calculate resistance factor using squared distance (more efficient)
      const baseResistance = 0.02; // Very strong resistance at pin
      const normalizedDistanceSquared = distanceSquared / gravityRadiusSquared;
      const resistanceFactor =
        baseResistance + (1 - baseResistance) * normalizedDistanceSquared;

      // Calculate how much the trigger should move toward the cursor
      const moveX = (cursorPos.x - currentPos.x) * resistanceFactor;
      const moveY = (cursorPos.y - currentPos.y) * resistanceFactor;

      return {
        x: currentPos.x + moveX,
        y: currentPos.y + moveY,
      };
    },
    [currentZone, getZonePosition]
  );

  // Animate trigger to final position with optimized performance
  const animateToPosition = useCallback(
    (targetPosition: Position, fromPosition: Position) => {
      const distance = getDistance(fromPosition, targetPosition);
      const duration = Math.max(
        MIN_SNAP_DURATION,
        Math.min(MAX_SNAP_DURATION, distance / SNAP_SPEED)
      );

      // Cancel any existing animation
      if (snapAnimationRef.current) {
        cancelAnimationFrame(snapAnimationRef.current);
      }

      const startTime = performance.now();
      const deltaX = targetPosition.x - fromPosition.x;
      const deltaY = targetPosition.y - fromPosition.y;

      setIsSnapping(true);

      const animate = (currentTime: number) => {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);

        // Use optimized easeOutCubic calculation
        const easeProgress = progress === 1 ? 1 : 1 - Math.pow(1 - progress, 3);

        const currentPos = {
          x: fromPosition.x + deltaX * easeProgress,
          y: fromPosition.y + deltaY * easeProgress,
        };

        setPosition(currentPos);

        if (progress < 1) {
          snapAnimationRef.current = requestAnimationFrame(animate);
        } else {
          setPosition(targetPosition);
          setIsSnapping(false);
          snapAnimationRef.current = undefined;
        }
      };

      snapAnimationRef.current = requestAnimationFrame(animate);
    },
    [getDistance]
  );

  // Update position directly for smoother performance during dragging
  const updatePosition = useCallback((newPosition: Position) => {
    setPosition(newPosition);
  }, []);

  // Update zone immediately for instant highlighting
  const updateZone = useCallback(
    (centerX: number, centerY: number) => {
      const zone = getDropZone(centerX, centerY);
      // Validate that the zone exists in our configuration
      if (zone && DROP_ZONE_CONFIGS[zone] && zone !== currentZone) {
        setCurrentZone(zone);
      }
    },
    [getDropZone, currentZone]
  );

  // Set panel close callback
  const setPanelCloseCallback = useCallback((callback: () => void) => {
    onPanelCloseRef.current = callback;
  }, []);

  // Handle mouse/touch start
  const handleStart = useCallback(
    (clientX: number, clientY: number) => {
      if (!dragRef.current || isSnapping) return;

      // Cancel any ongoing snap animation
      if (snapAnimationRef.current) {
        cancelAnimationFrame(snapAnimationRef.current);
        snapAnimationRef.current = undefined;
        setIsSnapping(false);
      }

      const rect = dragRef.current.getBoundingClientRect();
      const offset = {
        x: clientX - rect.left,
        y: clientY - rect.top,
      };

      setDragOffset(offset);
      setStartPosition({ x: clientX, y: clientY });
      setIsPotentialDrag(true);
      // Don't set isDragging yet - wait for threshold
    },
    [isSnapping]
  );

  // Start actual dragging after threshold is met
  const startDragging = useCallback(() => {
    setIsDragging(true);
    setIsPotentialDrag(false);

    // Close panel when dragging actually starts
    if (onPanelCloseRef.current) {
      onPanelCloseRef.current();
    }
  }, []);

  // Optimized move handler with reduced throttling for smoother animation
  const handleMove = useCallback(
    throttle((clientX: number, clientY: number) => {
      if (!isPotentialDrag && !isDragging) return;

      // Check if we've moved enough to start dragging
      if (isPotentialDrag && !isDragging) {
        const currentPos = { x: clientX, y: clientY };
        const distance = getDistance(startPosition, currentPos);

        if (distance >= DRAG_THRESHOLD) {
          startDragging();
        } else {
          // Haven't moved enough yet, don't update position
          return;
        }
      }

      // Only update position if we're actually dragging
      if (isDragging) {
        const cursorPosition = {
          x: clientX - dragOffset.x,
          y: clientY - dragOffset.y,
        };

        // Apply gravitational resistance
        const resistedPosition = applyGravitationalResistance(
          cursorPosition,
          position
        );

        // Update position and zone in a single batch
        updatePosition(resistedPosition);

        // Update zone immediately for instant highlighting
        const centerX = resistedPosition.x + triggerWidth / 2;
        const centerY = resistedPosition.y + triggerWidth / 2;
        updateZone(centerX, centerY);
      }
    }, 8), // Reduced throttling to ~120fps for smoother animation
    [
      isPotentialDrag,
      isDragging,
      startPosition,
      dragOffset,
      position,
      updatePosition,
      updateZone,
      getDistance,
      startDragging,
      applyGravitationalResistance,
    ]
  );

  // Handle mouse/touch end
  const handleEnd = useCallback(() => {
    if (isDragging) {
      setIsDragging(false);

      // Determine which zone we're dropping into based on current position
      const centerX = position.x + triggerWidth / 2;
      const centerY = position.y + triggerWidth / 2;
      const dropZone = getDropZone(centerX, centerY);

      // Update to the drop zone and animate to its pin location
      setCurrentZone(dropZone);
      const targetPosition = getZonePosition(dropZone);
      animateToPosition(targetPosition, position);
    }

    // Reset potential drag state
    setIsPotentialDrag(false);
    // Note: Panel stays closed after dropping
  }, [isDragging, position, getDropZone, getZonePosition, animateToPosition]);

  // Mouse event handlers
  const handleMouseDown = useCallback(
    (e: React.MouseEvent) => {
      e.preventDefault();
      handleStart(e.clientX, e.clientY);
    },
    [handleStart]
  );

  const handleMouseMove = useCallback(
    (e: MouseEvent) => {
      handleMove(e.clientX, e.clientY);
    },
    [handleMove]
  );

  const handleMouseUp = useCallback(() => {
    handleEnd();
  }, [handleEnd]);

  // Touch event handlers
  const handleTouchStart = useCallback(
    (e: React.TouchEvent) => {
      e.preventDefault();
      const touch = e.touches[0];
      handleStart(touch.clientX, touch.clientY);
    },
    [handleStart]
  );

  const handleTouchMove = useCallback(
    (e: TouchEvent) => {
      e.preventDefault();
      const touch = e.touches[0];
      handleMove(touch.clientX, touch.clientY);
    },
    [handleMove]
  );

  const handleTouchEnd = useCallback(() => {
    handleEnd();
  }, [handleEnd]);

  // Set up global event listeners
  useEffect(() => {
    if (isPotentialDrag || isDragging) {
      document.addEventListener("mousemove", handleMouseMove);
      document.addEventListener("mouseup", handleMouseUp);
      document.addEventListener("touchmove", handleTouchMove, {
        passive: false,
      });
      document.addEventListener("touchend", handleTouchEnd);

      return () => {
        document.removeEventListener("mousemove", handleMouseMove);
        document.removeEventListener("mouseup", handleMouseUp);
        document.removeEventListener("touchmove", handleTouchMove);
        document.removeEventListener("touchend", handleTouchEnd);
      };
    }
  }, [
    isPotentialDrag,
    isDragging,
    handleMouseMove,
    handleMouseUp,
    handleTouchMove,
    handleTouchEnd,
  ]);

  // Separate cleanup for snap animation on unmount
  useEffect(() => {
    return () => {
      if (snapAnimationRef.current) {
        cancelAnimationFrame(snapAnimationRef.current);
        snapAnimationRef.current = undefined;
      }
    };
  }, []);

  // Initialize position on mount with error handling
  useEffect(() => {
    // Ensure we have a valid zone before updating position
    if (currentZone && DROP_ZONE_CONFIGS[currentZone]) {
      const initialPosition = getZonePosition(currentZone);
      setPosition(initialPosition);
    } else {
      // Fallback to bottom-right if currentZone is invalid
      setCurrentZone("bottom-right");
      const fallbackPosition = getZonePosition("bottom-right");
      setPosition(fallbackPosition);
    }
  }, [getZonePosition]);

  // Handle window resize to keep trigger in bounds
  useEffect(() => {
    const handleResize = throttle(() => {
      // Only update position if we're not currently dragging or snapping
      if (!isDragging && !isSnapping) {
        const newPosition = getZonePosition(currentZone);
        setPosition(newPosition);
      }
    }, 100); // Throttle resize events to avoid excessive updates

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, [currentZone, getZonePosition, isDragging, isSnapping]);

  // Get current animation direction
  const getAnimationDirection = useCallback(() => {
    // Ensure currentZone is valid and exists in config
    if (!currentZone || !DROP_ZONE_CONFIGS[currentZone]) {
      return DROP_ZONE_CONFIGS["bottom-right"].animationDirection;
    }
    return DROP_ZONE_CONFIGS[currentZone].animationDirection;
  }, [currentZone]);

  return {
    isDragging,
    isSnapping,
    position,
    currentZone,
    dragRef,
    getAnimationDirection,
    setPanelCloseCallback,
    handlers: {
      onMouseDown: handleMouseDown,
      onTouchStart: handleTouchStart,
    },
  };
}
