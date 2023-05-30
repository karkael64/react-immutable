import { expect, test } from "vitest";
import { render } from "@testing-library/react";
import "global-jsdom/register";

const Comp: React.FC = () => {
  return <p>Test</p>;
};

test("env", () => {
  expect(test).toBeDefined();
});

test("env in component", () => {
  const { baseElement } = render(<Comp />);
  expect(baseElement).toMatchSnapshot();
});
