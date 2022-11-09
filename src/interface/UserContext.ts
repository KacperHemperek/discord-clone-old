import { User } from "@prisma/client";

export interface EmailLoginArgs {
  email: string;
  password: string;
}

export interface EmailSignUpArgs extends EmailLoginArgs {
  confirm: string;
  name: string;
}

export interface UserContextType {
  emailLogin: ({ email, password }: EmailLoginArgs) => void;
  emailSignUp: ({ email, password, name, confirm }: EmailSignUpArgs) => void;
  logOut: () => void;
  currentUser: User | null | undefined;
}
