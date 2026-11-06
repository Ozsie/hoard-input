import { describe, expect, it } from 'vitest';
import { HeldActionState } from './actionState';

describe('HeldActionState', () => {
  it('tracks actions by key and only releases after the last bound key', () => {
    const state = new HeldActionState<'move' | 'use'>();
    expect(state.press('ArrowUp', 'move')).toBe(true);
    expect(state.press('KeyW', 'move')).toBe(false);
    expect(state.actions()).toEqual(['move']);
    expect(state.release('ArrowUp')).toBeUndefined();
    expect(state.isHeld('move')).toBe(true);
    expect(state.release('KeyW')).toBe('move');
    expect(state.isHeld('move')).toBe(false);
  });

  it('clears held keys and ignores repeated keydown events', () => {
    const state = new HeldActionState<'move'>();
    state.press('KeyW', 'move');
    expect(state.press('KeyW', 'move')).toBe(false);
    state.clear();
    expect(state.actions()).toEqual([]);
    expect(state.release('KeyW')).toBeUndefined();
  });
});
