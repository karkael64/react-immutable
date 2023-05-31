import { Readable, ReadableCallback } from "./readable";
type UseReadableOuput<State> = [State, Readable<State>];
type UseReadable = {
    <State>(reader: Readable<State>): UseReadableOuput<State>;
    <State>(reader: ReadableCallback<State>): UseReadableOuput<State>;
};
/**
 * @function `useReadable` returns a React state management of a Readable
 * @param {ReadableCallback<State>} reader is a callback with `set` as parameter, which should be called each time the readable value changes
 * @returns {UseReadableOuput<State>} is an immutable (do not change in React LifeCycle) list of arguments, where first item is the current value of Readable, second item is an immutable Readable
 */
export declare const useReadable: UseReadable;
export {};
