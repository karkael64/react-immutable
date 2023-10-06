/**
 * this hook creates an immutable callback, even if `fn` changes. It is same as `useCallback`, but does not need dependencies.
 */
export declare const useCallbackImmutable: <T extends (...args: any[]) => any>(fn: T) => T;
