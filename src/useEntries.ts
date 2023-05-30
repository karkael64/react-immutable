import { useImmutable } from "./useImmutable";

export type EntriesMethods<T> = {
  getFirst: () => T | undefined;
  getLast: () => T | undefined;
  getEntries: () => T[];
  getUnique: () => T[];
  getChangingList: () => T[];
  countEntries: () => number;
};

/**
 * this hook register a state entry each React render life cycle
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

export const useEntries = <T>(entry: T) => {
  const [list, methods] = useImmutable((): [T[], EntriesMethods<T>] => [
    [],
    {
      getFirst: () => list[0],
      getLast: () => list[list.length - 1],
      getEntries: () => list.slice(),
      getUnique: () =>
        Array.from(
          list.reduce((acc, item) => {
            acc.add(item);
            return acc;
          }, new Set<T>())
        ),
      getChangingList: () =>
        list.reduce((acc, item) => {
          if (acc[0] === undefined || acc[0] !== item) {
            acc.push(item);
          }
          return acc;
        }, [] as T[]),
      countEntries: () => list.length,
    },
  ]);

  list.push(entry);

  return methods;
};
