"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isReadable = exports.readableFromWritable = exports.readable = void 0;
const symbol = Symbol("readable");
const readable = (reader) => {
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
    const updater = (newValue) => set(newValue);
    const unsubscribeCb = reader(updater);
    /**
     * add a function listening this Writable changes (update or set)
     * @param {ReadableListener<State>} listener function executed at each changes (update or set) of this Writable, executed immediatly.
     */
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
        if (unsubscribeCb)
            unsubscribeCb();
        else
            throw new Error("This Readable instance has no unsubscribe callback");
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
exports.readable = readable;
const readableFromWritable = (writable) => (0, exports.readable)((set) => writable.subscribe((newValue) => {
    set(newValue);
}));
exports.readableFromWritable = readableFromWritable;
const isReadable = (el) => !!(el && typeof el === "object" && symbol in el);
exports.isReadable = isReadable;
