import { failure, success } from "io-ts/lib/Decoder";

import { Integer } from "./Integer";

test("should succeed validating a valid value", () => {
  expect(Integer.decode(1)).toStrictEqual(success(1));
});

test("should fail validation an invalid value", () => {
  expect(Integer.decode(null)).toStrictEqual(failure(null, "number"));
  expect(Integer.decode(0.1)).toStrictEqual(failure(0.1, "Integer"));
});
