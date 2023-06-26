type Void = void | {
    [k in any]: never;
};
export type WritableListener<State> = (value: State) => Void;
export type WritableUpdater<State, Input> = (value: State, set: (value: Input) => void) => Void;
export type WritableReducer<State, Input> = (value: State, action: Input, set: (value: State) => void) => Void;
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
     * @param {Input} value the writable value. The reducer is applied on the `value`.
     */
    set(value: Input): void;
    valueOf(): State;
    toString(): string;
};
/**
 * writable triggers listeners callback when its own data changes by a `set` or an `update`. The data should not be read outside of a `subscribe`.
 * @param init is the initial value of this writable instance
 * @param reducer is an optional callback which parses input data (by `set` or `update`) before setting the writable
 * @example
 * const key = 'color-scheme' as const;
 * const colorSchemes = ['dark', 'light'];
 * type ColorScheme = typeof colorSchemes[number] & string;
 * type Storage = { [k in typeof key]: ColorScheme };
 * export const storage = writable(
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
export declare const writable: <State, Input = State>(init: State, reducer?: WritableReducer<State, Input> | undefined) => Writable<State, Input>;
export declare const isWritable: <State, Input = State>(el: unknown) => el is Writable<State, Input>;
export {};
