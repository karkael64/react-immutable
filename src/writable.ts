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
type WritableWrite<State> = (value: State) => void;

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
export class Writable<State, Input = State> {
  private value: State;

  private listeners: WritableListener<State>[] = [];

  private write: WritableWrite<State> | WritableWrite<Input>;

  /**
   * @param {State} init initial value
   * @param {WritableReducer<State>} reducer optional function to process value at each changes (update or set) of this Writable, executed immediatly on init.
   */
  constructor(init: State, reducer?: WritableReducer<State, Input>);
  constructor(init: State);
  constructor(init: State, reducer?: WritableReducer<State, Input>) {
    const trigger = (reduced: State) => {
      if (reduced !== this.value) {
        this.value = reduced;
        for (const listener of this.listeners) {
          listener(this.value);
        }
      }
    };
    if (reducer) {
      this.write = (value: Input) => reducer(this.value, value, trigger);
    } else {
      this.write = trigger;
    }
    this.value = init;
  }

  /**
   * add a function listening this Writable changes (update or set)
   * @param {WritableListener<State>} listener function executed at each changes (update or set) of this Writable, executed immediatly.
   */
  subscribe(listener: WritableListener<State>) {
    this.listeners.push(listener);
    listener(this.value);

    const unsubscribe = () => {
      const index = this.listeners.indexOf(listener);
      if (index !== 1) {
        this.listeners.splice(index, 1);
        return true;
      }
      return false;
    };

    return unsubscribe;
  }

  /**
   * @method `update` change Writable own data, by passing current value a first parameter `updater` and returning or promising the new data. The reducer is applied on the new data returned or promised.
   * @param {WritableUpdater<Input>} updater function immediatly executed, with current Writable value as first parameter, returning or promising the new data. The reducer is applied on the new data returned or promised.
   */
  update(updater: WritableUpdater<State, Input>) {
    const set = (updated) => this.set(updated);
    updater(this.value, set);
  }

  /**
   * @method `set` change Writable own data by `value`. The reducer is applied on the `value`.
   * @param {Input} value the new Writable value. The reducer is applied on the `value`.
   */
  set(value: Input) {
    this.write(value as State & Input);
  }

  valueOf(): State {
    return this.value;
  }

  toString(): string {
    return `${this.value}`;
  }
}

type WritableFn = {
  <State>(init: State): Writable<State>;
  <State, Input = State>(
    init: State,
    reducer?: WritableReducer<State, Input>
  ): Writable<State, Input>;
};

/**
 * @function `writable` returns a new Writable
 * @param {State} init initial value
 * @param {WritableReducer<State>} reducer optional function to process value at each changes (update or set) of this Writable, executed immediatly on init.
 * @returns {Writable<State>}
 * @alias Writable<T>.constructor
 */
export const writable: WritableFn = <State, Input = State>(
  init: State,
  reducer?: WritableReducer<State, Input>
): Writable<State, Input> => new Writable<State, Input>(init, reducer);
