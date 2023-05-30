import { Writable, WritableListener } from "./writable";

export type ReadableListener<State> = WritableListener<State>;
type ReadableUpdater<State> = (newValue: State) => void;

export type ReadableCallback<State> = (
  updater: ReadableUpdater<State>
) => undefined | (() => void);

export type Readable<State> = {
  subscribe(listener: ReadableListener<State>): () => boolean;
  unsubscribe(): void;
  valueOf(): State;
  toString(): string;
};

const symbol = Symbol("readable");

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

  const updater = (newValue: State) => set(newValue);
  const unsubscribeCb = reader(updater);

  /**
   * add a function listening this Writable changes (update or set)
   * @param {ReadableListener<State>} listener function executed at each changes (update or set) of this Writable, executed immediatly.
   */
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
    if (unsubscribeCb) unsubscribeCb();
    else throw new Error("This Readable instance has no unsubscribe callback");
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
