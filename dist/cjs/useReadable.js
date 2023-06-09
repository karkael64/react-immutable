"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useReadable = void 0;
const react_1 = require("react");
const readable_1 = require("./readable");
const useImmutable_1 = require("./useImmutable");
/**
 * returns a React state management of a Readable
 * @param reader is a callback with `set` as parameter, which should be called each time the readable value changes
 * @returns is an immutable (do not change in React LifeCycle) list of arguments, where first item is the current value of Readable, second item is an immutable Readable
 */
const useReadable = (reader) => {
    const [state, setState] = (0, react_1.useState)((0, readable_1.isReadable)(reader) ? reader.valueOf() : undefined);
    const unmutable = (0, useImmutable_1.useImmutable)(() => {
        const binded = (0, readable_1.isReadable)(reader) ? reader : (0, readable_1.readable)(reader);
        return [binded.valueOf(), binded];
    });
    (0, react_1.useEffect)(() => {
        const unsubscribe = unmutable[1].subscribe(setState);
        return () => {
            unsubscribe();
        };
    }, []);
    unmutable[0] = state;
    return unmutable;
};
exports.useReadable = useReadable;
