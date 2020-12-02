import env from "@kosko/env";
import { SealedSecret } from "@kubernetes-models/sealed-secrets/bitnami.com/v1alpha1/SealedSecret";
import { Job } from "kubernetes-models/batch/v1/Job";

import { loadYaml } from "@socialgouv/kosko-charts/utils/getEnvironmentComponent";
import { updateMetadata } from "@socialgouv/kosko-charts/utils/updateMetadata";
import gitlab from "@socialgouv/kosko-charts/environments/gitlab";

import { create } from "@socialgouv/kosko-charts/components/azure-pg";

export default () => {

  const envParams = gitlab(process.env);

  if (env.env === "dev") {
    const jobs = create({
      env,
    });
    const job = jobs[0] as Job
    if (job.metadata && job.metadata.namespace) {
      job.metadata.namespace =  envParams.namespace.name
     }
    return jobs
  }

  // in prod/preprod, we try to add a fixed sealed-secret
  const secret = loadYaml<SealedSecret>(env, `pg-user.sealed-secret.yaml`);
  if (!secret) {
    return [];
  }


  // add gitlab annotations
  updateMetadata(secret, {
    annotations: envParams.annotations || {},
    labels: envParams.labels || {},
    namespace: envParams.namespace,
  });
  return [secret];
};
