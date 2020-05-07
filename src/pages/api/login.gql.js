export const loginQuery = `
  query login(
    $username: citext!
  ) {
    users: auth_users (
      where: {
        email: { _eq: $username}
      }
    ) {
      id
      password
      active
      default_role
      roles: user_roles {
        role
      }
    }
  }
  `;

export const refreshTokenMutation = `
  mutation insertRefreshToken (
    $refresh_token_data: auth_refresh_tokens_insert_input!
  ) {
    insert_data: insert_auth_refresh_tokens (
      objects: [$refresh_token_data]
    ) {
      returning {
        refresh_token
      }
    }
  }
`;
