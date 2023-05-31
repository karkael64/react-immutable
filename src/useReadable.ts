import { useEffect, useState } from "react";
import { Readable, ReadableCallback, isReadable, readable } from "./readable";
import { useImmutable } from "./useImmutable";

type UseReadableOuput<State> = [State, Readable<State>];
type UseReadable = {
  <State>(reader: Readable<State>): UseReadableOuput<State>;
  <State>(reader: ReadableCallback<State>): UseReadableOuput<State>;
};

/**
 * returns a React state management of a Readable
 * @param reader is a callback with `set` as parameter, which should be called each time the readable value changes
 * @returns is an immutable (do not change in React LifeCycle) list of arguments, where first item is the current value of Readable, second item is an immutable Readable
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
