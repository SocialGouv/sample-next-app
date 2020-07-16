import { pipe } from "fp-ts/lib/pipeable";
import { Decoder, refine, string } from "io-ts/lib/Decoder";

export const NonEmptyString: Decoder<string> = pipe(
  string,
  refine(
    (s: unknown): s is string => typeof s === "string" && s.length > 0,
    "NonEmptyString"
  )
);
