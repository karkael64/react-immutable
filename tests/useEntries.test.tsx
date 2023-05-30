import { expect, test } from "vitest";
import { EntriesMethods, useEntries } from "../src";
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
  onStateChange(id?: number): void;
  onEntriesChange(entries: EntriesMethods<{ state: number }>): void;
  onEntriesStateChange(entry?: { state: number }): void;
  onReadBaseState(id?: number): void;
}> = ({
  onRender,
  onStateChange,
  onEntriesChange,
  onEntriesStateChange,
  onReadBaseState,
}) => {
  const [state, setState] = useState(-4.2);
  const entries = useEntries({ state });

  useEffectOnFirstRender(() => {
    const firstId = setTimeout(() => setState(9), 1);
    const secondId = setTimeout(() => setState(1024), 10);
    const lastId = setTimeout(
      () => onReadBaseState(entries.getLast()?.state),
      100
    );
    return () => {
      clearTimeout(firstId);
      clearTimeout(secondId);
      clearTimeout(lastId);
    };
  });

  useEffectOnEveryRender(onRender);
  useCallOnChange(onStateChange, state);
  useCallOnChange(onEntriesChange, entries);
  useCallOnChange(onEntriesStateChange, entries.getLast());

  return <p>{state}</p>;
};

test("useEntries", async () => {
  const onRender = registerFn();
  const onStateChange = registerFn();
  const onEntriesChange = registerFn();
  const onEntriesStateChange = registerFn();
  const onReadBaseState = registerFn();

  const { queryByText } = render(
    <Comp
      onRender={onRender}
      onStateChange={onStateChange}
      onEntriesChange={onEntriesChange}
      onEntriesStateChange={onEntriesStateChange}
      onReadBaseState={onReadBaseState}
    />
  );

  expect(queryByText("-4.2")).toBeTruthy();
  expect(queryByText("9")).toBeNull();
  expect(queryByText("1024")).toBeNull();

  const entries: EntriesMethods<{ state: number }> =
    onEntriesChange.calls[0]?.[0];
  expect(entries).a("object");
  expect(entries.countEntries()).toBe(1);
  expect(entries.getFirst()).toBeDefined();
  expect(entries.getFirst()).toBe(entries.getLast());

  await waitFor(() => expect(onReadBaseState.calls.length).toBe(1));
  expect(onReadBaseState.calls[0]?.[0]).toBe(1024);
  expect(onRender.calls.length, "should 1st render + 2 updates").toBe(3);
  expect(onStateChange.calls.length, "should be same as onRender").toBe(
    onRender.calls.length
  );
  expect(
    onEntriesStateChange.calls.length,
    "the last value should be listened in a useEffect dep"
  ).toBe(onRender.calls.length);
  expect(onEntriesChange.calls.length, "the entries object is immutable").toBe(
    1
  );

  expect(entries.countEntries()).toBe(3);
  expect(entries.getFirst()).not.toBe(entries.getLast());
  expect(entries.getEntries()[0]).toBe(entries.getFirst());
  expect(entries.getEntries()[2]).toBe(entries.getLast());
  expect(entries.getEntries()[0]?.state).toBe(-4.2);
  expect(entries.getEntries()[1]?.state).toBe(9);
  expect(entries.getEntries()[2]?.state).toBe(1024);

  expect(queryByText("-4.2")).toBeNull();
  expect(queryByText("9")).toBeNull();
  expect(queryByText("1024")).toBeTruthy();
});
