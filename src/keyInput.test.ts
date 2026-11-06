import { describe, expect, it, vi } from 'vitest';
import { ActionDispatcher } from './dispatcher';
import { KeyBindings } from './bindings';
import { dispatchKeyInput } from './keyInput';

describe('dispatchKeyInput', () => {
  it('prevents the default and dispatches a bound key', () => {
    const bindings = new KeyBindings({ move: ['ArrowUp'] });
    const dispatcher = new ActionDispatcher<'move'>();
    const handler = vi.fn();
    dispatcher.on('move', handler);
    const preventDefault = vi.fn();

    expect(
      dispatchKeyInput(
        { key: 'ArrowUp', preventDefault },
        bindings,
        dispatcher,
      ),
    ).toBe(true);
    expect(preventDefault).toHaveBeenCalledOnce();
    expect(handler).toHaveBeenCalledWith('move');
  });

  it('ignores editable targets, unknown keys, and disabled dispatchers', () => {
    const bindings = new KeyBindings({ move: ['ArrowUp'] });
    const dispatcher = new ActionDispatcher<'move'>();
    const preventDefault = vi.fn();

    expect(
      dispatchKeyInput(
        { key: 'ArrowUp', target: { tagName: 'INPUT' }, preventDefault },
        bindings,
        dispatcher,
      ),
    ).toBe(false);
    expect(
      dispatchKeyInput({ key: 'F5', preventDefault }, bindings, dispatcher),
    ).toBe(false);
    dispatcher.setEnabled(false);
    expect(
      dispatchKeyInput(
        { key: 'ArrowUp', preventDefault },
        bindings,
        dispatcher,
      ),
    ).toBe(false);
    expect(preventDefault).not.toHaveBeenCalled();
  });
});
