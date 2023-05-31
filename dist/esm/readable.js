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
export const readable = (reader) => {
    let value = undefined;
    const listeners = [];
    const set = (newValue) => {
        if (newValue !== value) {
            value = newValue;
            for (const listener of listeners) {
                listener(value);
            }
        }
    };
    const unsubscribeCb = reader(set);
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
    const unsubscribe = () => {
        if (unsubscribeCb) {
            unsubscribeCb();
            return true;
        }
        return false;
    };
    const valueOf = () => {
        return value;
    };
    const toString = () => {
        return `${value}`;
    };
    return {
        subscribe,
        unsubscribe,
        valueOf,
        toString,
        [symbol]: symbol,
    };
};
export const readableFromWritable = (writable) => readable((set) => writable.subscribe((newValue) => {
    set(newValue);
}));
export const isReadable = (el) => !!(el && typeof el === "object" && symbol in el);
