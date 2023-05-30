import { render, waitFor } from "@testing-library/react";
import { useEffect } from "react";
import { expect, it, test } from "vitest";
import { useReadable } from "../src/useReadable";
import { Readable, readableFromWritable } from "../src/readable";
import "global-jsdom/register";
import { Writable, writable } from "../src";

// global usage
const textStorage = writable("");
const textToWrite = "Hello Wesley";
const text = readableFromWritable(textStorage);
const countStorage = writable(0);

const CompGlobalA: React.FC = () => {
  const [textState] = useReadable(text);

  useEffect(() => {
    if (textState.length < textToWrite.length && textState.length % 2) {
      setTimeout(() =>
        textStorage.update((current, set) =>
          set(textState + textToWrite[textState.length])
        )
      );
    }
  }, [textState]);

  return <span>{textState}</span>;
};

const CompGlobalB: React.FC = () => {
  const [textState] = useReadable(text);

  useEffect(() => {
    if (textState.length < textToWrite.length && (textState.length + 1) % 2) {
      setTimeout(() =>
        textStorage.set(textState + textToWrite[textState.length])
      );
    }
  }, [textState]);

  return <span>{`${text}`}</span>;
};

const CompNotListening: React.FC = () => {
  return <span>{`${text}`}</span>;
};

// scoped usage
const CompInner: React.FC<{ count: Readable<number | string> }> = ({
  count,
}) => {
  const [countState] = useReadable(count);

  return <span>{`${countState}`}</span>;
};

const CompOuter: React.FC<{ countStorage: Writable<number> }> = ({
  countStorage,
}) => {
  const [countState, countBind] = useReadable<number>((set) =>
    countStorage.subscribe(set)
  );
  setTimeout(() => countStorage.set(3));

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
  const { container, getAllByText } = render(
    <CompOuter countStorage={countStorage} />
  );

  expect(container).toMatchSnapshot();
  await waitFor(() => expect(getAllByText("3")).toHaveLength(2));
  expect(container).toMatchSnapshot();
});
