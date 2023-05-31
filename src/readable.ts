import { Writable, WritableListener } from "./writable";

export type ReadableListener<State> = WritableListener<State>;
type ReadableUpdater<State> = (newValue: State) => void;

export type ReadableCallback<State> = (
  updater: ReadableUpdater<State>
) => undefined | (() => void);

export type Readable<State> = {
  /**
   * add a function listening this Readable changes
   * @param {ReadableListener<State>} listener function executed at each changes (update or set) of this Readable, executed immediatly.
   * @returns a callback for unsubscribing this `listener`. The callback returns `true` on success, else `false`.
   */
  subscribe(listener: ReadableListener<State>): () => boolean;
  /**
   * end the listening of readable
   * @returns `true` on success, else `false`.
   */
  unsubscribe(): void;
  valueOf(): State;
  toString(): string;
};

const symbol = Symbol("readable");

/**
 * readable listen an event or a subscription and give its value for scripts subscribing it.
 * @param reader is a callback with `set` as parameter, which should be called each time the readable value changes. The callback can return a callback for unsubscribing the `set` callback.
 * @example
 * ```ts
 * const storage = writable({ user: 'me' });
 * const readStorage = readable((set) => storage.subscribe(set));
 * ```
 * @example
 * ```ts
 * const geo = readable<GeolocationPosition>((set) => {
 *   const id = navigator.geolocation.watchPosition(set);
 *   return () => navigator.geolocation.clearWatch(id);
 * });
 * ```
 */
export const readable = <State>(
  reader: ReadableCallback<State>
): Readable<State> => {
  let value = undefined as State;
  const listeners: ReadableListener<State>[] = [];

  const set = (newValue: State) => {
    if (newValue !== value) {
      value = newValue;
      for (const listener of listeners) {
        listener(value);
      }
    }
  };

  const unsubscribeCb = reader(set);

  const subscribe = (listener: ReadableListener<State>) => {
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

  const unsubscribe = () => {
    if (unsubscribeCb) {
      unsubscribeCb();
      return true;
    }
    return false;
  };

  const valueOf = (): State => {
    return value;
  };

  const toString = (): string => {
    return `${value}`;
  };

  return {
    subscribe,
    unsubscribe,
    valueOf,
    toString,
    [symbol]: symbol,
  } as Readable<State>;
};

export const readableFromWritable = <State, Input>(
  writable: Writable<State, Input>
) =>
  readable<State>((set) =>
    writable.subscribe((newValue) => {
      set(newValue);
    })
  );

export const isReadable = <State>(el: unknown): el is Readable<State> =>
  !!(el && typeof el === "object" && symbol in el);
