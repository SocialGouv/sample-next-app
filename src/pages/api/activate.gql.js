export const activateUserMutation = `
mutation activateUser($secret_token: uuid!, $now: timestamptz!, $password: String!) {
  update_user: update_auth_users(
    where: {
      _and: {
        secret_token: { _eq: $secret_token} ,
        secret_token_expires_at: {_gt: $now }
        active: {_eq: false}
      }
  	}
    _set: {
      active: true
      password: $password
  	}
  ){
    affected_rows
  }
}`;

export const changePasswordMutation = `
mutation updatePassword($secret_token: uuid!, $now: timestamptz!, $password: String!) {
  update_user: update_auth_users(
    where: {
      _and: {
        secret_token: { _eq: $secret_token} ,
        secret_token_expires_at: {_gt: $now }
      }
  	}
    _set: {
      active: true,
    	password: $password
  	}
  ){
    affected_rows
  }
}`;
