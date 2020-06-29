DO
$do$
BEGIN
   IF (select usesuper=TRUE from pg_user where usename = CURRENT_USER) THEN
      CREATE EXTENSION citext;
   END IF;
END
$do$;

CREATE DOMAIN email AS citext
  CONSTRAINT custom_domain_email_check
  CHECK (value ~ '^[a-zA-Z0-9.!#$%&''*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$');

CREATE OR REPLACE FUNCTION trigger_set_timestamp ()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

--
-- ROLES
--
CREATE TABLE public.roles (
  role text NOT NULL PRIMARY KEY
);
COMMENT ON TABLE public.roles
  IS 'Roles table. it contains 3 roles admin, user and anonymous.';

INSERT INTO public.roles (role) VALUES ('admin');
INSERT INTO public.roles (role) VALUES ('user');
INSERT INTO public.roles (role) VALUES ('anonymous');

CREATE EXTENSION IF NOT EXISTS citext;
--
-- AUTH SCHEMA
--
create schema auth;

--
-- USERS
--
create table auth.users(
  id uuid DEFAULT gen_random_uuid() NOT NULL PRIMARY KEY,
  email email UNIQUE NOT NULL,
  password text NOT NULL CONSTRAINT password_min_length CHECK ( char_length(password) >= 8 ),
  name text NOT NULL,
  active boolean DEFAULT false NOT NULL,
  default_role text DEFAULT 'user'::text NOT NULL REFERENCES public.roles (role) on update cascade on delete restrict,
  secret_token uuid NOT NULL DEFAULT gen_random_uuid(),
  secret_token_expires_at timestamptz NOT NULL DEFAULT now(),
  created_at timestamp with time zone DEFAULT now() NOT NULL,
  updated_at timestamp with time zone DEFAULT now() NOT NULL
);

COMMENT ON TABLE auth.users
  IS 'Users table, unactivated by default';

CREATE TRIGGER "set_auth_users_updated_at"
  BEFORE UPDATE ON auth.users
  FOR EACH ROW
  EXECUTE PROCEDURE trigger_set_timestamp();

COMMENT ON TRIGGER "set_auth_users_updated_at" ON auth.users
  IS 'trigger to set value of column "updated_at" to current timestamp on row update';

--
-- USER_ROLES
--
CREATE TABLE auth.user_roles (
  id uuid DEFAULT gen_random_uuid() NOT NULL PRIMARY KEY,
  created_at timestamp with time zone DEFAULT now() NOT NULL,
  user_id uuid NOT NULL references auth.users (id) on update restrict on delete cascade,
  role text NOT NULL references public.roles (role) on update restrict on delete cascade,
  unique(user_id, role)
);

COMMENT ON TABLE auth.user_roles
  IS 'User_role table allow many-to-many relationship between users and roles';

WITH admin_row AS (
  INSERT INTO auth.users(email, password, name, default_role, active) VALUES ('sre@fabrique.social.gouv.fr', '$argon2i$v=19$m=4096,t=3,p=1$n9eoWSv+5sCgc7SjB5hLig$iBQ7NzrHHLkJSku/dCetNs+n/JI1CMdkWaoZsUekLU8', 'big boss', 'admin', true)
  RETURNING id, default_role
)
INSERT INTO auth.user_roles(role, user_id) SELECT default_role, id FROM admin_row;





--
-- REFRESH TOKENS
--
CREATE TABLE auth.refresh_tokens (
  refresh_token uuid DEFAULT gen_random_uuid() NOT NULL PRIMARY KEY,
  created_at timestamp with time zone DEFAULT now() NOT NULL,
  updated_at timestamp with time zone DEFAULT now() NOT NULL,
  expires_at timestamp with time zone NOT NULL,
  user_id uuid NOT NULL REFERENCES auth.users (id) on update restrict on delete cascade
);

COMMENT ON TABLE auth.refresh_tokens
  IS 'refresh_token table, contains current delivered_token with their expiry date';

CREATE TRIGGER "set_auth_refresh_tokens_updated_at"
  BEFORE UPDATE ON auth.refresh_tokens
  FOR EACH ROW
  EXECUTE PROCEDURE trigger_set_timestamp();

COMMENT ON TRIGGER "set_auth_refresh_tokens_updated_at" ON auth.refresh_tokens
  IS 'trigger to set value of column "updated_at" to current timestamp on row update';


--
-- Public user view
--
CREATE VIEW users AS SELECT id, name, email, active, default_role, secret_token, secret_token_expires_at, created_at, updated_at from auth.users;
