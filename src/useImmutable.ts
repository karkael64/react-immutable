import { useRef } from "react";

const isFunction = (el: unknown): el is (...args: any[]) => any =>
  typeof el === "function";

/**
 * this hook instanciates a variable which is immutable in React life cycle.
 * @param definitiveState the definitive state of your hook
 * @returns same value as `definitiveState` (if it is a function, returns the returned value).
 * @example
 * ```ts
 * const Comp: React.FC<{ initFormData: Object }> = ({ initFormData }) => {
 *   const savedInitFormData = useImmutable(initFormData);
 *   return (<>jsx</>);
 * };
 * ```
 * @example
 * YOU SHOULD NOT CODE LIKE THIS
 * ```ts
 * const Comp: React.FC = () => {
 *   const text = useImmutable('Hello world!');
 *   return (<p>{text}</p>);
 * };
 * ```
 * PLEASE USE THIS CODE INSTEAD
 * ```ts
 * const text = 'Hello world!';
 * const Comp: React.FC = () => {
 *   return (<p>{text}</p>);
 * };
 * ```
 */
export const useImmutable = <T>(definitiveState: (() => T) | T): T => {
  const ref = useRef({ init: false, value: undefined as T });
  if (!ref.current.init) {
    Object.assign(ref, {
      current: {
        init: true,
        value: isFunction(definitiveState)
          ? definitiveState()
          : definitiveState,
      },
    });
  }
  return ref.current.value;
};
