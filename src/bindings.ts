export class KeyBindings<Action extends string> {
  private readonly defaults: Record<Action, string[]>;
  private bindings: Record<Action, string[]>;

  constructor(bindings: Record<Action, readonly string[]>) {
    this.defaults = this.clone(bindings);
    this.bindings = this.clone(bindings);
  }

  bind(action: Action, key: string): void {
    if (!this.bindings[action].includes(key)) this.bindings[action].push(key);
  }

  unbind(key: string, action?: Action): void {
    const actions =
      action !== undefined
        ? [action]
        : (Object.keys(this.bindings) as Action[]);
    for (const boundAction of actions) {
      this.bindings[boundAction] = this.bindings[boundAction].filter(
        (boundKey) => boundKey !== key,
      );
    }
  }

  set(bindings: Partial<Record<Action, readonly string[]>>): void {
    for (const action of Object.keys(bindings) as Action[]) {
      const keys = bindings[action];
      if (Object.hasOwn(this.bindings, action) && keys !== undefined) {
        this.bindings[action] = [...keys];
      }
    }
  }

  get(key: string): Action | undefined {
    return (Object.keys(this.bindings) as Action[]).find((action) =>
      this.bindings[action].includes(key),
    );
  }

  getAll(): Record<Action, string[]> {
    return this.clone(this.bindings);
  }

  reset(): void {
    this.bindings = this.clone(this.defaults);
  }

  private clone(
    bindings: Record<Action, readonly string[]>,
  ): Record<Action, string[]> {
    const clone = {} as Record<Action, string[]>;
    for (const action of Object.keys(bindings) as Action[]) {
      clone[action] = [...bindings[action]];
    }
    return clone;
  }
}
