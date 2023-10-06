import { useImmutable } from "./useImmutable";

/**
 * this hook creates an immutable callback, even if `fn` changes. It is same as `useCallback`, but does not need dependencies.
 */
export const useCallbackImmutable = <T extends (...args: any[]) => any>(
  fn: T
): T => {
  if (typeof fn !== "function")
    throw new Error("Parameter should be a function");
  const cb = useImmutable(
    () =>
      (...args: Parameters<T>): ReturnType<T> =>
        (cb as T & { state: T }).state(...args)
  );
  Object.assign(cb, { state: fn });
  return cb as T;
};
