import { failure, success } from "io-ts/lib/Decoder";

import { NonEmptyString } from "./NonEmptyString";

test("should succeed validating a valid value", () => {
  expect(NonEmptyString.decode("a")).toStrictEqual(success("a"));
});

test("should fail validation an invalid value", () => {
  expect(NonEmptyString.decode(null)).toStrictEqual(failure(null, "string"));
  expect(NonEmptyString.decode("")).toStrictEqual(
    failure("", "NonEmptyString")
  );
});
