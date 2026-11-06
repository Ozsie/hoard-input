export type ActionHandler<Action extends string> = (action: Action) => void;

export type ActionErrorHandler<Action extends string> = (
  error: unknown,
  action: Action,
) => void;

export class ActionDispatcher<Action extends string> {
  private readonly handlers = new Map<Action, Set<ActionHandler<Action>>>();
  private enabled = true;

  constructor(private readonly onError?: ActionErrorHandler<Action>) {}

  on(action: Action, handler: ActionHandler<Action>): () => void {
    let handlers = this.handlers.get(action);
    if (!handlers) {
      handlers = new Set();
      this.handlers.set(action, handlers);
    }
    handlers.add(handler);
    return () => {
      handlers?.delete(handler);
    };
  }

  clear(action?: Action): void {
    if (action !== undefined) {
      this.handlers.delete(action);
    } else {
      this.handlers.clear();
    }
  }

  execute(action: Action): boolean {
    if (!this.enabled) return false;
    const handlers = [...(this.handlers.get(action) ?? [])];
    if (handlers.length === 0) return false;

    for (const handler of handlers) {
      try {
        handler(action);
      } catch (error) {
        if (!this.onError) throw error;
        this.onError(error, action);
      }
    }
    return true;
  }

  setEnabled(enabled: boolean): void {
    this.enabled = enabled;
  }

  isEnabled(): boolean {
    return this.enabled;
  }
}
