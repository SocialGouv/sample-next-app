{{- define "job" -}}

{{ $run := $.run }}
{{ $with := $.with }}
{{ $parentWith := $.parentWith }}
{{ $val := $.Values }}

{{ $user := "" }}
{{ if kindIs "invalid" $run.user }}
{{ $user = "1000" }}
{{ else }}
{{ $user = ($run.user | toString) }}
{{ end }}

{{ $group := "" }}
{{ if kindIs "invalid" $run.group }}
{{ $group = ($user | toString) }}
{{ else }}
{{ $group = $run.group }}
{{ end }}

{{ $fsGroup := "" }}
{{ if kindIs "invalid" $run.fsGroup }}
{{ $fsGroup = $user }}
{{ else }}
{{ $fsGroup = ($run.fsGroup | toString) }}
{{ end }}

---
apiVersion: batch/v1
kind: Job
metadata:
  name: {{ $run.jobName }}
  {{ if $run.namespace }}
  namespace: {{ tpl $run.namespace $ }}
  {{ else }}
  namespace: {{ or $val.namespace $val.global.jobNamespace }}
  {{ end }}
  annotations:
    kapp.k14s.io/nonce: ""
    kapp.k14s.io/update-strategy: fallback-on-replace
    kapp.k14s.io/change-group: "kube-workflow/{{ $val.global.namespace }}"
    {{- if $run.stage }}
    kapp.k14s.io/change-group.kube-workflow-stage: "kube-workflow/{{ $run.stage }}.{{ $val.global.namespace }}"
    {{- end }}
    {{- range $scope := $run.scopes }}
    kapp.k14s.io/change-group.{{ $scope }}: "kube-workflow/{{ $scope }}.{{ $val.global.namespace }}"
    {{- end }}
    {{- range $need := $run.needs }}
    kapp.k14s.io/change-rule.{{ $need }}: "upsert after upserting kube-workflow/{{ $need }}.{{ $val.global.namespace }}"
    {{- end }}
    {{- range $need := $.Values.needs }}
    kapp.k14s.io/change-rule.{{ $need }}: "upsert after upserting kube-workflow/{{ $need }}.{{ $val.global.namespace }}"
    {{- end }}
    janitor/ttl: "1800"
spec:
  backoffLimit: 2
  activeDeadlineSeconds: 3600
  ttlSecondsAfterFinished: 1800
  template:
    metadata:
      annotations:
      {{- if $run.annotations }}
      {{- range $key, $val := $run.annotations }}
        "{{ $key }}": "{{ $val }}"
      {{- end }}
      {{- end }}
      labels:
      {{- if $run.labels }}
      {{- range $key, $val := $run.labels }}
        "{{ $key }}": "{{ $val }}"
      {{- end }}
      {{- end }}
    spec:
      {{- if $run.serviceAccountName }}
      serviceAccountName: "{{ $run.serviceAccountName }}"
      {{- end }}
      restartPolicy: Never
      initContainers:
      {{- if or (not (hasKey $run "checkout")) $run.checkout }}
        - name: degit-repository
          image: {{ .Values.degitImage }}
          command:
            - sh
            - -c
            - |
              degit {{ or $val.repository $val.global.repository }}#{{ or $val.gitBranch $val.global.gitBranch }} \
                /workspace
          securityContext:
            runAsUser: 1000
            runAsGroup: 1000
            fsGroup: {{ or $run.fsGroup (or $run.user "1000") }}
          volumeMounts:
            - name: workspace
              mountPath: /workspace
      {{- end }}
      {{- if $run.action }}
        - name: degit-action
          image: {{ .Values.degitImage }}
          command:
            - sh
            - -c
            - degit {{ $run.action | replace "@" "#" }} /action
          securityContext:
            runAsUser: 1000
            runAsGroup: 1000
            fsGroup: {{ or $run.fsGroup (or $run.user "1000") }}
          volumeMounts:
            - name: action
              mountPath: /action
      {{- end }}
      containers:
        - name: job
          image: "{{ tpl (or $run.image $.Values.image) $ }}"
          imagePullPolicy: IfNotPresent
          {{ if $run.image }}
          {{ if  $run.workingDir }}
          workingDir: "{{ $run.workingDir }}"
          {{- end }}
          {{ else }}
          workingDir: "{{ or $run.workingDir "/workspace" }}"
          {{- end }}
          {{- if $run.envFrom }}
          envFrom: {{ tpl ($run.envFrom | toJson) $ }}
          {{- end }}
          env:
            {{- if $run.env }}
              {{- tpl ($run.env | toYaml) $ | nindent 12 }}
            {{- end }}
            {{- range $name, $value := $run.vars }}
            - name: "{{ $name }}"
              value: "{{ tpl $value $ }}"
            {{- end }}

          {{- if or $run.entrypoint $run.run $run.action $run.outputs }}
          command:
            {{- if $run.entrypoint }}
            {{- tpl ($run.entrypoint | toYaml) $ | nindent 12 }}
            {{- else }}
            - /bin/{{ or $run.shell "bash" }}
            - -c
            {{- end }}
            {{- if or $run.run $run.action $run.outputs }}
            - |
              set -e
              {{- if $run.run }}
              {{- nindent 14 (tpl $run.run $) }}
              {{- else if $run.action }}
              /action/action.sh
              {{- end }}
              {{- if $run.outputs }}
              {{- range $output := $run.outputs }}
              {{- range $i, $scope := $run.scopes }}
              mkdir -p "$(dirname /workflow/vars/{{ $scope }}/{{ $output }})"
              {{- if eq $i 0 }}
              echo "${{ $output }}">/workflow/vars/{{ $scope }}/{{ $output }}
              {{- else }}
              ln -s -f /workflow/vars/{{ index $run.scopes 0 }}/{{ $output }} /workflow/vars/{{ $scope }}/{{ $output }}
              {{- end }}
              {{- end }}
              {{- end }}
              {{- end }}
            {{- end }}
          {{- end }}
          {{- if $run.args }}
          args:
          {{- range $arg := $run.args }}
            - "{{ tpl $arg $ }}"
          {{- end }}
          {{- end }}
          securityContext:
            runAsUser: {{ $user }}
            runAsGroup: {{ $group }}
            fsGroup: {{ $fsGroup }}
          volumeMounts:
            - name: workspace
              mountPath: /workspace
            - name: action
              mountPath: /action
            - name: workflow
              mountPath: /workflow
              subPath: {{ $val.global.branchSlug }}/{{ $val.global.sha }}
            {{- if $run.volumeMounts }}
            {{- tpl ($run.volumeMounts | toYaml) . | nindent 12 }}
            {{- end }}

      volumes:
        - name: workspace
          emptyDir: {}
        - name: action
          emptyDir: {}
        {{/*
        {{ if .Values.global.extra.jobs.sharedStorage.enabled }}
        - name: workflow
          persistentVolumeClaim:
            claimName: jobs-shared-storage
        {{- end }}
        */}}
        {{- if $run.volumes }}
          {{- tpl ($run.volumes | toYaml) $ | nindent 8 }}
        {{- end }}

{{- end -}}
