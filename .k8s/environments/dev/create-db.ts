import { ok } from "assert";
import { getDevDatabaseParameters } from "@socialgouv/kosko-charts/components/azure-db/params";

ok(process.env.CI_COMMIT_SHORT_SHA, "Expect CI_COMMIT_SHORT_SHA to be defined");

const sha = process.env.CI_COMMIT_SHORT_SHA;

// create database autodevops_[sha] and user_[sha]
export default getDevDatabaseParameters({ suffix: sha });
