import { GlobalEnvironment, NamedComponentEnvironment } from "@socialgouv/kosko-charts/types";
import * as D from "io-ts/lib/Decoder";
export declare const CreateDbComponentParams: D.Decoder<{
    database: string;
    password: string;
    user: string;
} & Partial<{
    extensions: string;
}>>;
export interface BaseCreateDbJobParameters {
    database: string;
    user: string;
    password: string;
    extensions?: string;
}
export interface CreateDbJobParameters extends NamedComponentEnvironment, BaseCreateDbJobParameters {
}
interface GetDevDababaseParameters {
    suffix?: string;
}
export declare function getDevDatabaseParameters({ suffix, }: GetDevDababaseParameters): BaseCreateDbJobParameters;
export declare function getProdDatabaseParameters(): BaseCreateDbJobParameters;
export declare type Params = CreateDbJobParameters & GlobalEnvironment;
export {};
