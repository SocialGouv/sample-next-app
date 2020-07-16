import { GlobalEnvironment, NamedComponentEnvironment } from "@socialgouv/kosko-charts/types";
import * as D from "io-ts/lib/Decoder";
export declare const PostresSecretParameters: D.Decoder<{
    database: string;
    host: string;
    password: string;
    user: string;
} & Partial<{
    sslmode: string;
}>>;
export interface PostresSecretParameters extends NamedComponentEnvironment {
    database: string;
    user: string;
    password: string;
    host: string;
    sslmode?: string;
}
export declare type Params = PostresSecretParameters & GlobalEnvironment;
