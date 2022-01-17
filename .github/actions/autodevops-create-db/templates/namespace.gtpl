{{ $values := (datasource "values") }}

apiVersion: v1
kind: Namespace
metadata:
  annotations:
    socialgouv/creator: autodevops
    {{ if $values.ttl }}
    janitor/ttl: {{ $values.ttl }}
    {{ end }}
    field.cattle.io/creatorId: gitlab
    field.cattle.io/projectId: {{ .Env.RANCHER_PROJECT_ID }}
    git/branch: {{ .Env.GITHUB_REF }}
    git/remote: {{ .Env.GITHUB_REPOSITORY }}
    app.github.com/job: {{ .Env.GITHUB_JOB }}
    app.github.com/ref: {{ .Env.GITHUB_REF }}
    app.github.com/repo: {{ .Env.GITHUB_REPOSITORY }}
    app.github.com/run: "{{ .Env.GITHUB_RUN_ID }}"
    app.github.com/sha: {{ .Env.GITHUB_SHA | strings.Trunc 7 }}
  labels:
    component: {{ $values.component }}
    application: {{ .Env.PROJECT_NAME }}
    owner: {{ .Env.PROJECT_NAME }}
    team: {{ .Env.PROJECT_NAME }}
    cert: wildcard
  name: {{ .Env.NAMESPACE }}
