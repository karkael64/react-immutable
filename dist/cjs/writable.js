"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isWritable = exports.writable = void 0;
const symbol = Symbol("writable");
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
const writable = (init, reducer) => {
    let value = init;
    const listeners = [];
    const trigger = (reduced) => {
        if (reduced !== value) {
            value = reduced;
            for (const listener of listeners) {
                listener(value);
            }
        }
    };
    const write = reducer
        ? (value) => reducer(init, value, trigger)
        : trigger;
    const subscribe = (listener) => {
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
    const update = (updater) => {
        updater(value, (updated) => set(updated));
    };
    const set = (value) => {
        write(value);
    };
    const valueOf = () => {
        return value;
    };
    const toString = () => {
        return `${value}`;
    };
    return {
        subscribe,
        update,
        set,
        valueOf,
        toString,
        [symbol]: symbol,
    };
};
exports.writable = writable;
const isWritable = (el) => !!(el && typeof el === "object" && symbol in el);
exports.isWritable = isWritable;
