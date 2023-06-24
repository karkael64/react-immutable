import { useImmutable } from "./useImmutable";

export type EntriesMethods<Entry> = {
  getFirst: () => Entry;
  getLast: () => Entry;
  getEntries: () => Entry[];
  getUnique: () => Entry[];
  getChangingList: () => Entry[];
  countEntries: () => number;
};

/**
 * this hook registers a state entry each React life cycle render
 * @param entry state registered
 * @returns an immutable object with methods to get entries
 * @example
 * ```ts
 * const Comp: React.FC = () => {
 *   const [state, setState] = useState(-4.2);
 *   const entries = useEntries(state);
 *   const handleReset = useImmutable(() => setState(entries.getFirst()));
 * 
 *   return <Form state={state} setState={setState} onReset={handleReset} />;
 * };
 * ```
 */

export const useEntries = <Entry>(entry: Entry) => {
  const [list, methods] = useImmutable((): [Entry[], EntriesMethods<Entry>] => [
    [],
    {
      getFirst: () => list[0]!,
      getLast: () => list[list.length - 1]!,
      getEntries: () => list.slice(),
      getUnique: () =>
        Array.from(
          list.reduce((acc, item) => {
            acc.add(item);
            return acc;
          }, new Set<Entry>())
        ),
      getChangingList: () =>
        list.reduce((acc, item) => {
          if (acc[0] === undefined || acc[0] !== item) {
            acc.push(item);
          }
          return acc;
        }, [] as Entry[]),
      countEntries: () => list.length,
    },
  ]);

  list.push(entry);

  return methods;
};
