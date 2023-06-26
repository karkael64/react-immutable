import { WritableReducer, Writable } from "./writable";
type StateUpdate<State, Input> = (updater: State | ((current: State) => Input)) => void;
type UseWritableOuput<State, Input = State> = [
    State,
    StateUpdate<State, Input>,
    Writable<State, Input>
];
type UseWritable = {
    <State>(init: Writable<State>): UseWritableOuput<State>;
    <State, Input = State>(init: State, reducer?: WritableReducer<State, Input>): UseWritableOuput<State, Input>;
};
/**
 * returns a React state management of a Writable
 * @param init is the Writable, or initial value for Writable construction
 * @param reducer is an optional function for reducing new value at update, used only if `init` is not a Writable
 * @returns is an immutable (do not change in React LifeCycle) list of arguments, where first item is the current value of Writable, second item is an immutable updater of Writable, third item is an immutable Writable
 */
export declare const useWritable: UseWritable;
export {};
