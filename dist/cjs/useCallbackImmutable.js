"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useCallbackImmutable = void 0;
const react_1 = require("react");
/**
 * this hook creates an immutable callback, even if `fn` changes. It is same as `useCallback`, but does not need dependencies.
 */
const useCallbackImmutable = (fn) => {
    if (typeof fn !== "function") {
        throw new Error("Parameter should be a function");
    }
    const ref = (0, react_1.useRef)({
        callback: fn,
        immutable: (...args) => ref.current.callback(...args),
    });
    Object.assign(ref.current, { callback: fn });
    return ref.current.immutable;
};
exports.useCallbackImmutable = useCallbackImmutable;
