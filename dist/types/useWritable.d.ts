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
 * @function `useWritable` returns a React state management of a Writable
 * @param {Writable<State, Value> | State} init is the Writable, or initial value for Writable construction
 * @param {WritableReducer<State, Value>} reducer is an optional function for reducing new value at update, used only if `init` is not a Writable
 * @returns {UseWritableOuput<State, Value>} is a constant (do not change in React LifeCycle) list of arguments, where first item is the current value of Writable, second item is a constant updater of Writable, third item is a constant Writable
 */
export declare const useWritable: UseWritable;
export {};
