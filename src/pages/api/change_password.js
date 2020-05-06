import { changePasswordMutation } from "./activate.gql";
import { createRequestHandler } from "./activate_account";

export default createRequestHandler({
  mutation: changePasswordMutation,
  error_message: "The secret token has expired or there is no account.",
  success_message: "password changed !",
});
