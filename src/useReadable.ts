import { useEffect, useState } from "react";
import { Readable, ReadableCallback, isReadable, readable } from "./readable";
import { useImmutable } from "./useImmutable";

type UseReadableOuput<State> = [State, Readable<State>];
type UseReadable = {
  <State>(reader: Readable<State>): UseReadableOuput<State>;
  <State>(reader: ReadableCallback<State>): UseReadableOuput<State>;
};

/**
 * @function `useReadable` returns a React state management of a Readable
 * @param {ReadableCallback<State>} reader is an optional function for reducing new value at update, used only if `init` is not a Readable
 * @returns {UseReadableOuput<State>} is a constant (do not change in React LifeCycle) list of arguments, where first item is the current value of Readable, second item is a constant updater of Readable, third item is a constant Readable
 */
export const useReadable: UseReadable = <State>(
  reader: Readable<State> | ReadableCallback<State>
): UseReadableOuput<State> => {
  const [state, setState] = useState<State | undefined>(
    isReadable(reader) ? reader.valueOf() : undefined
  );

  const unmutable = useImmutable((): UseReadableOuput<State> => {
    const binded = isReadable(reader) ? reader : readable(reader);
    return [binded.valueOf(), binded];
  });

  useEffect(() => {
    const unsubscribe = unmutable[1].subscribe(setState);
    return () => {
      unsubscribe();
    };
  }, []);

  unmutable[0] = state as State;
  return unmutable;
};
