export type EntriesMethods<T> = {
    getFirst: () => T | undefined;
    getLast: () => T | undefined;
    getEntries: () => T[];
    getUnique: () => T[];
    getChangingList: () => T[];
    countEntries: () => number;
};
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
export declare const useEntries: <T>(entry: T) => EntriesMethods<T>;
