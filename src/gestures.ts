export type SwipeDirection =
  | 'up'
  | 'down'
  | 'left'
  | 'right'
  | 'up-left'
  | 'up-right'
  | 'down-left'
  | 'down-right';

export interface GesturePosition {
  x: number;
  y: number;
  time: number;
}

export interface SwipeConfig {
  minSwipeDistance: number;
  maxSwipeTime: number;
  enableDiagonals: boolean;
}

export interface TouchPoint {
  clientX: number;
  clientY: number;
}

export interface TouchPanState {
  isDragging: boolean;
  startX: number;
  startY: number;
  startPanX: number;
  startPanY: number;
  hasMoved: boolean;
}

export function classifySwipe(
  start: GesturePosition,
  end: GesturePosition,
  config: SwipeConfig,
): SwipeDirection | null {
  const dx = end.x - start.x;
  const dy = end.y - start.y;
  const elapsed = end.time - start.time;
  if (elapsed > config.maxSwipeTime) return null;

  const absDx = Math.abs(dx);
  const absDy = Math.abs(dy);
  if (Math.hypot(dx, dy) < config.minSwipeDistance) return null;

  if (!config.enableDiagonals) {
    if (absDx > absDy) return dx > 0 ? 'right' : 'left';
    return dy > 0 ? 'down' : 'up';
  }

  const angle = (Math.atan2(dy, dx) * 180) / Math.PI;
  if (angle >= -22.5 && angle < 22.5) return 'right';
  if (angle >= 22.5 && angle < 67.5) return 'down-right';
  if (angle >= 67.5 && angle < 112.5) return 'down';
  if (angle >= 112.5 && angle < 157.5) return 'down-left';
  if (angle >= -67.5 && angle < -22.5) return 'up-right';
  if (angle >= -112.5 && angle < -67.5) return 'up';
  if (angle >= -157.5 && angle < -112.5) return 'up-left';
  return 'left';
}

export const createTouchPanState = (): TouchPanState => ({
  isDragging: false,
  startX: 0,
  startY: 0,
  startPanX: 0,
  startPanY: 0,
  hasMoved: false,
});

export const getTouchCentroid = (
  touches: ArrayLike<TouchPoint>,
): { x: number; y: number } | null => {
  if (touches.length < 2) return null;
  return {
    x: (touches[0].clientX + touches[1].clientX) / 2,
    y: (touches[0].clientY + touches[1].clientY) / 2,
  };
};

export const handleTwoFingerTouchStart = (
  touches: ArrayLike<TouchPoint>,
  currentPan: { x: number; y: number },
  state: TouchPanState,
): boolean => {
  if (touches.length === 2) {
    const centroid = getTouchCentroid(touches);
    if (!centroid) return false;
    state.isDragging = true;
    state.startX = centroid.x;
    state.startY = centroid.y;
    state.startPanX = currentPan.x;
    state.startPanY = currentPan.y;
    state.hasMoved = false;
    return true;
  }
  if (state.isDragging) state.isDragging = false;
  return false;
};

export const handleTwoFingerTouchMove = (
  touches: ArrayLike<TouchPoint>,
  state: TouchPanState,
): { panX: number; panY: number; moved: boolean } | null => {
  if (!state.isDragging || touches.length !== 2) return null;
  const centroid = getTouchCentroid(touches);
  if (!centroid) return null;

  const dx = centroid.x - state.startX;
  const dy = centroid.y - state.startY;
  if (Math.abs(dx) > 3 || Math.abs(dy) > 3) state.hasMoved = true;

  return {
    panX: state.startPanX + dx,
    panY: state.startPanY + dy,
    moved: state.hasMoved,
  };
};

export const handleTwoFingerTouchEnd = (
  touches: ArrayLike<TouchPoint>,
  state: TouchPanState,
  currentPan: { x: number; y: number },
): { shouldEnd: boolean; reanchored: boolean } => {
  if (touches.length < 2) {
    const wasDragging = state.isDragging;
    state.isDragging = false;
    return { shouldEnd: wasDragging, reanchored: false };
  }
  if (touches.length === 2 && !state.isDragging) {
    const centroid = getTouchCentroid(touches);
    if (centroid) {
      state.isDragging = true;
      state.startX = centroid.x;
      state.startY = centroid.y;
      state.startPanX = currentPan.x;
      state.startPanY = currentPan.y;
      return { shouldEnd: false, reanchored: true };
    }
  }
  return { shouldEnd: false, reanchored: false };
};
