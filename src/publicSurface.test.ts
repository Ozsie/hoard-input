import { readdirSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { describe, expect, it } from 'vitest';
import * as actionState from './actionState';
import * as bindings from './bindings';
import * as dispatcher from './dispatcher';
import * as editableTarget from './editableTarget';
import * as gestures from './gestures';
import * as index from './index';
import * as keyInput from './keyInput';

const SRC_ROOT = fileURLToPath(new URL('.', import.meta.url));
const indexSource = readFileSync(
  new URL('./index.ts', import.meta.url),
  'utf8',
);

const indexExports = (): string[] =>
  [...indexSource.matchAll(/export(?:\s+type)?\s+\{([^}]+)\}/g)].flatMap(
    (match) =>
      match[1]
        .split(',')
        .map((name) => name.trim().replace(/^type\s+/, ''))
        .filter(Boolean),
  );

const sourceFiles = (dir: string): string[] =>
  readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
    const path = join(dir, entry.name);
    if (entry.isDirectory()) return sourceFiles(path);
    return entry.name.endsWith('.ts') && !entry.name.endsWith('.test.ts')
      ? [path]
      : [];
  });

const sourceExports = (): string[] =>
  sourceFiles(SRC_ROOT)
    .filter((path) => path !== join(SRC_ROOT, 'index.ts'))
    .flatMap((path) =>
      [
        ...readFileSync(path, 'utf8').matchAll(
          /export\s+(?:class|function|const|interface|type)\s+([\w$]+)/g,
        ),
      ].map((match) => match[1]),
    );

describe('package public surface', () => {
  it('re-exports every named declaration from the source modules', () => {
    const reExports = indexExports();
    expect(sourceExports().filter((name) => !reExports.includes(name))).toEqual(
      [],
    );
  });

  it('exports only the intended runtime names', () => {
    expect(Object.keys(index).sort()).toEqual(
      [
        'ActionDispatcher',
        'HeldActionState',
        'KeyBindings',
        'classifySwipe',
        'createTouchPanState',
        'dispatchKeyInput',
        'getTouchCentroid',
        'handleTwoFingerTouchEnd',
        'handleTwoFingerTouchMove',
        'handleTwoFingerTouchStart',
        'isEditableTarget',
      ].sort(),
    );
  });

  it('keeps every source module reachable from the entry point', () => {
    const modules = [
      actionState,
      bindings,
      dispatcher,
      editableTarget,
      gestures,
      keyInput,
    ];
    const entryExports = new Set(Object.keys(index));
    for (const module of modules) {
      expect(Object.keys(module).every((name) => entryExports.has(name))).toBe(
        true,
      );
    }
  });
});
