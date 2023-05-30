"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useEntries = void 0;
const useImmutable_1 = require("./useImmutable");
/**
 * this hook registers a state entry each React life cycle render
 * @param entry state registered
 * @returns an immutable object with methods to get entries
 * @example
 * ```ts
 * const Comp: React.FC<> = () => {
  const [state, setState] = useState(-4.2);
  const entries = useEntries(state);
  const handleReset = useImmutable(() => setState(entries.getFirst()));

  return <Form state={state} setState={setState} onReset={handleReset} />;
};
 * ```
 */
const useEntries = (entry) => {
    const [list, methods] = (0, useImmutable_1.useImmutable)(() => [
        [],
        {
            getFirst: () => list[0],
            getLast: () => list[list.length - 1],
            getEntries: () => list.slice(),
            getUnique: () => Array.from(list.reduce((acc, item) => {
                acc.add(item);
                return acc;
            }, new Set())),
            getChangingList: () => list.reduce((acc, item) => {
                if (acc[0] === undefined || acc[0] !== item) {
                    acc.push(item);
                }
                return acc;
            }, []),
            countEntries: () => list.length,
        },
    ]);
    list.push(entry);
    return methods;
};
exports.useEntries = useEntries;
