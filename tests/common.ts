import { useEffect } from "react";

export const useEffectOnFirstRender = (fn: () => void | (() => void)) =>
  useEffect(() => {
    fn();
  }, []);

export const useEffectOnEveryRender = (fn: () => void | (() => void)) =>
  useEffect(() => {
    fn();
  });

export const useCallOnChange = <T>(fn: (item: T) => void, item: T) =>
  useEffect(() => {
    fn(item);
  }, [item]);

interface RegisterFn {
  (...args: any[]): void;
  calls: any[][];
}

export const registerFn = (): RegisterFn => {
  let calls: any[] = [];
  const callback = (...args: any[]) => {
    calls.push(args);
  };
  callback.calls = calls;
  return callback;
};
