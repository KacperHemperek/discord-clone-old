export interface EmailLoginArgs {
  email: string;
  password: string;
  redirect: string;
}

export interface EmailSignUpArgs extends EmailLoginArgs {
  confirm: string;
}

export interface UserContextType {
  emailLogin: ({ email, password, redirect }: EmailLoginArgs) => void;
  emailSignUp: ({
    email,
    password,
    redirect,
    confirm,
  }: EmailSignUpArgs) => void;
}
