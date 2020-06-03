
sealed_app_key() {
  local key=$1

  cat \
  | kubectl create secret generic app-env \
    -o yaml \
    --dry-run=client \
    --from-file=$key=/dev/stdin \
  | kubeseal \
    -o yaml \
    --merge-into .k8s/environements/prod/app-env.sealed-secret.yaml
}

export -f sealed_app_key

sealed_hasura_key() {
  local key=$1

  cat \
  | kubectl create secret generic app-env \
    -o yaml \
    --dry-run=client \
    --from-file=$key=/dev/stdin \
  | kubeseal \
    -o yaml \
    --merge-into .k8s/environements/prod/hasura-env.sealed-secret.yaml
}

export -f sealed_hasura_key

#
#
#

# ACCOUNT_EMAIL_SECRET
gpg --gen-random --armor 1 258 \
  | parallel --pipe --tee -v {} ::: \
    'sealed_app_key ACCOUNT_EMAIL_SECRET' \
    'sealed_hasura_key ACCOUNT_EMAIL_SECRET' \

# HASURA_GRAPHQL_ADMIN_SECRET
gpg --gen-random --armor 1 258 \
  | parallel --pipe --tee -v {} ::: \
    'sealed_app_key HASURA_GRAPHQL_ADMIN_SECRET' \
    'sealed_hasura_key HASURA_GRAPHQL_ADMIN_SECRET' \

# HASURA_GRAPHQL_JWT_SECRET
printf '{"type":"HS256","key": "'$(gpg --gen-random --armor 1 512)'"}' \
  | parallel \
    --pipe \
    --tee -v {} ::: \
    'sealed_app_key HASURA_GRAPHQL_JWT_SECRET' \
    'sealed_hasura_key HASURA_GRAPHQL_JWT_SECRET' \

# SENTRY_DSN
[[ -z $SENTRY_DSN ]] && echo "Expect SENTRY_DSN to be defined" && exit 1;
printf "${SENTRY_DSN}" \
  | parallel --pipe --tee -v {} ::: \
    'sealed_app_key SENTRY_DSN'

# SENTRY_TOKEN
[[ -z $SENTRY_TOKEN ]] && echo "Expect SENTRY_TOKEN to be defined" && exit 1;
printf "${SENTRY_TOKEN}" \
  | parallel --pipe --tee -v {} ::: \
    'sealed_app_key SENTRY_TOKEN'

# SMTP_URL
[[ -z $SMTP_URL ]] && echo "Expect SMTP_URL to be defined" && exit 1;
printf "${SMTP_URL}" \
  | parallel --pipe --tee -v {} ::: \
    'sealed_app_key SMTP_URL'

# SMTP_EMAIL_USER
[[ -z $SMTP_EMAIL_USER ]] && echo "Expect SMTP_EMAIL_USER to be defined" && exit 1;
printf "${SMTP_EMAIL_USER}" \
  | parallel --pipe --tee -v {} ::: \
    'sealed_app_key SMTP_EMAIL_USER'

# SMTP_EMAIL_PASSWORD
[[ -z $SMTP_EMAIL_PASSWORD ]] && echo "Expect SMTP_EMAIL_PASSWORD to be defined" && exit 1;
printf "${SMTP_EMAIL_PASSWORD}" \
  | parallel --pipe --tee -v {} ::: \
    'sealed_app_key SMTP_EMAIL_PASSWORD'
