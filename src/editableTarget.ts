export interface EditableTargetOptions {
  includeSelect?: boolean;
  includeContentEditable?: boolean;
}

export function isEditableTarget(
  target: unknown,
  options: EditableTargetOptions = {},
): boolean {
  const element = target as
    { tagName?: string; isContentEditable?: boolean } | null | undefined;

  return (
    element?.tagName === 'INPUT' ||
    element?.tagName === 'TEXTAREA' ||
    (options.includeSelect === true && element?.tagName === 'SELECT') ||
    (options.includeContentEditable === true &&
      element?.isContentEditable === true)
  );
}
