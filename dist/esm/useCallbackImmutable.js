import { useRef } from "react";
/**
 * this hook creates an immutable callback, even if `fn` changes. It is same as `useCallback`, but does not need dependencies.
 */
export const useCallbackImmutable = (fn) => {
    if (typeof fn !== "function") {
        throw new Error("Parameter should be a function");
    }
    const ref = useRef({
        callback: fn,
        immutable: (...args) => ref.current.callback(...args),
    });
    Object.assign(ref.current, { callback: fn });
    return ref.current.immutable;
};
