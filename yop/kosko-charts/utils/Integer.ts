import { pipe } from "fp-ts/lib/pipeable";
import { Decoder, number, refine } from "io-ts/lib/Decoder";

export const Integer: Decoder<number> = pipe(
  number,
  refine(
    (n: unknown): n is number => typeof n === "number" && Number.isInteger(n),
    "Integer"
  )
);
