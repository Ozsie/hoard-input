import { describe, expect, it } from 'vitest';
import { isEditableTarget } from './editableTarget';

describe('isEditableTarget', () => {
  it('recognizes text inputs without depending on DOM classes', () => {
    expect(isEditableTarget({ tagName: 'INPUT' })).toBe(true);
    expect(isEditableTarget({ tagName: 'TEXTAREA' })).toBe(true);
    expect(isEditableTarget({ tagName: 'DIV' })).toBe(false);
    expect(isEditableTarget(null)).toBe(false);
  });

  it('allows consumers to opt in to additional editable targets', () => {
    expect(isEditableTarget({ tagName: 'SELECT' })).toBe(false);
    expect(
      isEditableTarget({ tagName: 'SELECT' }, { includeSelect: true }),
    ).toBe(true);
    expect(
      isEditableTarget(
        { tagName: 'DIV', isContentEditable: true },
        { includeContentEditable: true },
      ),
    ).toBe(true);
  });
});
