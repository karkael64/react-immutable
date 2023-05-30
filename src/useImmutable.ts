import { useState } from "react";

/**
 * this hook instanciates a variable which is immutable in React life cycle.
 * @warn if you destroy the component, this hook will be trigger for the component replacing it
 * @param definitiveState the definitive state of your hook, may be retruned by a function
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
export const useImmutable = <T>(definitiveState: (() => T) | T): T =>
  useState(definitiveState)[0];
