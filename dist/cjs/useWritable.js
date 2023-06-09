"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useWritable = void 0;
const react_1 = require("react");
const writable_1 = require("./writable");
const useImmutable_1 = require("./useImmutable");
const isFunction = (el) => typeof el === "function";
/**
 * returns a React state management of a Writable
 * @param init is the Writable, or initial value for Writable construction
 * @param reducer is an optional function for reducing new value at update, used only if `init` is not a Writable
 * @returns is an immutable (do not change in React LifeCycle) list of arguments, where first item is the current value of Writable, second item is an immutable updater of Writable, third item is an immutable Writable
 */
const useWritable = (init, reducer) => {
    const [state, setState] = (0, react_1.useState)((0, writable_1.isWritable)(init) ? init.valueOf() : init);
    const unmutable = (0, useImmutable_1.useImmutable)(() => {
        const binded = (0, writable_1.isWritable)(init)
            ? init
            : (0, writable_1.writable)(init, reducer);
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
    (0, react_1.useEffect)(() => {
        const unsubscribe = unmutable[2].subscribe(setState);
        return () => {
            unsubscribe();
        };
    }, []);
    unmutable[0] = state;
    return unmutable;
};
exports.useWritable = useWritable;
