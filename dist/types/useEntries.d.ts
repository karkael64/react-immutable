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
export declare const useEntries: <Entry>(entry: Entry) => EntriesMethods<Entry>;
