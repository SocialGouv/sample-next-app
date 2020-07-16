import { mapLeft } from "fp-ts/lib/Either";
import { pipe } from "fp-ts/lib/pipeable";
import {
  array,
  boolean,
  nullable,
  number,
  string,
  type,
} from "io-ts/lib/Decoder";

import { onDecodeError } from "./onDecodeError";

test("onDecodeError should draw an error mesage", () => {
  const decoder = type({
    a: string,
    b: number,
    c: array(boolean),
    d: nullable(string),
  });
  expect(() =>
    pipe(decoder.decode({ c: [1] }), mapLeft(onDecodeError))
  ).toThrowErrorMatchingSnapshot();
});
