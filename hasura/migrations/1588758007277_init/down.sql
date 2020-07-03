
DROP VIEW users;

DROP TABLE auth.refresh_tokens CASCADE;

DROP SCHEMA auth CASCADE;

DROP TABLE public.roles;

DROP FUNCTION trigger_set_timestamp;

DROP DOMAIN email;

DO
$do$
BEGIN
   IF (select usesuper=TRUE from pg_user where usename = CURRENT_USER) THEN
      DROP EXTENSION citext;
   END IF;
END
$do$;
