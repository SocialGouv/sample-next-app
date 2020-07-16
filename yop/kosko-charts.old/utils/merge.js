"use strict";
/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-explicit-any */
//
// Inspired by https://github.com/tommy351/kosko/blob/%40kosko/env%400.5.2/packages/env/src/merge.ts
//
Object.defineProperty(exports, "__esModule", { value: true });
exports.merge = void 0;
const tslib_1 = require("tslib");
const deepmerge_1 = tslib_1.__importDefault(require("deepmerge"));
// eslint-disable-next-line import/default
const is_plain_object_1 = tslib_1.__importDefault(require("is-plain-object"));
function merge(...data) {
    return deepmerge_1.default.all(data, {
        isMergeableObject: is_plain_object_1.default,
    });
}
exports.merge = merge;
//# sourceMappingURL=merge.js.map