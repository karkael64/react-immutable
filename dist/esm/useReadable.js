import { useEffect, useState } from "react";
import { isReadable, readable } from "./readable";
import { useImmutable } from "./useImmutable";
/**
 * returns a React state management of a Readable
 * @param reader is a callback with `set` as parameter, which should be called each time the readable value changes
 * @returns is an immutable (do not change in React LifeCycle) list of arguments, where first item is the current value of Readable, second item is an immutable Readable
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
