declare type UnionToIntersection<T> = (T extends any ? (k: T) => void : never) extends (k: infer I) => void ? I : never;
export declare function merge<T extends any[]>(...data: T): UnionToIntersection<T[number]>;
export {};
