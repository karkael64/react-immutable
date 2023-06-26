import { useImmutable } from "./useImmutable";

/**
 * this hook writes properties of `entry` in an immutable (in React life cycle) object `base`, which is usefull for referencing items that should be read only.
 * @param entry is any object (the prototype and not enumerable properties of `entry` are ignored)
 * @returns a new object immutable in React life cycle, with properties copied from `entry`, but without object prototype
 * @example
 * remember an immutable is useless in a useEffect dependencies: in this code below useCallback dependencies `[base, setCount]` are equivalent to `[]`, which means callback returned is also immutable.
 * ```ts
 * const Comp: React.FC = () => {
 *   const [count, setCount] = useState(0);
 *   const base = useBase({ count });
 *   // `base` and `setCount` are immutable, so `handleClick` is immutable here too
 *   const handleClick = useCallback(() => setCount(base.count + 1), [base, setCount]);
 *   return <button onClick={handleClick}>{count}</button>;
 * };
 * ```
 * @example
 * ```ts
 * const Comp: React.FC({ count: number; onClick(newValue: number): void }) = ({ count, onClick }) => {
 *   const [count, setCount] = useState(0);
 *   const base = useBase({ count });
 *   const handleClick = useImmutable(() => () => onClick(base.count + 1));
 *   return <button onClick={handleClick}>{count}</button>;
 * };
 * ```
 */
export const useBase = <
  T extends Record<string, any>,
  R extends Record<string, any> = { [k in keyof T]: T[k] }
>(
  entry: T
): R => {
  if (!(typeof entry === "object"))
    throw new Error("First parameter should be an object");
  const base = useImmutable({} as R);
  return Object.assign(base, entry);
};
