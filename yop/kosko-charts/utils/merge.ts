/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-explicit-any */
//
// Inspired by https://github.com/tommy351/kosko/blob/%40kosko/env%400.5.2/packages/env/src/merge.ts
//

import deepMerge from "deepmerge";
// eslint-disable-next-line import/default
import isPlainObject from "is-plain-object";

// https://stackoverflow.com/a/48769843
type UnionToIntersection<T> = (T extends any ? (k: T) => void : never) extends (
  k: infer I
) => void
  ? I
  : never;

export function merge<T extends any[]>(
  ...data: T
): UnionToIntersection<T[number]> {
  return deepMerge.all(data, {
    isMergeableObject: isPlainObject,
  }) as any;
}
