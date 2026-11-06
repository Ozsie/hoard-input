# @hoard-engine/input

Generic key binding, action dispatch, held-action and touch gesture
mechanics for interactive applications. A dependency-free leaf of the
HOARD engine — no game actions, framework or browser event wiring.

## Pluggable, interoperable, standalone

HOARD engine packages share the same design goals:

- **Pluggable.** Adopt a package on its own, or swap it out, without
  touching the rest of the engine — there is no central engine object
  to install and no package that owns the others.
- **Interoperable.** Packages compose with each other and with
  consumer code through data: minimal shapes, callback seams and plain
  values — never through shared state or a common framework.
- **As standalone as possible.** Each package is usable as-is in any
  project, HOARD-based or not; the leaf packages carry no dependencies
  and import no siblings.

This package meets all three by construction.

## Install

```bash
npm install @hoard-engine/input
```

Requires Node 18+ (ESM only).

## Usage

```ts
import {
  ActionDispatcher,
  HeldActionState,
  KeyBindings,
  classifySwipe,
  dispatchKeyInput,
} from '@hoard-engine/input';

type Action = 'move-up' | 'move-down';
declare const moveHero: (direction: 'north') => void; // injected by the game
const bindings = new KeyBindings<Action>({
  'move-up': ['ArrowUp', 'w'],
  'move-down': ['ArrowDown', 's'],
});

const dispatcher = new ActionDispatcher<Action>();
// The mapping from generic actions to game rules stays with the consumer.
dispatcher.on('move-up', () => moveHero('north')); // consumer policy
dispatchKeyInput({ key: 'ArrowUp' }, bindings, dispatcher);

const held = new HeldActionState<Action>();
const action = bindings.get('ArrowUp');
if (action) {
  held.press('ArrowUp', action);
  dispatcher.execute(action);
}

const direction = classifySwipe(
  { x: 0, y: 0, time: 0 },
  { x: 50, y: 0, time: 120 },
  { minSwipeDistance: 30, maxSwipeTime: 600, enableDiagonals: true },
);
```

The package never asks for world state, a framework or asset paths.
Consumers inject action vocabulary, bindings, callbacks and adapt their
browser events to the plain data contracts.

## API

| Export                       | Description                                                               |
| ---------------------------- | ------------------------------------------------------------------------- |
| `KeyBindings`                | Rebindable action-to-key registry with cloned defaults and snapshots      |
| `ActionDispatcher`           | Registers, clears and executes action handlers; accepts an error callback |
| `ActionHandler`              | Handler callback shape for an action type                                 |
| `ActionErrorHandler`         | Consumer callback shape for a handler failure                             |
| `HeldActionState`            | Tracks actions held by keys until the final bound key is released         |
| `dispatchKeyInput`           | Resolves a plain key event, filters editable targets and dispatches action |
| `isEditableTarget`           | Checks plain target shapes for text fields with optional extra predicates  |
| `EditableTargetOptions`      | Opt-in rules for select and content-editable targets                       |
| `classifySwipe`              | Classifies a coordinate/time pair using distance and angle thresholds     |
| `GesturePosition`            | Plain x/y/time sample used for swipe classification                        |
| `SwipeConfig`                | Distance, time and diagonal-classification settings                       |
| `SwipeDirection`             | Cardinal or diagonal swipe result                                          |
| `createTouchPanState`        | Creates the mutable state for a two-finger pan                             |
| `getTouchCentroid`           | Returns the midpoint of the first two touch points                         |
| `handleTwoFingerTouchStart`  | Anchors pan state when exactly two touches begin                           |
| `handleTwoFingerTouchMove`   | Computes pan offsets and movement threshold state                          |
| `handleTwoFingerTouchEnd`    | Ends or reanchors a two-finger pan                                          |
| `TouchPanState`              | Plain mutable state for the two-finger pan lifecycle                       |
| `TouchPoint`                 | Minimal client-coordinate shape consumed by touch-pan mechanics            |

## Design notes

- Key-binding inputs, stored values and returned snapshots are cloned;
  callers cannot mutate the registry through an alias.
- Action dispatch iterates a handler snapshot. Registrations changed
  during dispatch take effect on the next execution.
- Handler errors are rethrown unless the consumer injects an error
  callback; logging and recovery policy stay with the consumer.
- A held action remains active until every key mapped to it is released.
- Swipe thresholds are inclusive at their minimum distance and maximum
  elapsed time; diagonal classification uses 45-degree octants.
- Two-finger pan uses the centroid of the first two points and marks
  movement only after either axis moves more than three pixels.
- The package uses plain coordinate and target shapes, not browser
  classes; DOM listeners and action mappings remain consumer-owned.

## Development

```bash
npm test          # vitest
npm run check     # tsc --noEmit
npm run lint      # eslint over src
npm run prettier  # prettier --check (fix via prettier:format)
npm run build     # tsc declarations + esbuild ESM bundle to dist/
npm publish       # prepublishOnly runs check + build + test first
```