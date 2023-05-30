import { Writable, WritableListener } from "./writable";
export type ReadableListener<State> = WritableListener<State>;
type ReadableUpdater<State> = (newValue: State) => void;
export type ReadableCallback<State> = (updater: ReadableUpdater<State>) => undefined | (() => void);
export type Readable<State> = {
    subscribe(listener: ReadableListener<State>): () => boolean;
    unsubscribe(): void;
    valueOf(): State;
    toString(): string;
};
export declare const readable: <State>(reader: ReadableCallback<State>) => Readable<State>;
export declare const readableFromWritable: <State, Input>(writable: Writable<State, Input>) => Readable<State>;
export declare const isReadable: <State>(el: unknown) => el is Readable<State>;
export {};
