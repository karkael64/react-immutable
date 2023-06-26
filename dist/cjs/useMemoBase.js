"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useMemoBase = void 0;
const useBase_1 = require("./useBase");
const react_1 = require("react");
/**
 * this hook let you trigger `fn` callback when `dependencies` list changes like a useMemo, but with a state `values` registered in `base` as parameter of your `fn` callback.
 * @param entry every values that should be read only, used in parameter `base` of `fn` callback
 * @param fn callback executed each changing of `dependencies` list, with `base` as first parameter.
 * @param dependencies list of items listened on change for updating returned value by `fn`. If empty, `fn` will be executed at first render only, same as `[]`.
 * @returns the returned value by `fn`.
 * @example
 * ```ts
 * type DataType = { id: string; value: number };
 * type DataAssocType = { id: string; value: number; title: string };
 * const Comp: React.FC<{ list: DataType[]; assocTitle: Record<string, string> }> = ({ list, assocTitle }) => {
 *   const computed = useMemoBase(
 *     { assoc }, // read only these values
 *     (base) => list.map((item): DataAssocType => ({ ...item, title: assocTitle[item.id] })),
 *     [list] // output should be updated when these values changes
 *   );
 *   return <List list={computed} />;
 * };
 * ```
 * @example
 * DO NOT USE: when read only values are already immutable or out of component.
 * ```ts
 * const  assocTitle: Record<string, string>
 *
 * type DataType = { id: string; value: number };
 * type DataAssocType = { id: string; value: number; title: string };
 * const Comp: React.FC<{ list: DataType[]; }> = ({ list }) => {
 *   const computed = useMemoBase(
 *     { assoc },
 *     (base) => list.map((item) => ({ ...item, title: assocTitle[item.id] })),
 *     [list]
 *   );
 *   return <List list={computed} />;
 * };
 * ```
 */
const useMemoBase = (entry, fn, dependencies = []) => {
    if (!(typeof fn === "function"))
        throw new Error("First parameter should be a function");
    let first = false;
    const base = (0, useBase_1.useBase)(entry);
    const [state, setState] = (0, react_1.useState)(() => {
        first = true;
        return fn(base);
    });
    if (dependencies.length) {
        (0, react_1.useEffect)(() => {
            if (!first) {
                setState(() => fn(base));
            }
        }, dependencies);
    }
    return state;
};
exports.useMemoBase = useMemoBase;
