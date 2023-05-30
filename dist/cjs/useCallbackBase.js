"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useCallbackBase = void 0;
const useBase_1 = require("./useBase");
const useImmutable_1 = require("./useImmutable");
/**
 * this hook creates an immutable callback, with component states `values` registered in `base` as parameter of your `fn` callback
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
 *   }, [id]);
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
const useCallbackBase = (values, fn) => {
    if (!(typeof fn === "function"))
        throw new Error("First parameter should be a function");
    const base = (0, useBase_1.useBase)(values);
    return (0, useImmutable_1.useImmutable)(() => fn(base));
};
exports.useCallbackBase = useCallbackBase;
