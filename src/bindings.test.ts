import { describe, expect, it } from 'vitest';
import { KeyBindings } from './bindings';

describe('KeyBindings', () => {
  it('supports lookup, rebinding, unbinding, and resetting', () => {
    const bindings = new KeyBindings({
      up: ['ArrowUp', 'w'],
      down: ['ArrowDown'],
    });
    expect(bindings.get('w')).toBe('up');

    bindings.bind('down', 's');
    bindings.unbind('ArrowUp', 'up');
    expect(bindings.get('s')).toBe('down');
    expect(bindings.get('ArrowUp')).toBeUndefined();

    bindings.reset();
    expect(bindings.get('ArrowUp')).toBe('up');
    expect(bindings.get('s')).toBeUndefined();
  });

  it('does not expose mutable internal bindings', () => {
    const bindings = new KeyBindings({ up: ['w'] });
    bindings.getAll().up.push('ArrowUp');
    expect(bindings.get('ArrowUp')).toBeUndefined();
  });

  it('clones binding updates before storing them', () => {
    const bindings = new KeyBindings({ up: ['w'] });
    const updates = { up: ['ArrowUp'] };
    bindings.set(updates);
    updates.up.push('KeyW');

    expect(bindings.get('KeyW')).toBeUndefined();
    expect(bindings.get('ArrowUp')).toBe('up');
  });
});
