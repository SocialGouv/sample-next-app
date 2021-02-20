import { changePasswordMutation } from "./activate.gql";
import { createRequestHandler } from "./activate_account";

export default createRequestHandler({
  error_message: "The secret token has expired or there is no account.",
  mutation: changePasswordMutation,
  success_message: "password changed !",
});
