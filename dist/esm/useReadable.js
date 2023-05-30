import { useEffect, useState } from "react";
import { isReadable, readable } from "./readable";
import { useImmutable } from "./useImmutable";
/**
 * @function `useReadable` returns a React state management of a Readable
 * @param {ReadableCallback<State>} reader is an optional function for reducing new value at update, used only if `init` is not a Readable
 * @returns {UseReadableOuput<State>} is a constant (do not change in React LifeCycle) list of arguments, where first item is the current value of Readable, second item is a constant updater of Readable, third item is a constant Readable
 */
export const useReadable = (reader) => {
    const [state, setState] = useState(isReadable(reader) ? reader.valueOf() : undefined);
    const unmutable = useImmutable(() => {
        const binded = isReadable(reader) ? reader : readable(reader);
        return [binded.valueOf(), binded];
    });
    useEffect(() => {
        const unsubscribe = unmutable[1].subscribe(setState);
        return () => {
            unsubscribe();
        };
    }, []);
    unmutable[0] = state;
    return unmutable;
};
