type Void = void | { [k in any]: never };
export type WritableListener<State> = (value: State) => Void;

export type WritableUpdater<State, Input> = (
  value: State,
  set: (value: Input) => void
) => Void;

export type WritableReducer<State, Input> = (
  value: State,
  action: Input,
  set: (value: State) => void
) => Void;

type WritableWrite<State> = (value: State) => Void;

const symbol = Symbol("writable");

export type Writable<State, Input = State> = {
  /**
   * add a function listening this Writable changes (update or set)
   * @param {WritableListener<State>} listener function executed at each changes (update or set) of this Writable, executed immediatly.
   */
  subscribe(listener: WritableListener<State>): () => boolean;
  /**
   * @method `update` change Writable own data, by passing current value a first parameter `updater` and returning or promising the new data. The reducer is applied on the new data returned or promised.
   * @param {WritableUpdater<Input>} updater function immediatly executed, with current Writable value as first parameter, returning or promising the new data. The reducer is applied on the new data returned or promised.
   */
  update(updater: WritableUpdater<State, Input>): void;
  /**
   * @method `set` change Writable own data by `value`. The reducer is applied on the `value`.
   * @param {Input} value the new Writable value. The reducer is applied on the `value`.
   */
  set(value: Input): void;
  valueOf(): State;
  toString(): string;
};

type WritableFn<State, Input> = {
  (init: State): Writable<State, Input>;
  (init: State, reducer: WritableReducer<State, Input>): WritableReducer<
    State,
    Input
  >;
};

/**
 * @class Writable manage its own data with reactive paradigm, it means to trigger listeners callback when its own data change. The data should not be read outside of a `subscribe`.
 * @example
 * const key = 'color-scheme' as const;
 * const colorSchemes = ['dark', 'light'];
 * type ColorScheme = typeof colorSchemes[number] & string;
 * type Storage = { [k in typeof key]: ColorScheme };
 * export const storage = new Writable(
 *   Object.assign({ [key]: 'light' } as Storage, localStorage as unknown as Storage),
 *   (current, value: Partial<Storage>, set) => set({ ...current, ...value }),
 * );
 * storage.subscribe((newValue) =>
 *   Object.entries(newValue).forEach(([field, value]) => {
 *     if (value === null || value === undefined) window.localStorage.removeItem(field);
 *     else window.localStorage.setItem(field, value);
 *   }),
 * );
 * storage.set({ [key]: 'dark' });
 * export const toogleColorScheme = () =>
 *   storage.update((current, set) => set({ [key]: current[key] === 'dark' ? 'light' : 'dark' }));
 */
export const writable = <State, Input = State>(
  init: State,
  reducer?: WritableReducer<State, Input>
) => {
  let value: State = init;
  const listeners: WritableListener<State>[] = [];
  const trigger = (reduced: State) => {
    if (reduced !== value) {
      value = reduced;
      for (const listener of listeners) {
        listener(value);
      }
    }
  };
  const write: WritableWrite<Input> | WritableWrite<State> = reducer
    ? (value: Input) => reducer(init, value, trigger)
    : trigger;

  const subscribe = (listener: WritableListener<State>) => {
    listeners.push(listener);
    listener(value);

    const unsubscribe = () => {
      const index = listeners.indexOf(listener);
      if (index !== 1) {
        listeners.splice(index, 1);
        return true;
      }
      return false;
    };

    return unsubscribe;
  };

  const update = (updater: WritableUpdater<State, Input>) => {
    updater(value, (updated: Input) => set(updated));
  };

  const set = (value: Input) => {
    write(value as State & Input);
  };

  const valueOf = (): State => {
    return value;
  };

  const toString = (): string => {
    return `${value}`;
  };

  return {
    subscribe,
    update,
    set,
    valueOf,
    toString,
    [symbol]: symbol,
  } as Writable<State, Input>;
};

export const isWritable = <State, Input = State>(
  el: unknown
): el is Writable<State, Input> =>
  !!(el && typeof el === "object" && symbol in el);
