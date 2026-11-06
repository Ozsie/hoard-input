export class HeldActionState<Action extends string> {
  private readonly keyActions = new Map<string, Action>();

  press(key: string, action: Action): boolean {
    const previousAction = this.keyActions.get(key);
    if (previousAction === action) return false;
    if (previousAction !== undefined) this.keyActions.delete(key);
    this.keyActions.set(key, action);
    return !this.isHeld(action, key);
  }

  release(key: string): Action | undefined {
    const action = this.keyActions.get(key);
    if (action === undefined) return undefined;
    this.keyActions.delete(key);
    return this.isHeld(action) ? undefined : action;
  }

  isHeld(action: Action, exceptKey?: string): boolean {
    for (const [key, heldAction] of this.keyActions) {
      if (key !== exceptKey && heldAction === action) return true;
    }
    return false;
  }

  actions(): Action[] {
    return [...new Set(this.keyActions.values())];
  }

  clear(): void {
    this.keyActions.clear();
  }
}
