import { readdirSync, readFileSync } from 'node:fs';
import { join, relative } from 'node:path';
import { fileURLToPath } from 'node:url';
import { describe, expect, it } from 'vitest';

const SRC_ROOT = fileURLToPath(new URL('.', import.meta.url));
const importPattern =
  /(?:import|export)\s[^;]*?from\s["']([^"']+)["']|import\s*\(\s*["']([^"']+)["']\s*\)|import\s*["']([^"']+)["']/g;

const isInsidePackage = (importPath: string, fromFile: string): boolean => {
  if (!importPath.startsWith('.')) return false;
  const resolved = relative(
    SRC_ROOT,
    join(fromFile, '..', importPath),
  ).replaceAll('\\', '/');
  return !resolved.startsWith('..');
};

const collectViolations = (dir: string): string[] => {
  const violations: string[] = [];
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    const path = join(dir, entry.name);
    if (entry.isDirectory()) {
      violations.push(...collectViolations(path));
    } else if (entry.name.endsWith('.ts') && !entry.name.endsWith('.test.ts')) {
      for (const match of readFileSync(path, 'utf8').matchAll(importPattern)) {
        const importPath = match[1] ?? match[2] ?? match[3];
        if (importPath && !isInsidePackage(importPath, path)) {
          violations.push(`${path}: imports '${importPath}'`);
        }
      }
    }
  }
  return violations;
};

describe('package boundary', () => {
  it('has no external source imports', () => {
    expect(collectViolations(SRC_ROOT)).toEqual([]);
  });
});
