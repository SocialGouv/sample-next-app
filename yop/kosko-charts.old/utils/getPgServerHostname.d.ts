declare type EnvironmentName = "dev" | "preprod" | "prod";
export declare const getPgServerHostname: (appName: string, env?: EnvironmentName) => string;
export {};
