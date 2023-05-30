import { fireEvent, waitFor, render } from "@testing-library/react";
import { useState } from "react";
import { it, expect } from "vitest";
import { useCallbackBase } from "../src";
import { registerFn, useCallOnChange, useEffectOnEveryRender } from "./common";
import "global-jsdom/register";

const Comp: React.FC<{
  id: number;
  onClick(id: number): void;
  onRender(): void;
  onClickHandlerChange(): void;
}> = ({ id, onClick, onRender, onClickHandlerChange }) => {
  const [count, setCount] = useState(0);
  const handleClick = useCallbackBase({ id, count, onClick }, (base) => () => {
    base.onClick(base.id);
    setCount(base.count + 1);
  });
  useEffectOnEveryRender(onRender);
  useCallOnChange(onClickHandlerChange, handleClick);
  return <button onClick={handleClick}>{count}</button>;
};

it("useCallbackBase", async () => {
  const onRender = registerFn();
  const onClickHandlerChange = registerFn();
  const { getByRole } = render(
    <Comp
      onClick={registerFn()}
      onRender={onRender}
      onClickHandlerChange={onClickHandlerChange}
      id={123}
    />
  );
  const button = getByRole("button");

  expect(button.textContent).toBe("0");
  fireEvent.click(button);
  fireEvent.click(button);
  fireEvent.click(button);
  await waitFor(() => expect(button.textContent).toBe("3"));

  expect(onRender.calls.length, "should 1st render + 3 click events").toBe(4);
  expect(
    onClickHandlerChange.calls.length,
    "should never change after first render"
  ).toBe(1);
});
