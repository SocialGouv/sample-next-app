"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.onDecodeError = void 0;
const Decoder_1 = require("io-ts/lib/Decoder");
exports.onDecodeError = (errorForest) => {
    throw new Error(["BadArgument:", Decoder_1.draw(errorForest)].join(""));
};
//# sourceMappingURL=onDecodeError.js.map