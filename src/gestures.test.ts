import { describe, expect, it } from 'vitest';
import { classifySwipe } from './gestures';

const config = {
  minSwipeDistance: 30,
  maxSwipeTime: 600,
  enableDiagonals: false,
};

describe('classifySwipe', () => {
  it('classifies cardinal gestures and rejects distance/time boundary violations', () => {
    expect(
      classifySwipe(
        { x: 0, y: 0, time: 0 },
        { x: 40, y: 0, time: 600 },
        config,
      ),
    ).toBe('right');
    expect(
      classifySwipe({ x: 0, y: 0, time: 0 }, { x: 30, y: 0, time: 0 }, config),
    ).toBe('right');
    expect(
      classifySwipe({ x: 0, y: 0, time: 0 }, { x: 29, y: 0, time: 0 }, config),
    ).toBeNull();
    expect(
      classifySwipe(
        { x: 0, y: 0, time: 0 },
        { x: 40, y: 0, time: 601 },
        config,
      ),
    ).toBeNull();
  });

  it('optionally classifies diagonal swipes', () => {
    expect(
      classifySwipe(
        { x: 0, y: 0, time: 0 },
        { x: 40, y: 40, time: 100 },
        { ...config, enableDiagonals: true },
      ),
    ).toBe('down-right');
  });
});
