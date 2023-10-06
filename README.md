# React Immutable

## Installation

```
npm install react-hook-immutable
```

```
yarn add react-hook-immutable
```

## Usage

```ts
import { useCallbackImmutable } from "react-hook-immutable";

const Comp: React.FC<{
  id: string;
  count: number;
  onClick(id: string, count: number): void;
}> = ({ id, count, onClick }) => {

  const handleClick = useCallbackImmutable((ev: MouseEvent) => onClick(id, count));
  return <button onClick={handleClick}>Clicked {count} times!</button>;
};
```

The `handleClick` is immutable, but its body is refreshed at each rendering of React life cycle, and `useCallbackImmutable` is really more efficient than `useCallback`.

## Context

In React life cycle, there is many rendering because of the state changes, that cause performance issues. The goal of this lib is to reduce the changes of `useCallback`, which updates each time one its dependency changes.

Everytime, the callback of `useCallback` only needs to read values and change states. Why should we have to change the function? Why can not we just read these states when called?

## Analyse

### ☠ The worst solution

```tsx
const Comp: React.FC<{
  id: string;
  count: number;
  onClick(id: string, count: number): void;
}> = ({ id, count, onClick }) => {

  const handleClick = () => onClick(id, count);
  return <button onClick={handleClick}>Clicked {count} times!</button>;
};
```

Each time this component or its parents are rendering, the `onClick` event unassign previous callback and assign the new `handleClick`. It can happens many time and make performance issues.

### ⚠ The second worst solution

```tsx
const Comp: React.FC<{
  id: string;
  count: number;
  onClick(id: string, count: number): void;
}> = ({ id, count, onClick }) => {
  const handleClick = useCallback(
    () => onClick(id, count),
    [id, count, onClick]
  );
  return <button onClick={handleClick}>Clicked {count} times!</button>;
};
```

Now its better, we do not listen each component or parents rendering. But we still listen `id`, `count`, `onClick` and we now checks if these dependencies changes every time. Please note a `useCallback` is composed of a `useState` and a `useEffect` (the useEffect checks each rendering and can be heavy).

### 😓 The React solution (when dependencies are changing frequently)

```tsx
const Comp: React.FC<{
  id: string;
  count: number;
  onClick(id: string, count: number): void;
}> = ({ id, count, onClick }) => {

  const idRef = useRef(id);
  useEffect(() => {
    idRef.current = id;
  }, [id]);

  const countRef = useRef(count);
  useEffect(() => {
    countRef.current = count;
  }, [count]);

  const onClickRef = useRef(onClick);
  useEffect(() => {
    onClickRef.current = onClick;
  }, [onClick]);

  const handleClick = useCallback(
    () => onClickRef.current(idRef.current, countRef.current),
    []
  );

  return <button onClick={handleClick}>Clicked {count} times!</button>;
};
```

A `useCallback` with no dependencies returns a callback considered immutable, it never changes. It's better but there is still several performance issues. We can merge `useRef`, but its value will be changed every time one of these values are changed.

## The Solution Managing Props 👏

After many optimizations, the hook `useCallbackBase` has been created to get an immutable function & to manage props in a `base` object:

```ts
import { useCallbackBase } from "react-hook-immutable";

const Comp: React.FC<{
  id: string;
  count: number;
  onClick(id: string, count: number): void;
}> = ({ id, count, onClick }) => {

  const handleClick = useCallbackBase(
    { id, count, onClick },
    (base) => (ev: MouseEvent) => base.onClick(base.id, base.count)
  );

  return <button onClick={handleClick}>Clicked {count} times!</button>;
};
```

The `handleClick` returned is immutable, and the `useCallbackBase` is only composed of 2 `useState`.

## The Smart Solution 🤟

After many optimizations, the hook `useCallbackImmutable` has been created to match this purpose. It looks like `useCallback` but does not need any dependencies. The function read parent scope (and component changes in React life cycle) & the callback `handleClick` is immutable :

```ts
import { useCallbackImmutable } from "react-hook-immutable";

const Comp: React.FC<{
  id: string;
  count: number;
  onClick(id: string, count: number): void;
}> = ({ id, count, onClick }) => {

  const handleClick = useCallbackImmutable((ev: MouseEvent) => onClick(id, count));
  return <button onClick={handleClick}>Clicked {count} times!</button>;
};
```

The `handleClick` returned is immutable, and the ` useCallbackImmutable` is only composed of 1 `useState`.

## Definitions

### React life cycle

The React life cycle is defined by the React component function, executed at each rendering (because of some state change). A React life cycle starts by execution of component function, then it checks every `useEffect` which dependencies have changed (run the `useEffect` previous destructor and then the main callback). It does the same thing with `useLayoutEffect`, then `useInsertionEffect`. When the React component is no more used, the component triggers the last destructors left then disappear.

As the hooks are registered by index (not by name), the hooks should be the same count and at the same place in React component function.

### Rendering

A rendering happens when a React component state changes. At first renderer, it registers the hooks used by the React component and execute for the last time the `useState` when their parameter is a function. Each time this React component state changes or one of its parents, it triggers a new rendering of the component.

### Immutable

An immutable is a variable that never changes, even at a new rendering. Basic React immutable are the callback `setState` returned as second item of `useState` and the object `ref` returned by `useRef`. The object `ref` returned by `useRef` is immutable, but its `current` property can change. Also please note that the `state` as the first item returned by `useState` is immutable if the `setState` is never used.

## Documentation

### useImmutable

This hook instanciates a variable which is immutable in React life cycle. State `definitiveState` is the definitive state of your hook. The returned value `immutable` is the same value as `definitiveState` in first rendering (if it is a function, returns the returned value).

```ts
// declaration
declare const useImmutable: <T>(definitiveState: T | (() => T)) => T;
```

```ts
// run
const immutable = useImmutable(state);
```

### useBase

This hook writes properties of `entry` in an immutable (in React life cycle) object `base`, which is usefull for referencing items that should be read only. Parameter `entry` is any object (the prototype and not enumerable properties of `entry` are ignored). The value returned is a new object immutable in React life cycle, with properties copied from `entry`, but without not enumerable properties.

```ts
// declaration
declare const useBase: <
  T extends Record<string, any>,
  R extends Record<string, any> = { [k in keyof T]: T[k] }
>(
  entry: T
) => R;
```

```ts
// run
const base = useBase({ state });
base.state;
```

### useMemoBase

This hook let you trigger `fn` callback when `dependencies` list changes like a useMemo, but with a state `entry` registered in `base` as parameter of your `fn` callback. Parameter `entry` contains every values that should be read only, used in parameter `base` of `fn` callback. Parameter `fn` is a callback executed each changing of `dependencies` list, with `base` as first parameter. Parameter `dependencies` lists items listened on change for updating returned value by `fn`. If empty, `fn` will be executed at first rendering only, same as `[]` dependencies. The hook returns the returned value by `fn`.

```ts
// declaration
declare const useMemoBase: <
  Entry extends Record<string, any>,
  Fn extends (base: Entry) => any
>(
  entry: Entry,
  fn: Fn,
  dependencies?: any[]
) => ReturnType<Fn>;
```

```ts
// run
const computed = useMemoBase(
  { read },
  (base) => ({ result: base.read && dep }),
  [dep]
);
computed.result;
```

### useCallbackBase

This hook creates an immutable callback, with component states `entry` registered in `base` as parameter of your `fn` callback.

```ts
// declaration
declare const useCallbackBase: <
  Entry extends Record<string, any>,
  Fn extends (base: Entry) => (...args: any[]) => any
>(
  entry: Entry,
  fn: Fn
) => ReturnType<Fn>;
```

```ts
// run
const callback = useCallbackBase(
  { read, onClick },
  (base) => () => base.onClick(base.read)
);
callback();
```

### useCallbackImmutable

This hook creates an immutable callback. The function read parent scope & component changes in React life cycle.

```ts
// declaration
declare const useCallbackImmutable: <Fn extends (...args: any[]) => any>(fn: Fn) => Fn;
```

```ts
// run
const callback = useCallbackImmutable(() => base.onClick(base.read));
callback();
```

### useEntries

This hook registers a state entry each React life cycle rendering. Its parameter `entry` is the state registered. It returns an immutable object with methods to get entries.

```ts
// declaration
type EntriesMethods<Entry> = {
  getFirst: () => Entry;
  getLast: () => Entry;
  getEntries: () => Entry[];
  getUnique: () => Entry[];
  getChangingList: () => Entry[];
  countEntries: () => number;
};
declare const useEntries: <Entry>(entry: Entry) => EntriesMethods<Entry>;
```

```ts
// run
const entries = useEntries(state);
entries.getFirst();
entries.countEntries();
```

### writable

A writable triggers listeners callback when its own data changes by a `set` or an `update`. The data should not be read outside of a `subscribe`. Parameter `init` is the initial value of this writable instance. Parameter `reducer` is an optional callback which parses input data (by `set` or `update`) before setting the writable.

```ts
// declaration
type WritableListener<State> = (value: State) => Void;
type WritableUpdater<State, Input> = (
  value: State,
  set: (value: Input) => void
) => Void;
type WritableReducer<State, Input> = (
  value: State,
  action: Input,
  set: (value: State) => void
) => Void;
type Writable<State, Input = State> = {
  subscribe(listener: WritableListener<State>): () => boolean;
  update(updater: WritableUpdater<State, Input>): void;
  set(value: Input): void;
  valueOf(): State;
  toString(): string;
};
declare const writable: <State, Input = State>(
  init: State,
  reducer?: WritableReducer<State, Input> | undefined
) => Writable<State, Input>;
```

```ts
// run
const storage = writable(
  Object.assign({ theme: "light" }, localStorage),
  (current, value: Partial<Storage>, set) => set({ ...current, ...value })
);

storage.subscribe((newValue) =>
  Object.entries(newValue).forEach(([field, value]) => {
    if (value === null || value === undefined)
      window.localStorage.removeItem(field);
    else window.localStorage.setItem(field, value);
  })
);

storage.set({ theme: "dark" });
```

### useWritable

This hook returns a React state management of a writable. Parameter `init` is the writable, or initial value for writable construction. Parameter `reducer` is an optional function for reducing new value at update, used only if `init` is not a writable. The hook returns an immutable (do not change in React life cycle) list of arguments, where first item is the current value of writable, second item is an immutable updater of writable, third item is an immutable writable instance.

```ts
// declaration
type StateUpdate<State, Input> = (
  updater: State | ((current: State) => Input)
) => void;
type UseWritableOuput<State, Input = State> = [
  State,
  StateUpdate<State, Input>,
  Writable<State, Input>
];
type UseWritable = {
  <State>(init: Writable<State>): UseWritableOuput<State>;
  <State, Input = State>(
    init: State,
    reducer?: WritableReducer<State, Input>
  ): UseWritableOuput<State, Input>;
};
declare const useWritable: UseWritable;
```

```ts
// run
const [values, updateStorage, storage] = useWritable(storage);
updateStorage({ theme: "light" });
updateStorage(({ theme }) => ({ theme: theme === "light" ? "dark" : "light" }));
```

### readable

A readable listen an event or a subscription and give its value for scripts subscribing it. Parameter `reader` is a callback with `set` as parameter, which should be called each time the readable value changes. The callback can return a callback for unsubscribing the `set` callback.

```ts
// declaration
type ReadableUpdater<State> = (newValue: State) => void;
type ReadableCallback<State> = (
  updater: ReadableUpdater<State>
) => undefined | (() => void);
type Readable<State> = {
  subscribe(listener: ReadableListener<State>): () => boolean;
  unsubscribe(): void;
  valueOf(): State;
  toString(): string;
};
declare const readable: <State>(
  reader: ReadableCallback<State>
) => Readable<State>;
```

```ts
// run
const storage = writable({ user: "me" });
const readStorage = readable((set) => storage.subscribe(set));

const geo = readable<GeolocationPosition>((set) => {
  const id = navigator.geolocation.watchPosition(set);
  return () => navigator.geolocation.clearWatch(id); // optional unsubscribe callback
});
```

### useReadable

This hook returns a React state management of a readable. Parameter `reader` is a callback with `set` as parameter, which should be called each time the readable value changes. The hook returns an immutable (do not change in React life cycle) list of arguments, where first item is the current value of readable, second item is an immutable readable instance.

```ts
// declaration
type UseReadableOuput<State> = [State, Readable<State>];
type UseReadable = {
  <State>(reader: Readable<State>): UseReadableOuput<State>;
  <State>(reader: ReadableCallback<State>): UseReadableOuput<State>;
};
declare const useReadable: UseReadable;
```

```ts
// run
const [value, geo] = useReadable(geo);
```
