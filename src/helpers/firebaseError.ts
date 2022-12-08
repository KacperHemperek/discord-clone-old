import { FirebaseError } from "firebase/app";

export const formatFireabseError = (err: FirebaseError) => {
  console.log({
    formatedError: err.code.replace("Error: auth/", "").replace("-", " "),
  });

  return err.code.replace("Error: auth/", "").replaceAll("-", " ");
};

export const formatReactTostifyError = (err: any) => {
  console.log(err.message);
  //FirebaseError: Firebase: Error (auth/wrong-password).
  return err.message
    .replace("FirebaseError: Firebase: Error (auth/", "")
    .replaceAll("-", " ")
    .replace(")", "");
};
