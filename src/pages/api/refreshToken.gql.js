export const getRefreshTokenQuery = `
query get_refresh_token(
  $refresh_token: uuid!,
  $current_timestampz: timestamptz!,
) {
  refresh_tokens: auth_refresh_tokens (
    where: {
      _and: [{
        refresh_token: { _eq: $refresh_token }
      }, {
        user: { active: { _eq: true }}
      }, {
        expires_at: { _gte: $current_timestampz }
      }]
    }
  ) {
    user {
      id
      active
      default_role
      roles: user_roles {
        role
      }
    }
  }
}
`;

// delete current refresh token, generate a new,
// insert the new refresh_token in the database

export const deletePreviousRefreshTokenMutation = `
  mutation (
    $old_refresh_token: uuid!,
    $new_refresh_token_data: auth_refresh_tokens_insert_input!
  ) {
    delete_refresh_token: delete_auth_refresh_tokens (
      where: {
        refresh_token: { _eq: $old_refresh_token }
      }
    ) {
      affected_rows
    }
    insert_refresh_token: insert_auth_refresh_tokens (
      objects: [$new_refresh_token_data]
    ) {
      affected_rows
    }
  }
  `;
