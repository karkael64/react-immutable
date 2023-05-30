import { render, waitFor } from "@testing-library/react";
import { useEffect } from "react";
import { expect, it, test } from "vitest";
import { useWritable } from "../src/useWritable";
import { writable, Writable } from "../src/writable";
import "global-jsdom/register";

// global usage
const text = writable("");
const textToWrite = "Hello Wesley";

const CompGlobalA: React.FC = () => {
  const [textState, setTextState] = useWritable(text);

  useEffect(() => {
    if (textState.length < textToWrite.length && textState.length % 2) {
      setTimeout(() =>
        setTextState(() => textState + textToWrite[textState.length])
      );
    }
  }, [textState, setTextState]);

  return <span>{textState}</span>;
};

const CompGlobalB: React.FC = () => {
  const [textState, setTextState] = useWritable(text);

  useEffect(() => {
    if (textState.length < textToWrite.length && (textState.length + 1) % 2) {
      setTimeout(() => setTextState(textState + textToWrite[textState.length]));
    }
  }, [textState, setTextState]);

  return <span>{`${text}`}</span>;
};

const CompNotListening: React.FC = () => {
  return <span>{`${text}`}</span>;
};

// scoped usage
const CompInner: React.FC<{ count: Writable<number, number | string> }> = ({
  count,
}) => {
  const [countState] = useWritable(count);
  setTimeout(() => count.set("3"));

  return <span>{`${countState}`}</span>;
};

const CompOuter: React.FC = () => {
  const [countState, , countBind] = useWritable(
    0,
    (current, value: string | number, set) => {
      const newValue = +value;
      set(isFinite(newValue) ? newValue : current);
    }
  );

  return (
    <div>
      <CompInner count={countBind} />
      <span>{countState}</span>
      <span>{typeof countState}</span>
    </div>
  );
};

it("should use bind globally", async () => {
  const { container, getAllByText } = render(
    <div>
      <CompGlobalA />
      <CompGlobalB />
      <CompNotListening />
    </div>
  );

  expect(container).toMatchSnapshot();
  await waitFor(() => expect(getAllByText(textToWrite)).toHaveLength(2));
  expect(container).toMatchSnapshot();
});

it("should use bind on properties", async () => {
  const { container, getAllByText } = render(<CompOuter />);

  expect(container).toMatchSnapshot();
  await waitFor(() => expect(getAllByText("3")).toHaveLength(2));
  expect(container).toMatchSnapshot();
});
