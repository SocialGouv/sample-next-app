"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Integer = void 0;
const pipeable_1 = require("fp-ts/lib/pipeable");
const Decoder_1 = require("io-ts/lib/Decoder");
exports.Integer = pipeable_1.pipe(Decoder_1.number, Decoder_1.refine((n) => typeof n === "number" && Number.isInteger(n), "Integer"));
//# sourceMappingURL=Integer.js.map