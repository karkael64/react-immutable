import { useEffect, useState } from "react";
import { writable, isWritable } from "./writable";
import { useImmutable } from "./useImmutable";
const isFunction = (el) => typeof el === "function";
/**
 * @function `useWritable` returns a React state management of a Writable
 * @param {Writable<State, Value> | State} init is the Writable, or initial value for Writable construction
 * @param {WritableReducer<State, Value>} reducer is an optional function for reducing new value at update, used only if `init` is not a Writable
 * @returns {UseWritableOuput<State, Value>} is an immutable (do not change in React LifeCycle) list of arguments, where first item is the current value of Writable, second item is an immutable updater of Writable, third item is an immutable Writable
 */
export const useWritable = (init, reducer) => {
    const [state, setState] = useState(isWritable(init) ? init.valueOf() : init);
    const unmutable = useImmutable(() => {
        const binded = isWritable(init)
            ? init
            : writable(init, reducer);
        return [
            binded.valueOf(),
            (updater) => {
                if (isFunction(updater)) {
                    binded.update((current, set) => set(updater(current)));
                }
                else {
                    binded.set(updater);
                }
            },
            binded,
        ];
    });
    useEffect(() => {
        const unsubscribe = unmutable[2].subscribe(setState);
        return () => {
            unsubscribe();
        };
    }, []);
    unmutable[0] = state;
    return unmutable;
};
