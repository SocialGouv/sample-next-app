import { GlobalEnvironment } from "@socialgouv/kosko-charts/types";
import * as D from "io-ts/lib/Decoder";
export declare const AppComponentParams: D.Decoder<{
    containerPort: number;
    image: {
        name: string;
        tag: string;
    };
    name: string;
    namespace: {
        name: string;
    };
    servicePort: number;
} & Partial<{
    ingress: Partial<{
        secretName: string;
    }>;
    labels: Record<string, string>;
    limits: {
        cpu: string;
        memory: string;
    };
    requests: {
        cpu: string;
        memory: string;
    };
}>>;
export declare type AppComponentEnvironment = Omit<D.TypeOf<typeof AppComponentParams>, "namespace">;
export declare type Params = AppComponentEnvironment & GlobalEnvironment;
