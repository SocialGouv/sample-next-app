apiVersion: batch/v1
kind: Job
metadata:
  annotations:
    app.github.com/job: {{ .Env.GITHUB_JOB }}
    app.github.com/ref: {{ .Env.GITHUB_REF }}
    app.github.com/repo: {{ .Env.GITHUB_REPOSITORY }}
    app.github.com/run: {{ .Env.GITHUB_RUN_ID }}
    app.github.com/sha: {{ .Env.GITHUB_SHA | strings.Trunc 7 }}
  labels:
    component: ci-create-db-job
    application: {{ .Env.PROJECT_NAME }}
    owner: {{ .Env.PROJECT_NAME }}
    team: {{ .Env.PROJECT_NAME }}
  name: create-db-user
  namespace: {{ .Env.NAMESPACE }}
spec:
  backoffLimit: 5
  template:
    spec:
      containers:
        - command:
            - create-db-user
          env:
            - name: NEW_DB_NAME
              valueFrom:
                secretKeyRef:
                  key: PGDATABASE
                  name: {{ .Env.DB_SECRET_NAME }}
            - name: NEW_USER
              valueFrom:
                secretKeyRef:
                  key: PGUSER
                  name: {{ .Env.DB_SECRET_NAME }}
            - name: NEW_PASSWORD
              valueFrom:
                secretKeyRef:
                  key: PGPASSWORD
                  name: {{ .Env.DB_SECRET_NAME }}
            - name: PGHOST
              valueFrom:
                secretKeyRef:
                  key: PGHOST
                  name: {{ .Env.DB_SECRET_NAME }}
            - name: NEW_DB_EXTENSIONS
              value: hstore pgcrypto citext uuid-ossp
          envFrom:
            - secretRef:
                name: pg-scaleway
          image: {{ .Env.JOB_IMAGE }}:{{ .Env.JOB_IMAGE_TAG }}
          imagePullPolicy: IfNotPresent
          name: create-db-user
          resources:
            limits:
              cpu: 300m
              memory: 256Mi
            requests:
              cpu: 100m
              memory: 64Mi
      restartPolicy: Never
  ttlSecondsAfterFinished: 86400