import { FirebaseError } from "firebase/app";

const AUTH_ERRORS = {
  "auth/wrong-password": "Wrong Password",
  "auth/invalid-password": "Invalid Password",
  "auth/email-already-in-use": "Account with this email already exists",
  "auth/invalid-email": "Given email is invalid",
  "auth/user-not-found": "User does not exist",
  "auth/name-not-provided": "User name is not provided",
  "auth/passwords-not-match": "Passwords must match",
  unknown_error: "Unknown authentication error",
};

const ErrorStrings = Object.keys(AUTH_ERRORS);
type AuthErrorKeys = keyof typeof AUTH_ERRORS;

export const formatFireabseError = (err: FirebaseError) => {
  //FIXME: Error is not defined when user is already created (register)
  // if (!err.code) {
  //   return AUTH_ERRORS.unknown_error;
  // }

  const isFirebaseErrorCode = (x: string): x is AuthErrorKeys =>
    ErrorStrings.includes(x);

  console.warn(err.code);
  if (!isFirebaseErrorCode(err.code)) {
    return AUTH_ERRORS.unknown_error;
  }

  return AUTH_ERRORS[err.code];
};

export const formatReactTostifyError = (err: any) => {
  console.log(err.message);
  return err.message;
};
