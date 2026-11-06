import { describe, expect, it, vi } from 'vitest';
import { ActionDispatcher } from './dispatcher';

describe('ActionDispatcher', () => {
  it('registers, clears, disables, and executes action handlers', () => {
    const dispatcher = new ActionDispatcher<'move' | 'use'>();
    const handler = vi.fn();
    const unsubscribe = dispatcher.on('move', handler);

    expect(dispatcher.execute('move')).toBe(true);
    expect(handler).toHaveBeenCalledWith('move');

    dispatcher.setEnabled(false);
    expect(dispatcher.isEnabled()).toBe(false);
    expect(dispatcher.execute('move')).toBe(false);
    dispatcher.setEnabled(true);
    unsubscribe();
    expect(dispatcher.execute('move')).toBe(false);
  });

  it('dispatches a snapshot when handlers mutate registrations', () => {
    const dispatcher = new ActionDispatcher<'move'>();
    const later = vi.fn();
    const first = vi.fn(() => {
      dispatcher.clear('move');
      dispatcher.on('move', later);
    });
    dispatcher.on('move', first);

    dispatcher.execute('move');
    expect(first).toHaveBeenCalledOnce();
    expect(later).not.toHaveBeenCalled();
    dispatcher.execute('move');
    expect(later).toHaveBeenCalledOnce();
  });

  it('delegates failures to the consumer error handler', () => {
    const error = new Error('failed');
    const onError = vi.fn();
    const dispatcher = new ActionDispatcher<'move'>(onError);
    dispatcher.on('move', () => {
      throw error;
    });

    expect(dispatcher.execute('move')).toBe(true);
    expect(onError).toHaveBeenCalledWith(error, 'move');
  });
});
