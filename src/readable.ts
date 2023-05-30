import { Writable, WritableListener } from "./writable";

export type ReadableListener<State> = WritableListener<State>;
type ReadableUpdater<State> = (newValue: State) => void;
export type ReadableCallback<State> = (
  updater: ReadableUpdater<State>
) => undefined | (() => void);
type ReadableUnsubscribe = () => void;

export class Readable<State> {
  private value: State;

  private listeners: ReadableListener<State>[] = [];

  private unsubscribeCb?: ReadableUnsubscribe;

  constructor(reader: ReadableCallback<State>) {
    const updater = (newValue: State) => this.set(newValue);
    this.unsubscribeCb = reader(updater);
  }

  /**
   * add a function listening this Writable changes (update or set)
   * @param {ReadableListener<State>} listener function executed at each changes (update or set) of this Writable, executed immediatly.
   */
  subscribe(listener: ReadableListener<State>) {
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

  unsubscribe() {
    if (this.unsubscribeCb) this.unsubscribeCb?.();
    else throw new Error("This Readable instance has no unsubscribe callback");
  }

  private set(value: State) {
    if (value !== this.value) {
      this.value = value;
      for (const listener of this.listeners) {
        listener(this.value);
      }
    }
  }

  valueOf(): State {
    return this.value;
  }

  toString(): string {
    return `${this.value}`;
  }
}

export const readable = <State>(reader: ReadableCallback<State>) =>
  new Readable(reader);

export const readableFromWritable = <State, Input>(
  writable: Writable<State, Input>
) =>
  new Readable<State>((set) =>
    writable.subscribe((newValue) => {
      set(newValue);
    })
  );
