import { Writable, WritableListener } from "./writable";
export type ReadableListener<State> = WritableListener<State>;
type ReadableUpdater<State> = (newValue: State) => void;
export type ReadableCallback<State> = (updater: ReadableUpdater<State>) => undefined | (() => void);
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
export declare const readable: <State>(reader: ReadableCallback<State>) => Readable<State>;
export declare const readableFromWritable: <State, Input>(writable: Writable<State, Input>) => Readable<State>;
export declare const isReadable: <State>(el: unknown) => el is Readable<State>;
export {};
