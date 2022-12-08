import { FirebaseError } from "firebase/app";

enum AUTH_ERROR {
  wrong_password = "Wrong Password",
  invalid_password = "Invalid Password",
  email_already_exists = "Account with this email already exists",
  invalid_email = "Given email is invalid",
  user_not_found = "User does not exist",
  name_not_provided = "User name is not provided",
  passwords_not_match = "Passwords must match",
  unknown_error = "Unknown authentication error",
}

export const formatFireabseError = (err: FirebaseError) => {
  if (!err) {
    return AUTH_ERROR.unknown_error;
  }
  console.warn(err);

  if (err.message.match(/wrong-password/gi)) {
    return AUTH_ERROR.wrong_password;
  }
  if (err.message.match(/invalid-password/gi)) {
    return AUTH_ERROR.invalid_password;
  }
  if (err.message.match(/email-already-exists/gi)) {
    return AUTH_ERROR.email_already_exists;
  }
  if (err.message.match(/invalid-email/gi)) {
    return AUTH_ERROR.invalid_email;
  }
  if (err.message.match(/user-not-found/gi)) {
    return AUTH_ERROR.user_not_found;
  }
  if (err.message.match(/name-not-provided/gi)) {
    return AUTH_ERROR.name_not_provided;
  }
  if (err.message.match(/passwords-does-not-match/gi)) {
    return AUTH_ERROR.passwords_not_match;
  }

  return AUTH_ERROR.unknown_error;
};

export const formatReactTostifyError = (err: any) => {
  console.log(err.message);
  return err.message;
};
