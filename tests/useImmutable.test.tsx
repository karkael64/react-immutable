import { useState } from "react";
import { expect, test } from "vitest";
import { render, waitFor } from "@testing-library/react";
import { useImmutable } from "../src";
import "global-jsdom/register";
import {
  useEffectOnFirstRender,
  useEffectOnEveryRender,
  useCallOnChange,
  registerFn,
} from "./common";

const Comp: React.FC<{
  onRender(): void;
  onStateChange(): void;
  onImmutableChange(): void;
}> = ({ onRender, onStateChange, onImmutableChange }) => {
  const [state, setState] = useState({ user: "none" });
  const immutable = useImmutable(state);

  useEffectOnFirstRender(() => {
    const firstId = setTimeout(() => setState({ user: "me" }), 10);
    const secondId = setTimeout(() => setState({ user: "you" }), 100);
    return () => {
      clearTimeout(firstId);
      clearTimeout(secondId);
    };
  });

  useEffectOnEveryRender(onRender);
  useCallOnChange(onStateChange, state);
  useCallOnChange(onImmutableChange, immutable);

  return <p>{state.user}</p>;
};

test("useImmutable", async () => {
  const onRender = registerFn();
  const onStateChange = registerFn();
  const onImmutableChange = registerFn();

  const { queryByText } = render(
    <Comp
      onRender={onRender}
      onStateChange={onStateChange}
      onImmutableChange={onImmutableChange}
    />
  );

  expect(queryByText("none")).toBeTruthy();
  expect(queryByText("me")).toBeNull();
  expect(queryByText("you")).toBeNull();

  await waitFor(() => expect(onRender.calls.length).toBe(3));
  expect(onStateChange.calls.length).toBe(3);
  expect(onImmutableChange.calls.length).toBe(1);

  expect(queryByText("none")).toBeNull();
  expect(queryByText("me")).toBeNull();
  expect(queryByText("you")).toBeTruthy();
});
