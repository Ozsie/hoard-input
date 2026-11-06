import { readdirSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import ts from 'typescript';
import { describe, expect, it } from 'vitest';

const SRC_ROOT = fileURLToPath(new URL('.', import.meta.url));

const sourceFiles = (dir: string): string[] =>
  readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
    const path = join(dir, entry.name);
    if (entry.isDirectory()) return sourceFiles(path);
    return entry.name.endsWith('.ts') && !entry.name.endsWith('.test.ts')
      ? [path]
      : [];
  });

const stringLiterals = (source: string): string[] => {
  const literals: string[] = [];
  const file = ts.createSourceFile(
    'package-source.ts',
    source,
    ts.ScriptTarget.Latest,
    true,
  );
  const visit = (node: ts.Node): void => {
    if (ts.isStringLiteral(node) || ts.isNoSubstitutionTemplateLiteral(node)) {
      literals.push(node.text);
    }
    ts.forEachChild(node, visit);
  };
  visit(file);
  return literals;
};

describe('package sentinels', () => {
  const sources = sourceFiles(SRC_ROOT).map((path) =>
    readFileSync(path, 'utf8'),
  );

  it('does not depend on translation services or contain UI copy', () => {
    for (const source of sources) {
      expect(source).not.toMatch(
        /\b(?:i18n|translate|translator|translations?)\b/i,
      );
      expect(
        stringLiterals(source).filter((literal) => /\s/.test(literal)),
      ).toEqual([]);
    }
  });

  it('does not reference browser or runtime-global APIs', () => {
    for (const source of sources) {
      expect(source).not.toMatch(
        /\b(?:window|document|navigator|localStorage|sessionStorage|HTMLElement|KeyboardEvent|TouchEvent|EventTarget|globalThis|fetch)\b/,
      );
    }
  });
});
