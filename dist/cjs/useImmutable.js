"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useImmutable = void 0;
const react_1 = require("react");
/**
 * this hook instanciates a variable which is immutable in React life cycle.
 * @param definitiveState the definitive state of your hook
 * @returns same value as `definitiveState` (if it is a function, returns the returned value).
 * @example
 * ```ts
 * const Comp: React.FC<{ initFormData: Object }> = ({ initFormData }) => {
 *   const savedInitFormData = useImmutable(initFormData);
 *   return (<>jsx</>);
 * };
 * ```
 * @example
 * YOU SHOULD NOT CODE LIKE THIS
 * ```ts
 * const Comp: React.FC = () => {
 *   const text = useImmutable('Hello world!');
 *   return (<p>{text}</p>);
 * };
 * ```
 * PLEASE USE THIS CODE INSTEAD
 * ```ts
 * const text = 'Hello world!';
 * const Comp: React.FC = () => {
 *   return (<p>{text}</p>);
 * };
 * ```
 */
const useImmutable = (definitiveState) => (0, react_1.useState)(definitiveState)[0];
exports.useImmutable = useImmutable;
