import { expect, test } from "vitest";
import { useBase } from "../src";
import "global-jsdom/register";
import { useState } from "react";
import { render, waitFor } from "@testing-library/react";
import {
  useEffectOnFirstRender,
  useEffectOnEveryRender,
  useCallOnChange,
  registerFn,
} from "./common";

const Comp: React.FC<{
  onRender(): void;
  onStateChange(id: number): void;
  onBaseChange(base: { state: number }): void;
  onBaseStateChange(id: number): void;
  onReadBaseState(id: number): void;
}> = ({
  onRender,
  onStateChange,
  onBaseChange,
  onBaseStateChange,
  onReadBaseState,
}) => {
  const [state, setState] = useState(-4.2);
  const base = useBase({ state });

  useEffectOnFirstRender(() => {
    const firstId = setTimeout(() => setState(9), 10);
    const secondId = setTimeout(() => setState(1024), 20);
    const lastId = setTimeout(() => onReadBaseState(base.state), 100);
    return () => {
      clearTimeout(firstId);
      clearTimeout(secondId);
      clearTimeout(lastId);
    };
  });

  useEffectOnEveryRender(onRender);
  useCallOnChange(onStateChange, state);
  useCallOnChange(onBaseChange, base);
  useCallOnChange(onBaseStateChange, base.state);

  return <p>{state}</p>;
};

test("useBase", async () => {
  const onRender = registerFn();
  const onStateChange = registerFn();
  const onBaseChange = registerFn();
  const onBaseStateChange = registerFn();
  const onReadBaseState = registerFn();

  const { queryByText } = render(
    <Comp
      onRender={onRender}
      onStateChange={onStateChange}
      onBaseChange={onBaseChange}
      onBaseStateChange={onBaseStateChange}
      onReadBaseState={onReadBaseState}
    />
  );

  expect(queryByText("-4.2")).toBeTruthy();
  expect(queryByText("9")).toBeNull();
  expect(queryByText("1024")).toBeNull();

  await waitFor(() => expect(onReadBaseState.calls.length).toBe(1));
  expect(onReadBaseState.calls[0][0]).toBe(1024);
  expect(onRender.calls.length, "should 1st render + 2 updates").toBe(3);
  expect(onStateChange.calls.length, "should be same as onRender").toBe(
    onRender.calls.length
  );
  expect(
    onBaseStateChange.calls.length,
    "the base value should be listened in a useEffect dep"
  ).toBe(onRender.calls.length);
  expect(onBaseChange.calls.length, "the base should be immutable").toBe(1);

  expect(queryByText("-4.2")).toBeNull();
  expect(queryByText("9")).toBeNull();
  expect(queryByText("1024")).toBeTruthy();
});
