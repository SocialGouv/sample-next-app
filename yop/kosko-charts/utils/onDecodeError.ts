import { DecodeError, draw } from "io-ts/lib/Decoder";

export const onDecodeError = (errorForest: DecodeError): never => {
  throw new Error(["BadArgument:", draw(errorForest)].join(""));
};
