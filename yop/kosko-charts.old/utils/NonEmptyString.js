"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.NonEmptyString = void 0;
const pipeable_1 = require("fp-ts/lib/pipeable");
const Decoder_1 = require("io-ts/lib/Decoder");
exports.NonEmptyString = pipeable_1.pipe(Decoder_1.string, Decoder_1.refine((s) => typeof s === "string" && s.length > 0, "NonEmptyString"));
//# sourceMappingURL=NonEmptyString.js.map