"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useCallbackImmutable = void 0;
const useImmutable_1 = require("./useImmutable");
/**
 * this hook creates an immutable callback, even if `fn` changes. It is same as `useCallback`, but does not need dependencies.
 */
const useCallbackImmutable = (fn) => {
    if (typeof fn !== 'function')
        throw new Error('Parameter should be a function');
    const cb = (0, useImmutable_1.useImmutable)(() => (...args) => cb.state(...args));
    Object.assign(cb, { state: fn });
    return cb;
};
exports.useCallbackImmutable = useCallbackImmutable;
