import { useBase } from "./useBase";
import { useImmutable } from "./useImmutable";

/**
 * this hook creates an immutable callback, with component states `entry` registered in `base` as parameter of your `fn` callback
 * @example
 * ```ts
 * const Comp: React.FC<{ id: number }> = ({ id }) => {
 *   const [count, setCount] = useState(0);
 *   const handleClick = useCallbackBase({ id, count }, (base) => () => {
 *     console.log('try to call', base.id);
 *     setCount(base.count + 1);
 *   });
 *   return (<button onClick={handleClick}>{count}</button>)
 * };
 * ```
 * @example
 * YOU SHOULD NOT CODE LIKE THIS: each time this component or a parent component refresh it life
 * cycle (a state changed), `handleClick` is a new function, then React unassign previous
 * `handleClick` of button and assign the new `handleClick` on click event.
 * ```ts
 * const Comp: React.FC<{ id: number }> = ({ id }) => {
 *   const handleClick = () => {
 *     console.log('try to call', id);
 *   };
 *   return (<button onClick={handleClick}>{id}</button>)
 * };
 * ```
 * YOU SHOULD NOT CODE LIKE THIS: each time `count` changes, the function `handleClick` changes
 * too. It also means React unassign previous `handleClick` of button and assign the new
 * `handleClick` on click event.
 * ```ts
 * const Comp: React.FC<{ count: number }> = ({ count }) => {
 *   const handleClick = useCallback(() => {
 *     console.log('call count', count);
 *   }, [count, id]);
 *   return (<button onClick={handleClick}>{count}</button>)
 * };
 * ```
 * PLEASE USE THIS CODE INSTEAD: `handleClick` is immutable (in React life cycle) and read component
 * state passed by reference `base`.
 * ```ts
 * const Comp: React.FC<{ id: number, count: number }> = ({ id, count }) => {
 *   const handleClick = useCallbackBase({ id, count }, (base) => () => {
 *     console.log('try to call', base.id);
 *     console.log('call count', base.count);
 *   });
 *   return (<button onClick={handleClick}>{id}</button>)
 * };
 * ```
 */
export const useCallbackBase = <
  Entry extends Record<string, any>,
  Fn extends (base: Entry) => (...args: any[]) => any
>(
  entry: Entry,
  fn: Fn
) => {
  if (!(typeof fn === "function"))
    throw new Error("First parameter should be a function");
  const base = useBase<Entry>(entry);
  return useImmutable(() => fn(base) as ReturnType<Fn>);
};
