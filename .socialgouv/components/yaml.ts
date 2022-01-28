import env from "@kosko/env";
import { loadFile } from "@kosko/yaml";
import { importYamlFolder } from "@socialgouv/kosko-charts/components/yaml";
import path from "path";
import { existsSync } from "fs";

const getManifests = async () => {
  const manifests = [];

  // files in env/[env]/yaml/*
  manifests.push(
    importYamlFolder(path.join(__dirname, "..", `environments/${env.env}/yaml`))
  );

  // add pg-user if any env/[env]/pg-user.sealed-secret.yaml
  const pgUserPath = path.join(
    __dirname,
    `../environments/${env.env}/pg-user.sealed-secret.yaml`
  );
  if (existsSync(pgUserPath)) {
    manifests.push(loadFile(pgUserPath));
  }
  return manifests;
};

export default getManifests;
