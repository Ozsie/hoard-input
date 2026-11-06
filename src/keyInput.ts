import type { ActionDispatcher } from './dispatcher';
import { isEditableTarget, type EditableTargetOptions } from './editableTarget';
import type { KeyBindings } from './bindings';

export function dispatchKeyInput<Action extends string>(
  event: {
    key: string;
    target?: unknown;
    preventDefault?: () => void;
  },
  bindings: Pick<KeyBindings<Action>, 'get'>,
  dispatcher: Pick<ActionDispatcher<Action>, 'execute' | 'isEnabled'>,
  targetOptions: EditableTargetOptions = {},
): boolean {
  if (
    !dispatcher.isEnabled() ||
    isEditableTarget(event.target, targetOptions)
  ) {
    return false;
  }

  const action = bindings.get(event.key);
  if (action === undefined) return false;

  event.preventDefault?.();
  return dispatcher.execute(action);
}
