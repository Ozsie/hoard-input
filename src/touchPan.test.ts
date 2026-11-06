import { describe, expect, it } from 'vitest';
import {
  createTouchPanState,
  getTouchCentroid,
  handleTwoFingerTouchEnd,
  handleTwoFingerTouchMove,
  handleTwoFingerTouchStart,
} from './gestures';

describe('two-finger touch pan', () => {
  it('starts from the touch centroid and computes pan deltas', () => {
    const state = createTouchPanState();
    const touches = [
      { clientX: 100, clientY: 100 },
      { clientX: 200, clientY: 200 },
    ];

    expect(getTouchCentroid(touches)).toEqual({ x: 150, y: 150 });
    expect(handleTwoFingerTouchStart(touches, { x: 10, y: 20 }, state)).toBe(
      true,
    );
    expect(
      handleTwoFingerTouchMove(
        [
          { clientX: 150, clientY: 120 },
          { clientX: 250, clientY: 220 },
        ],
        state,
      ),
    ).toEqual({ panX: 60, panY: 40, moved: true });
  });

  it('ends a drag when fewer than two touches remain and can reanchor', () => {
    const state = createTouchPanState();
    handleTwoFingerTouchStart(
      [
        { clientX: 0, clientY: 0 },
        { clientX: 20, clientY: 20 },
      ],
      { x: 0, y: 0 },
      state,
    );
    expect(handleTwoFingerTouchEnd([], state, { x: 5, y: 6 })).toEqual({
      shouldEnd: true,
      reanchored: false,
    });
    expect(
      handleTwoFingerTouchEnd(
        [
          { clientX: 10, clientY: 10 },
          { clientX: 30, clientY: 30 },
        ],
        state,
        { x: 5, y: 6 },
      ),
    ).toEqual({ shouldEnd: false, reanchored: true });
  });
});
